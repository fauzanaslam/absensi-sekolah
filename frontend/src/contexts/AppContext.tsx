import React, { useContext, useState } from "react";
import Toast from "../components/Toast";
import * as apiClient from "../api-client";
import { useQuery } from "react-query";

type ToastMessage = {
  message: string;
  type: "SUCCESS" | "ERROR";
};

type AppContext = {
  showToast: (toastMessage: ToastMessage) => void;
  isLoggedIn: boolean;
  userRole?: string;
};

const AppContext = React.createContext<AppContext | undefined>(undefined);

// membuat component yang menyediakan konteks untuk semua file yang menerima properti choldren
export const AppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [toast, setToast] = useState<ToastMessage | undefined>(undefined); //membuat state toast yang defaultnya undifined

  const { isError } = useQuery("validateToken", apiClient.validateToken, {
    retry: false,
  });
  const { data } = useQuery("fetchCurrentUser", apiClient.fetchCurrentUser, {
    retry: false,
  });

  return (
    // mendeklarasikan value apa saja yang bisa diakses di file lain untuk di modifikasi
    <AppContext.Provider
      value={{
        showToast: (toastMessage) => {
          setToast(toastMessage);
        },
        isLoggedIn: !isError,
        userRole: data?.role,
      }}
    >
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(undefined)}
        />
      )}
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  return context as AppContext;
};
