import { configureStore } from '@reduxjs/toolkit';
import realtimeReducer from './realtimeSlice';
import wsMiddleware from './wsMiddleware';

export const store = configureStore({
    reducer: {
        realtime: realtimeReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(wsMiddleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
