import AuthContext from "@/context/auth";
import { useContext } from "react";

export default function useAuth() {
  const c = useContext(AuthContext);
  if (!c) throw new Error("useAuth usage must be within AuthProvider");
  return c;
}
