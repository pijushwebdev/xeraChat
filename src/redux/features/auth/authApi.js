import { apiSlice } from "../../app/api";
import { userLoggedIn } from "./authSlice";


export const authApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({

        register: builder.mutation({
            query: (data) => {
                return {
                    url: '/register',
                    method: 'POST',
                    body: data
                }
            },
            // after the query started if i want to do something
            async onQueryStarted(arg, {queryFulfilled, dispatch}){
                try{
                    const result = await queryFulfilled;
                    // set the data in local storage
                    localStorage.setItem('auth', JSON.stringify({
                        accessToken: result.data.accessToken,
                        user: result.data.user
                    }))
                    // save in redux store
                    dispatch(userLoggedIn({
                            accessToken: result.data.accessToken,
                            user: result.data.user
                    }))

                }catch(error){
                    console.log(error);
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
            },
            // after the query started if i want to do something
            async onQueryStarted(arg, {queryFulfilled, dispatch}){
                try{
                    const result = await queryFulfilled;
                    // set the data in local storage
                    localStorage.setItem('auth', JSON.stringify({
                        accessToken: result.data.accessToken,
                        user: result.data.user
                    }))
                    // save in redux store
                    dispatch(userLoggedIn({
                            accessToken: result.data.accessToken,
                            user: result.data.user
                    }))

                }catch(error){
                    console.log(error);
                }
            }
        })

    })
})

export const { useLoginMutation, useRegisterMutation } = authApi;