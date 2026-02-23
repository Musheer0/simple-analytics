"use client"
import React from 'react';
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query'

const queryClient = new QueryClient()
const TanstackReactQueryClientProvider = ({ children }: { children: React.ReactNode }) => {
  return (
      <QueryClientProvider client={queryClient}>
     {children}
    </QueryClientProvider>
  );
};

export default TanstackReactQueryClientProvider;