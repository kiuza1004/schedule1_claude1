/**
 * 메인 App 컴포넌트
 */

import { QueryClient, QueryClientProvider } from "react-query";
import Layout from "./components/Layout.js";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5분
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Layout />
    </QueryClientProvider>
  );
}

export default App;
