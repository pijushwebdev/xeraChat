import { apiSlice } from "../../app/api";



export const usersApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({

        getUser: builder.query({
            query: (email) => {
              return {
                url: `/users?email=${email}`,
                method: "GET",
              };
            },
          }),
        
    })
})

export const {useGetUserQuery} = usersApi;