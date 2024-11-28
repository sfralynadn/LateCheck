<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/lib/api/api";
import { useMutation } from "@tanstack/vue-query";
import { AxiosError } from "axios";
import { toast } from "vue-sonner";
import { ref } from "vue";
import { Response } from "@/types/response";
import { Token } from "@/types/token";
import router from "@/route";
import { useAuthStore } from "@/stores/auth";

const credentials = ref({
  email: "",
  password: "",
});

const auth = useAuthStore();

const { mutate: login, isPending } = useMutation<Response<Token>>({
  mutationFn: async (credentials) => {
    try {
      const res = await api.post("auth/login", credentials);
      return res.data;
    } catch (err: any) {
      if (err instanceof AxiosError && err.response) {
        throw new Error(err.response.data?.message);
      }
      throw new Error(err.message);
    }
  },
  onSuccess: async (data) => {
    localStorage.setItem("accessToken", data.data.access_token);
    await auth.refetch();
    await router.push({ name: "dashboard" });
  },
  onError: (err) => toast.error(err.message),
});
</script>

<template>
  <div
    class="w-full flex flex-col justify-center lg:grid min-h-screen lg:grid-cols-2"
  >
    <div class="flex items-center justify-center py-12">
      <form
        @submit="
          (e) => {
            e.preventDefault();
            login(credentials as any);
          }
        "
        class="mx-auto grid w-[350px] gap-6"
      >
        <div class="grid gap-2 text-center">
          <h1 class="text-3xl font-bold">Sign In</h1>
          <p class="text-balance text-muted-foreground">
            Enter your credentials below to login to your account
          </p>
        </div>
        <div class="grid gap-4">
          <div class="grid gap-2">
            <Label for="email">Email</Label>
            <Input
              id="email"
              v-model="credentials.email"
              type="email"
              placeholder="m@example.com"
              required
            />
          </div>
          <div class="grid gap-2">
            <div class="flex items-center">
              <Label for="password">Password</Label>
              <a
                href="/forgot-password"
                class="ml-auto inline-block text-sm underline"
              >
                Forgot your password?
              </a>
            </div>
            <Input
              v-model="credentials.password"
              id="password"
              type="password"
              required
            />
          </div>
          <Button :disabled="isPending" type="submit" class="w-full mt-4">
            Login
          </Button>
        </div>
      </form>
    </div>
    <div class="hidden bg-muted lg:block">
      <img
        alt="Image"
        width="1920"
        height="1080"
        class="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
      />
    </div>
  </div>
</template>
