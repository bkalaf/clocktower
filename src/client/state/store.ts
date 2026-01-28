// src/client/state/store.ts
import { configureStore } from '@reduxjs/toolkit';
import realtimeReducer from './realtimeSlice';
import authReducer from './authSlice';
import themeReducer from './themeSlice';
import wsMiddleware from './wsMiddleware';

export const store = configureStore({
    reducer: {
        realtime: realtimeReducer,
        auth: authReducer,
        theme: themeReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(wsMiddleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
