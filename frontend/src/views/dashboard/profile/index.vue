<script setup lang="ts">
import {useAuthStore} from "@/stores/auth.ts";

const auth = useAuthStore()
</script>
<template>
  <h1>Profile</h1>
  <div class="flex flex-wrap gap-y-3 gap-x-10">
    <div>
      <h1 class="text-sm text-slate-600">Name</h1>
      <h2 class="text-lg font-semibold">{{ auth?.user?.profile.name }}</h2>
    </div>
    <div>
      <h1 class="text-sm text-slate-600">Class</h1>
      <h2 class="text-lg font-semibold">{{ auth?.user?.profile.classroom.name }}</h2>
    </div>
    <div>
      <h1 class="text-sm text-slate-600">as</h1>
      <h2 class="text-lg font-semibold">{{ auth?.user?.role }}</h2>
    </div>
    <div>
      <h1 class="text-sm text-slate-600">Class</h1>
      <h2 class="text-lg font-semibold">{{ auth?.user?.profile.classroom.name }}</h2>
    </div>
  </div>
</template>