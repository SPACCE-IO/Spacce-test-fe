"use client";

import { persistor, store } from "@/src/store/store";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

interface NextAuthProviderProps {
  children: ReactNode;
}

export default function ReduxProvider({ children }: NextAuthProviderProps) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}
