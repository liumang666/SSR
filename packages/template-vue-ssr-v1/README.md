# 创建过程

pnpm create vite template-vue-ssr-v1 --template vue-ts

pnpm i

# 修改 src/main.ts # 导出环境无关的（通用的）应用代码

# 修改 package.json

# 修改 index.html 入口, 字符串 <!--ssr-outlet--> 用于服务端渲染模板替换，可以使用任何你喜欢的占位标记来替代 <!--ssr-outlet-->

## 新增

# src/entry-client.ts 将应用挂载到一个 DOM 元素上

# src/entry-server.ts 使用某框架的 SSR API 渲染该应用

# 根目录下 server.ts ( main application server )
