import { defineStore } from "pinia";
import api from "@/lib/api/api";
import { Auth } from "@/types/auth";
import { watch } from "vue";

type State = { user: Auth | null; isLoading: boolean };

export const useAuthStore = defineStore("auth", {
  state: function (): State {
    return { user: null, isLoading: false };
  },
  getters: {
    isAuthenticated: (state) => !!state.user,
  },
  actions: {
    async refetch() {
      return new Promise(async (resolve) => {
        this.isLoading = true;
        try {
          const res = await api.get("auth/me");
          this.user = res.data.data;
        } catch (error) {
          this.user = null as any;
        } finally {
          this.isLoading = false;
          resolve(true);
        }
      });
    },
    async waitUntilLoaded() {
      return new Promise((resolve) => {
        if (!this.isLoading) resolve(true);
        else {
          const unwatch = watch(
            () => this.isLoading,
            (isLoading) => {
              if (!isLoading) {
                resolve(true);
                unwatch();
              }
            },
          );
        }
      });
    },
  },
});
