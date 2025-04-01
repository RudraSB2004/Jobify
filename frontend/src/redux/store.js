import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import authSlice from "./authSlice";
import postSlice from "./postSlice";
import jobSlice from "./jobSlice";
import socketSlice from "./socketSlice";
import rtnSlice from "./rtnSlice";
import chatSlice from "./chatSlice";
// ✅ Persist config (Only persist required slices)
const persistConfig = {
  key: "root",
  version: 1, // Change if you need a reset
  storage,
  whitelist: ["auth", "post", "job"], // Only persist selected slices
};

const rootReducer = combineReducers({
  auth: authSlice,
  post: postSlice,
  job: jobSlice,
  socketio: socketSlice,
  realTimeNotification: rtnSlice,
  chat: chatSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: true,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
