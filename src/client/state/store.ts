// src/client/state/store.ts
import { configureStore } from '@reduxjs/toolkit';
import realtimeReducer from './realtimeSlice';
import wsMiddleware from './wsMiddleware';
import authSlice from './authSlice';

export const store = configureStore({
    reducer: {
        realtime: realtimeReducer,
        auth: authSlice
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(wsMiddleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
