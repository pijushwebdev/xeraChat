/* eslint-disable no-unused-vars */
import socket from "../../../utils/websocket";
import { apiSlice } from "../../app/api";
import { messagesApi } from "../messages/messagesApi";

const limit = import.meta.env.VITE_LIMIT_PER_QUERY;

export const conversationsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getConversations: builder.query({
      query: (email) => {
        return {
          url: `/conversations?participants_like=${email}&_sort=timestamp&_order=desc&_page=1&_limit=${limit}`,
          method: "GET",
        };
      },
      transformResponse: (apiResponse, meta, arg) => {
        const totalCount = meta.response.headers.get('X-Total-Count')
        return {
          data: apiResponse,
          totalCount
        };
      },
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
      
        try {
          //
          await cacheDataLoaded;
          // socket.off('conversation')
          socket.on("conversation", (data) => {
            // console.log(data);
            updateCachedData((draft) => {
              // console.log(JSON.stringify(draft));
              const conversation = draft.data.find((c) => c.id == data?.data?.id);
              
              if (conversation?.id) {
                conversation.message = data?.data?.message;
                conversation.timestamp = data?.data?.timestamp;
              } else {
                // do if the new conversation arrived
                // draft.push(data.data);
              }
            });
          });

          await cacheEntryRemoved;
          socket.disconnect();
        } catch (err) {
          //
          console.log(err);
          socket.disconnect();
        }
      },
    }),

    getMoreConversations: builder.query({
      query: ({email, page}) => {
        return {
          url: `/conversations?participants_like=${email}&_sort=timestamp&_order=desc&_page=${page}&_limit=${limit}`,
          method: "GET",
        };
      },
      async onQueryStarted({email}, { queryFulfilled, dispatch }) {
        
        try {
          const conversations = await queryFulfilled;

          if(conversations?.data?.length > 0){
            dispatch(apiSlice.util.updateQueryData('getConversations', email, (draft) => {
              return {
                data: [...draft.data, ...conversations.data],
                totalCount: Number(draft.totalCount)
              }
            }))
          }
          
        } catch (err) {
          console.log(err);
        }
      },
    }),

    getConversation: builder.query({
      query: ({ userEmail, participantEmail }) => {
        return {
          url: `/conversations?participants_like=${userEmail}-${participantEmail}&&participants_like=${participantEmail}-${userEmail}`,
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

        //optimistic messages cache update start
        // optimistic both conversation and messages
        // const patchResult = dispatch(
        //   apiSlice.util.updateQueryData(
        //     "getConversations",
        //     arg.sender,
        //     (draft) => {
        //       draft.push({
        //         ...arg.data,
        //          id: "pending", // for optimistic messages update i need a conversationId that is not available so i did it
        //       });
        //     }
        //   )
        // );

        const patchResult = dispatch(
          apiSlice.util.updateQueryData(
            "getConversations",
            arg.sender,
            (draft) => {
              draft.data.push({
                ...arg.data,
              });
            }
          )
        );

        try {
          const { data: conversation } = await queryFulfilled;

          if (conversation?.id) {
            const users = arg.data.users;

            const senderUser = users.find((user) => user.email === arg.sender); // here sender is a senderEmail
            const receiverUser = users.find(
              (user) => user.email !== arg.sender
            ); // here sender is a senderEmail

            //for optimistic update
            // dispatch(
            //   apiSlice.util.updateQueryData(
            //     "getConversations",
            //     arg.sender,
            //     (draft) => {
            //       const index = draft.findIndex(
            //         (conv) => conv.id === "pending"
            //       );
            //       if (index !== -1) {
            //         draft[index] = { ...draft[index], id: conversation.id };
            //       }
            //     }
            //   )
            // );

            // if conversation success then add it on message table
            // dispatch(
            //   messagesApi.endpoints.addMessage.initiate({
            //     conversationId: conversation?.id,
            //     sender: senderUser,
            //     receiver: receiverUser,
            //     message: arg.data.message,
            //     timestamp: new Date().getTime(),
            //   })
            // );

            const res = await dispatch(
              messagesApi.endpoints.addMessage.initiate({
                conversationId: conversation?.id,
                sender: senderUser,
                receiver: receiverUser,
                message: arg.data.message,
                timestamp: new Date().getTime(),
              })
            ).unwrap();

            dispatch(
              apiSlice.util.updateQueryData(
                "getMessages",
                res.conversationId.toString(),
                (draft) => {
                  draft.push(res);
                }
              )
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

        //optimistic conversation cache update start
        const patchResult = dispatch(
          apiSlice.util.updateQueryData(
            "getConversations",
            arg.sender,
            (draft) => {
              const draftConversation = draft.data.find((c) => c.id == arg.id);
              if (draftConversation) {
                draftConversation.message = arg.data.message;
                draftConversation.timestamp = arg.data.timestamp;
              }
            }
          )
        );
        // Optimistic cache update for messages
        // const patchResult2 = dispatch(
        //   apiSlice.util.updateQueryData(
        //     "getMessages",
        //     arg.id.toString(),
        //     (draft) => {
        //       draft.unshift({
        //         conversationId: arg.id,
        //         sender: arg.data.users.find(
        //           (user) => user.email === arg.sender
        //         ),
        //         receiver: arg.data.users.find(
        //           (user) => user.email !== arg.sender
        //         ),
        //         message: arg.data.message,
        //         timestamp: arg.data.timestamp || new Date().getTime(),
        //       });
        //     }
        //   )
        // );
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

            // dispatch(
            //   messagesApi.endpoints.addMessage.initiate({
            //     conversationId: conversation?.id,
            //     sender: senderUser,
            //     receiver: receiverUser,
            //     message: arg.data.message,
            //     timestamp: new Date().getTime(),
            //   })
            // );

            //update messages cache pessimistically start
            const res = await dispatch(
              messagesApi.endpoints.addMessage.initiate({
                conversationId: conversation?.id,
                sender: senderUser,
                receiver: receiverUser,
                message: arg.data.message,
                timestamp: new Date().getTime(),
              })
            ).unwrap();

            dispatch(
              apiSlice.util.updateQueryData(
                "getMessages",
                res.conversationId.toString(),
                (draft) => {
                  draft.push(res);
                }
              )
            );

            //update messages cache pessimistically end
          }
        } catch (err) {
          patchResult.undo();
          // patchResult2.undo();
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
