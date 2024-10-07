import {
  Bell,
  CircleCheckBig,
  CircleHelp,
  CircleUser,
  House,
  LineChart,
  Menu,
  Search,
  Shapes,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { Link, useLocation } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ReactNode, useEffect } from "react";
import clsx from "clsx";
import useAuth from "@/hooks/use_auth";
import api from "@/utils/api/api";
import { useQueryClient } from "@tanstack/react-query";

const menus: {
  name: string;
  link: string;
  icon: ReactNode;
  active(pathname: string): boolean;
}[] = [
  {
    name: "Dashboard",
    link: "/",
    icon: <House />,
    active: (pathname: string) => pathname == "/",
  },
  {
    name: "Classes",
    link: "/class",
    icon: <Shapes />,
    active: (pathname: string) => pathname.includes("class"),
  },
  {
    name: "Report",
    link: "/report",
    icon: <LineChart />,
    active: (pathname: string) => pathname.includes("report"),
  },
  {
    name: "Other Menu",
    link: "/other",
    icon: <CircleHelp />,
    active: (pathname: string) => pathname.includes("other"),
  },
];

export default function Wrapper({ children }: { children: ReactNode }) {
  const { auth } = useAuth();
  const queryClient = useQueryClient();
  const logout = async () => {
    try {
      const res = await api.post("auth/logout");
      if (res.status == 200) {
        await queryClient.invalidateQueries({ queryKey: ["auth"] });
      }
    } catch (err: any) {
      throw new Error(err.message);
    }
  };
  const { pathname } = useLocation();
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link to="/" className="flex items-center gap-2 font-semibold">
              <CircleCheckBig className="w-5" />
              <span className="">LateCheck</span>
            </Link>
            <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Toggle notifications</span>
            </Button>
          </div>
          <div className="flex-1 pt-2">
            <nav className="grid items-start px-2 text-sm lg:text-base font-medium lg:px-4">
              {menus.map((menu, i) => (
                <Link
                  key={i}
                  to={menu.link}
                  className={clsx(
                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                    !menu.active(pathname) && "text-muted-foreground",
                  )}
                >
                  <span className="*:h-4 *:w-4">{menu.icon}</span>
                  {menu.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="mt-auto p-4"></div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 font-medium">
                <Link
                  to="/"
                  className="flex items-center gap-2 text-lg font-semibold pb-5"
                >
                  <CircleCheckBig className="h-6 w-6" />
                  <span className="sr-only">Acme Inc</span>
                </Link>
                {menus.map((menu, i) => (
                  <Link
                    key={i}
                    to={menu.link}
                    className={clsx(
                      "mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2  hover:text-foreground",
                      !menu.active(pathname) && "text-muted-foreground",
                    )}
                  >
                    <span className="*:h-5 *:w-5">{menu.icon}</span>
                    {menu.name}
                  </Link>
                ))}
              </nav>
              <div className="mt-auto"></div>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
            <form>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                />
              </div>
            </form>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{auth?.name}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {/* <DropdownMenuItem>Settings</DropdownMenuItem> */}
              {/* <DropdownMenuItem>Support</DropdownMenuItem> */}
              {/* <DropdownMenuSeparator /> */}
              <DropdownMenuItem onClick={() => logout()}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
