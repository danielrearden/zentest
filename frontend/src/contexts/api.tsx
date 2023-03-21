import { QueryClientProvider, QueryClient } from "react-query";

const client = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: false,
    },
  },
});

interface ApiProviderProps {
  children: React.ReactNode;
}

export const ApiProvider = ({ children }: ApiProviderProps) => {
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};
