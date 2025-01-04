import { apiSlice } from "../../app/api";


export const authApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        register: builder.mutation({
            query: (data) => {
                return {
                    url: '/register',
                    method: 'POST',
                    body: data
                }
            }
        }),

        login: builder.mutation({
            query: (data) => {
                return {
                    url: '/login',
                    method: 'POST',
                    body: data
                }
            }
        })

    })
})

export const { useLoginMutation, useRegisterMutation } = authApi;