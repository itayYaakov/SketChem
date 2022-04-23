import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import thunkMiddleware from "redux-thunk";

import RootReducer from "./RootReducer";

// import counterReducer from '../features/counter/counterSlice';

const preloadedState = {};

export const store = configureStore({
    reducer: RootReducer,
    // devTools: process.env.NODE_ENV !== 'production',
    devTools: true,
    preloadedState,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(),
    // middleware: (getDefaultMiddleware) =>
    //   getDefaultMiddleware().concat(thunkMiddleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
