<script setup lang="ts">
import { HTMLAttributes } from "vue";
const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();
</script>
<template>
  <img src="/gif/loading.gif" :class="props.class" alt="" />
</template>
