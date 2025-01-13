/* eslint-disable no-unused-vars */
import { apiSlice } from "../../app/api";
import { messagesApi } from "../messages/messagesApi";

export const conversationsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getConversations: builder.query({
      query: (email) => {
        return {
          url: `/conversations?participants_like=${email}&sort=timestamp&_order=desc`,
          method: "GET",
        };
      },
    }),
    getConversation: builder.query({
      query: ({ userEmail, participantEmail }) => {
        return {
          url: `/conversations?participants_like=${participantEmail}-${userEmail}&&participants_like=${userEmail}-${participantEmail}`,
          method: "GET",
        };
      },
    }),
    addConversation: builder.mutation({
      query: ({ sender, data }) => {
        return {
          url: `/conversations`,
          method: "POST",
          body: data,
        };
      },
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        // arg --> sender, data

        //optimistic cache update start
        const patchResult = dispatch(
          apiSlice.util.updateQueryData(
            "getConversations",
            arg.sender,
            (draft) => {
              draft.push({
                ...arg.data,
                id: "pending", // for optimistic update i need a conversationId that is not available so i did it
              });
            }
          )
        );
        //optimistic cache update partial end

        try {
          const { data: conversation } = await queryFulfilled;

          if (conversation?.id) {
            const users = arg.data.users;

            const senderUser = users.find((user) => user.email === arg.sender); // here sender is a senderEmail
            const receiverUser = users.find(
              (user) => user.email !== arg.sender
            ); // here sender is a senderEmail


            //for optimistic update
            dispatch(
              apiSlice.util.updateQueryData(
                "getConversations",
                arg.sender,
                (draft) => {
                  const index = draft.findIndex(
                    (conv) => conv.id === "pending"
                  );
                  if (index !== -1) {
                    draft[index] = { ...draft[index], id: conversation.id };
                  }
                }
              )
            );

            // if conversation success then add it on message table
            dispatch(
              messagesApi.endpoints.addMessage.initiate({
                conversationId: conversation?.id,
                sender: senderUser,
                receiver: receiverUser,
                message: arg.data.message,
                timestamp: new Date().getTime(),
              })
            );
          }
        } catch (err) {
          //
          // console.log(err);

          patchResult.undo();
        }
      },
    }),
    editConversation: builder.mutation({
      query: ({ id, data, sender }) => {
        return {
          url: `/conversations/${id}`,
          method: "PATCH",
          body: data,
        };
      },
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        // arg --> sender, data

        //optimistic cache update start
        const patchResult = dispatch(
          apiSlice.util.updateQueryData(
            "getConversations",
            arg.sender,
            (draft) => {
              const draftConversation = draft.find((c) => c.id == arg.id);
              if (draftConversation) {
                draftConversation.message = arg.data.message;
                draftConversation.timestamp = arg.data.timestamp;
              }
            }
          )
        );
        // Optimistic cache update for messages
        const patchResult2 = dispatch(
          apiSlice.util.updateQueryData(
            "getMessages",
            arg.id.toString(),
            (draft) => {
              draft.unshift({
                conversationId: arg.id,
                sender: arg.data.users.find(
                  (user) => user.email === arg.sender
                ),
                receiver: arg.data.users.find(
                  (user) => user.email !== arg.sender
                ),
                message: arg.data.message,
                timestamp: arg.data.timestamp || new Date().getTime(),
              });
            }
          )
        );
        //optimistic cache update end

        try {
          const { data: conversation } = await queryFulfilled;

          if (conversation?.id) {
            // if conversation success then add it on message table
            const users = arg.data.users;

            const senderUser = users.find((user) => user.email === arg.sender); // here sender is a senderEmail
            const receiverUser = users.find(
              (user) => user.email !== arg.sender
            ); // here sender is a senderEmail

            dispatch(
              messagesApi.endpoints.addMessage.initiate({
                conversationId: conversation?.id,
                sender: senderUser,
                receiver: receiverUser,
                message: arg.data.message,
                timestamp: new Date().getTime(),
              })
            );
          }
        } catch (err) {
          //
          // console.log(err);
          patchResult.undo();
          patchResult2.undo();
        }
      },
    }),
  }),
});

export const {
  useGetConversationsQuery,
  useGetConversationQuery,
  useAddConversationMutation,
  useEditConversationMutation,
} = conversationsApi;
