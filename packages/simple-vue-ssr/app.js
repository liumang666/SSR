import { createSSRApp } from "vue";

const createApp = () => {
  return createSSRApp({
    data: () => ({ count: 1 }),
    template: `<button @click="count++">{{ count }}</button>`,
  });
};
export default createApp;
