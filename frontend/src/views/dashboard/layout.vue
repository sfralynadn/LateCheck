<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuthStore } from "@/stores/auth";
import { Auth } from "@/types/auth";
import {
  Bell,
  CircleUser,
  Home,
  LineChart,
  Menu,
  Package2,
  Shapes,
  UserCircle,
} from "lucide-vue-next";
import { computed } from "vue";
import { RouterLink, useRoute } from "vue-router";
const auth = useAuthStore();
const links = [
  {
    path: "/dashboard",
    label: "Dashboard",
    active: function (path: string) {
      return path == "/dashboard";
    },
    hidden: () => false,
    icon: Home,
  },
  {
    path: "/dashboard/profile",
    label: "Profile",
    active: function (path: string) {
      return path.includes("profile");
    },
    hidden: () => false,
    icon: UserCircle,
  },
  {
    path: "/dashboard/report",
    label: "Reports",
    active: function (path: string) {
      return path.includes("report");
    },
    hidden: () => false,
    icon: LineChart,
  },
  {
    path: "/dashboard/classroom",
    label: "Classroom",
    active: function (path: string) {
      return path.includes("classroom");
    },
    hidden: function (auth: Auth) {
      return auth.role != "TEACHER";
    },
    icon: Shapes,
  },
];
const filteredLinks = computed(() =>
  links.filter((link) => !link.hidden(auth.user as Auth))
);
</script>

<template>
  <div
    class="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]"
  >
    <div class="hidden border-r bg-muted/40 md:block">
      <div class="flex h-full max-h-screen flex-col gap-2">
        <div class="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <a href="/" class="flex items-center gap-2 font-semibold">
            <Package2 class="h-6 w-6" />
            <span class="">LateCheck</span>
          </a>
          <Button variant="outline" size="icon" class="ml-auto h-8 w-8">
            <Bell class="h-4 w-4" />
            <span class="sr-only">Toggle notifications</span>
          </Button>
        </div>
        <div class="flex-1">
          <nav
            class="grid items-start px-2 text-[0.950rem] lg:text-base font-medium mt-1.5 lg:px-4"
          >
            <RouterLink
              v-for="link in filteredLinks"
              :to="link.path"
              class="flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary"
              :class="[
                link.active($route.path)
                  ? 'text-black'
                  : 'text-muted-foreground',
              ]"
            >
              <component class="w-4 h-4" :is="link.icon"></component>
              {{ link.label }}
            </RouterLink>
          </nav>
        </div>
      </div>
    </div>
    <div class="flex flex-col">
      <header
        class="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6"
      >
        <Sheet>
          <SheetTrigger as-child>
            <Button variant="outline" size="icon" class="shrink-0 md:hidden">
              <Menu class="h-5 w-5" />
              <span class="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" class="flex flex-col">
            <nav class="grid gap-2 text-lg font-medium">
              <a
                href="#"
                class="flex items-center gap-3.5 text-lg font-semibold mb-5"
              >
                <Package2 class="h-6 w-6" />
                <span>LateCheck</span>
              </a>
              <RouterLink
                v-for="link in filteredLinks"
                :to="link.path"
                class="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 hover:text-foreground"
                :class="
                  link.active($route.path)
                    ? 'text-black'
                    : 'text-muted-foreground'
                "
              >
                <component class="w-5 h-5" :is="link.icon"></component>
                {{ link.label }}
              </RouterLink>
            </nav>
          </SheetContent>
        </Sheet>
        <div class="w-full text-right text-sm text-neutral-600 flex-1"></div>
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button variant="secondary" size="icon" class="rounded-full">
              <CircleUser class="h-5 w-5" />
              <span class="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              <h1>{{ auth?.user?.profile.name }}</h1>
              <p class="font-normal text-slate-600">
                {{
                  auth?.user?.role?.charAt(0) +
                  auth?.user?.role?.substring(1).toLocaleLowerCase()
                }}
              </p>
            </DropdownMenuLabel>
            <!-- <DropdownMenuSeparator /> -->
            <!-- <DropdownMenuItem>Settings</DropdownMenuItem> -->
            <!-- <DropdownMenuItem>Support</DropdownMenuItem> -->
            <DropdownMenuSeparator />
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>
      <main class="flex flex-col gap-2 p-4 lg:gap-4 lg:p-6">
        <RouterView />
      </main>
    </div>
  </div>
</template>
