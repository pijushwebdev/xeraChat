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
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {  // arg --> sender, data
        try {
          const {data:conversation} = await queryFulfilled;

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
          console.log(err);
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
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {  // arg --> sender, data
        try {
          const {data:conversation} = await queryFulfilled;

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
          console.log(err);
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
