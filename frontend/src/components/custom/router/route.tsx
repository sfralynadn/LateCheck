import useAuth from "@/hooks/use_auth";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
  const { auth, authLoading } = useAuth();
  if (authLoading) return null;
  return !!auth ? <Outlet /> : <Navigate to={"/auth/login"} />;
}

function GuestRoute() {
  const { auth, authLoading } = useAuth();
  if (authLoading) return null;
  return !!auth ? <Navigate to={"/"} /> : <Outlet />;
}

export { GuestRoute, ProtectedRoute };
