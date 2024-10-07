import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/main_layout";
import HomePage from "./pages";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AnalyticPage from "./pages/reports";
import ClassPage from "./pages/classes";
import SignInPage from "./pages/auth/login";
import { GuestRoute, ProtectedRoute } from "./components/custom/router/route";
import { AuthProvider } from "./context/auth";

function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<MainLayout />}>
              <Route element={<ProtectedRoute />}>
                <Route index element={<HomePage />} />
                <Route path="/report" element={<AnalyticPage />} />
                <Route path="/class" element={<ClassPage />} />
              </Route>
              <Route element={<GuestRoute />}>
                <Route element={<SignInPage />} path="/auth/login" />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
