# vite-plugin-third-party-injector

插入常见的第三方代码（比如谷歌统计）到 vite 项目的 index.html 中。目前支持：

* gtag
* gtm
* clarity
* fbevents

## 安装

```
npm install vite-plugin-third-party-injector -D
```

或

```
pnpm install vite-plugin-third-party-injector -D
```


## 使用

`vite.config.ts` 配置示例：

```
import { defineConfig } from 'vite';
import thirdPartyInjectorPlugin from 'vite-plugin-third-party-injector';

export default defineConfig({
  plugins: [
    thirdPartyInjectorPlugin({
      gtag: 'G-XXXXXXXXXX',
    }),
  ],
})
```
