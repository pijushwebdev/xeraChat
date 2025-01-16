// import socket from "../../../utils/websocket";
import { apiSlice } from "../../app/api";

export const messagesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMessages: builder.query({
      query: (id) => {
        return {
          url: `/messages?conversationId=${id}&_sort=timestamp&_order=desc`,
          method: "GET",
        };
      },
      // async onCacheEntryAdded(
      //   arg,
      //   { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      // ) {
      //   try {
      //     //
      //     await cacheDataLoaded;
      //     // socket.off("message");
      //     socket.on("message", (data) => {
      //       updateCachedData((draft) => {
              
      //         // console.log(JSON.stringify(draft));
      //         const message = draft.find((m) => m.id == data?.data?.id);
              
      //         if (message) {
      //           message.message = data?.data?.message;
      //           message.timestamp = data?.data?.timestamp;
      //         } else {
      //           // draft.push(data.data);
      //         }
      //         // console.log(JSON.stringify(draft));
      //       });
      //     });

      //     await cacheEntryRemoved;
      //     socket.disconnect();
      //   } catch (err) {
      //     //
      //     console.log(err);
      //     socket.disconnect();
      //   }
      // },
    }),
    addMessage: builder.mutation({
      query: (data) => {
        return {
          url: `/messages`,
          method: "POST",
          body: data,
        };
      },
    }),
  }),
});

export const { useGetMessagesQuery, useAddMessageMutation } = messagesApi;
