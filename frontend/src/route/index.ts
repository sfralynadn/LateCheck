import { useAuthStore } from "@/stores/auth";
import SignIn from "@/views/auth/login.vue";
import ClassroomPage from "@/views/dashboard/classroom/index.vue";
import NewReportPage from "@/views/dashboard/report/new/index.vue";
import MainPage from "@/views/dashboard/index.vue";
import Dashboard from "@/views/dashboard/layout.vue";
import ReportPage from "@/views/dashboard/report/index.vue";
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import ProfilePage from "@/views/dashboard/profile/index.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/dashboard",
  },
  {
    path: "/auth/login",
    component: SignIn,
    name: "auth.login",
    meta: {
      redirectIfAuthenticated: true,
    },
  },
  {
    path: "/dashboard",
    component: Dashboard,
    meta: {
      requiresAuth: true,
    },
    children: [
      { path: "", component: MainPage, name: "dashboard" },
      {
        path: "report",
        component: ReportPage,
        name: "dashboard.report",
      },
      {
        path: "report/new",
        component: NewReportPage,
        name: "dashboard.report.create-new-report",
      },
      {
        path: "classroom",
        component: ClassroomPage,
        name: "dashboard.classroom",
      },
      {
        path: "profile",
        component: ProfilePage,
        name: "dashboard.profile",
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
});

router.beforeEach(async (to) => {
  const auth = useAuthStore();
  await auth.waitUntilLoaded();
  if (
    to.matched.some((route) => route.meta.requiresAuth) &&
    !auth.isAuthenticated
  ) {
    return { name: "auth.login" };
  }
  if (
    to.matched.some((route) => route.meta.redirectIfAuthenticated) &&
    auth.isAuthenticated
  ) {
    return { path: "/" };
  }
});

export default router;
