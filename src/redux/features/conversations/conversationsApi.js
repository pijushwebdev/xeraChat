import { apiSlice } from "../../app/api";

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
      query: (userEmail, participantEmail) => {
        return {
          url: `/conversations?participants_like=${userEmail}-${participantEmail}&&participants_like=${participantEmail}-${userEmail}`,
          method: "GET",
        };
      },
    }),
    addConversation: builder.mutation({
      query: (data) => {
        return {
          url: `/conversations`,
          method: "POST",
          body: data
        };
      },
    }),
    editConversation: builder.mutation({
      query: ({id, data}) => {
        return {
          url: `/conversations/${id}`,
          method: "PATCH",
          body: data
        };
      },
    }),


  }),
});

export const { useGetConversationsQuery, useGetConversationQuery, useAddConversationMutation, useEditConversationMutation } = conversationsApi;
