import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/main_layout";
import HomePage from "./pages";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AnalyticPage from "./pages/analytics";
import ClassPage from "./pages/classes";
import SignInPage from "./pages/auth/login";

function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="/analytic" element={<AnalyticPage />} />
            <Route path="/class" element={<ClassPage />} />
            <Route element={<SignInPage />} path="/auth/login" />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
