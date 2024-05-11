import { createApp } from "vue";
import "./style.less";
import App from "./App.vue";
import ArcoVue from "@arco-design/web-vue";
import ArcoVueIcon from "@arco-design/web-vue/es/icon";

createApp(App).use(ArcoVue).use(ArcoVueIcon).mount("#app");
