/* eslint-disable no-undef */
import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./api";
import authReducer from '../features/auth/authSlice';
import messagesReducer from '../features/auth/authSlice';
import conversationsReducer from '../features/auth/authSlice';

const isDevelopment = import.meta?.env?.MODE === 'development' || process.env.NODE_ENV === 'development';

export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath] : apiSlice.reducer,
        auth: authReducer,
        messages: messagesReducer,
        conversations: conversationsReducer
    },
    devTools: isDevelopment,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware)
})