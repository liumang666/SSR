// import { createApp } from 'vue'
// import "./style.css";
import { createSSRApp } from "vue";
import App from "./App.vue";

// createApp(App).mount("#app");
export function createApp() {
  const app = createSSRApp(App);
  return { app };
}
