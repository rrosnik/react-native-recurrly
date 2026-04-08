import { QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { queryClient } from "./client";

interface QueryClientProviderProps {
  children: React.ReactNode;
}

export const AppQueryClientProvider = ({ children }: QueryClientProviderProps) => {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
