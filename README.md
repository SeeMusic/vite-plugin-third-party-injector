# @kanjianmusic/vite-plugin-third-party-injector

插入常见的第三方代码（比如谷歌统计）到 vite 项目的 `index.html` 中。

本插件只负责将第三方脚本片段注入到 HTML，不负责业务代码中的埋点调用、SPA 路由切换后的页面浏览上报、事件采集策略、同意管理或隐私合规处理。

目前支持：

* gtag
* gtm
* clarity
* fbevents

## 版本策略

从 `8.x` 开始，本插件的 major 版本与支持的 Vite major 版本对齐。

* `8.x` 支持 `vite@8`
  Node 通常需要 `20.19+` 或 `22.12+`，以对应 Vite 官方要求为准
* `0.1.x` 是历史旧版本
  最初基于 `vite@5` 发布，老项目可优先尝试该版本

## 安装

```
npm install @kanjianmusic/vite-plugin-third-party-injector -D
```

或

```
pnpm install @kanjianmusic/vite-plugin-third-party-injector -D
```

## 使用

`vite.config.ts` 配置示例：

```
import { defineConfig } from 'vite';
import thirdPartyInjectorPlugin from '@kanjianmusic/vite-plugin-third-party-injector';

export default defineConfig({
  plugins: [
    thirdPartyInjectorPlugin({
      gtag: 'G-XXXXXXXXXX',
      gtm: 'GTM-XXXXXXX',
      clarity: 'XXXXXXXXXX',
      fbevents: 'XXXXXXXXXX',
    }),
  ],
})
```

也可以在业务项目中按环境或 `mode` 条件决定是否注入：

```
export default defineConfig(({ mode }) => {
  const isProd = mode === 'production';

  return {
    plugins: [
      thirdPartyInjectorPlugin({
        gtag: isProd ? 'G-XXXXXXXXXX' : undefined,
      }),
    ],
  };
})
```

如果你的 `vite.config.ts` 使用了基于 `mode` 的函数式配置，并且项目里还通过 Vitest 复用同一份 Vite 配置，`vitest.config.ts` 可能也需要同步调整；Vitest 默认更接近直接消费对象形式配置。

## 平台说明

### GA4 与 SPA

Google Analytics 4 现在支持自动页面浏览统计，单页应用场景下也可以结合 Enhanced Measurement 的 history change 能力工作。可参考官方文档：

* [Measure pageviews](https://developers.google.com/analytics/devguides/collection/ga4/views)
* [Measure single-page applications](https://developers.google.com/analytics/devguides/collection/ga4/single-page-applications)

如果你的项目需要更精确地控制页面浏览上报，例如依赖业务路由标题、页面路径、上报时机，或需要避免自动统计与手动统计重复，可以使用 `gtag.sendPageView: false` 关闭默认 pageview，并在业务代码中自行处理路由切换后的上报。例如：

```
export default defineConfig(({ mode }) => {
  const isProd = mode === 'production';

  return {
    plugins: [
      thirdPartyInjectorPlugin({
        gtag: isProd
          ? {
              id: 'G-XXXXXXXXXX',
              sendPageView: false,
            }
          : undefined,
      }),
    ],
  };
})
```

在手动模式下，还应检查 GA4 后台的 Enhanced Measurement 配置；如果启用了基于 browser history 的页面变化统计，SPA 项目可能同时触发自动和手动 `page_view`，导致重复上报。

如果你的项目需要更完整的框架集成能力，例如自动处理 Vue 路由切换、统一封装埋点调用、提供组合式 API 或组件级能力，优先考虑使用对应生态中的专用插件，例如 `vue-gtag` 一类方案。

### 其他平台

当前内置的 `gtm`、`clarity` 和 `fbevents` preset 都按对应平台的基础 snippet 进行注入，通常只需要传入平台提供的 ID 即可。如果项目对这些平台还有更细的调用控制需求，建议在业务代码或对应平台的专用集成方案中处理。
