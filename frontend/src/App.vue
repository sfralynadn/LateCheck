<script setup lang="ts">
import { Toaster } from "vue-sonner";
import { useAuthStore } from "@/stores/auth";
import { onBeforeMount } from "vue";

const auth = useAuthStore();
onBeforeMount(async () => await auth.refetch());
</script>

<template>
  <RouterView />
  <Toaster
    position="top-right"
    style="font-family: Inter, sans-serif !important"
  />
</template>
