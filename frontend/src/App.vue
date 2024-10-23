<script setup lang="ts">
import { Toaster } from "vue-sonner";
import { useAuthStore } from "@/stores/auth";
import { onBeforeMount } from "vue";
const auth = useAuthStore();
onBeforeMount(() => auth.refetch());
</script>

<template>
  <RouterView v-if="!auth.isLoading" />
  <Toaster
    position="top-right"
    style="font-family: Inter, sans-serif !important"
  />
</template>
