import { apiSlice } from "../../app/api";



export const messagesApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({

        getMessages: builder.query({
            query: (id) => {
              return {
                url: `/messages?conversationId=${id}&sort=timestamp&_order=desc`,
                method: "GET",
              };
            },
          }),
          addMessage: builder.mutation({
            query: (data) => {
              return {
                url: `/messages`,
                method: "POST",
                body: data
              };
            },
          }),
    })
})

export const {useGetMessagesQuery, useAddMessageMutation} = messagesApi;