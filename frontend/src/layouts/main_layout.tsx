import Wrapper from "@/components/custom/wrappper/wrapper";
import { Outlet, useLocation } from "react-router-dom";
import { Toaster } from "sonner";

export default function MainLayout() {
  const { pathname } = useLocation();
  return !pathname.includes("auth") ? (
    <>
      <Wrapper>
        <Outlet />
      </Wrapper>
      <Toaster className="font-['Inter']" />
    </>
  ) : (
    <>
      <Outlet />
      <Toaster className="font-['Inter']" />
    </>
  );
}
