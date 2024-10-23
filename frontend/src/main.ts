import { createApp } from "vue";
import "./style.css";
import "./assets/index.css";
import App from "./App.vue";
import router from "./route";
import { VueQueryPlugin } from "@tanstack/vue-query";
import { createPinia } from "pinia";

createApp(App).use(router).use(VueQueryPlugin).use(createPinia()).mount("#app");
