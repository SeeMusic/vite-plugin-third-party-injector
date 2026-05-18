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

`gtag` 支持传字符串或配置对象；`gtm`、`clarity` 和 `fbevents` 直接传对应平台的 ID。

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

仅当你的 `vite.config.ts` 使用了基于 `mode` 的函数式配置，并且项目里还通过 Vitest 复用同一份 Vite 配置时，`vitest.config.ts` 可能也需要同步调整；Vitest 默认更接近直接消费对象形式配置。

## 平台说明

### GA4 与 SPA

**默认模式**

Google Analytics 4 现在支持 SPA 页面浏览统计。如果项目没有额外需求，例如不需要自定义发送给 GA 的页面标题等 meta 信息，通常可由本插件注入基础 gtag snippet，并在 GA4 后台开启 Enhanced Measurement 中基于 browser history 的页面变化统计。可参考官方文档：

* [Measure pageviews](https://developers.google.com/analytics/devguides/collection/ga4/views)
* [Measure single-page applications](https://developers.google.com/analytics/devguides/collection/ga4/single-page-applications)

GA4 后台入口：

* `Admin` -> `Data collection and modification` -> `Data streams` -> 选择对应 Web stream -> `Enhanced measurement`

**手动模式**

如果项目需要自行控制页面浏览上报，例如依赖业务路由标题、自定义页面路径、精确控制上报时机，可以改用手动模式，常见做法是在路由切换后通过 `afterEach()` 手动发送 `page_view`。

在默认配置下，通常同时存在两层自动页面浏览能力：

* 代码侧：gtag 默认自动发送 `page_view`
* 后台侧：Enhanced Measurement 基于 browser history 的页面变化统计

改用手动模式后，通常有两个常见问题：

* 如果不关闭这些默认自动行为，自动与手动 `page_view` 可能重复
* 如果关闭了默认自动 `page_view`，只依赖 `afterEach()`，首屏首次打开时的 `page_view` 可能遗漏

因此，手动模式下通常需要先关掉代码侧自动 `page_view` 和后台基于 history 的自动页面变化统计，再补上首屏首次打开时的那次 `page_view`。对应到接入上，通常需要同时做三件事：

* 使用 `gtag.sendPageView: false` 关闭默认自动 `page_view`
* 在 GA4 后台关闭 `Enhanced measurement` 中 `Page views` 的高级设置 `Page changes based on browser history events`
* 在业务路由入口中补发首屏 `page_view`，例如通过 `router.isReady()` 处理首屏，通过 `router.afterEach()` 处理后续客户端导航

插件配置示例：

```
export default defineConfig({
  plugins: [
    thirdPartyInjectorPlugin({
      gtag: {
        id: 'G-XXXXXXXXXX',
        sendPageView: false,
      },
    }),
  ],
})
```

如果你的项目需要更完整的框架集成能力，例如自动处理 Vue 路由切换、统一封装埋点调用、提供组合式 API 或组件级能力，优先考虑使用对应生态中的专用插件，例如 `vue-gtag` 一类方案。

### 其他平台

当前内置的 `gtm`、`clarity` 和 `fbevents` preset 都按对应平台的基础 snippet 进行注入，通常只需要传入平台提供的 ID 即可。如果项目对这些平台还有更细的调用控制需求，建议在业务代码或对应平台的专用集成方案中处理。

## 给 AI 的接入任务模板（可选）

本节提供一份可直接复制给 AI 的接入任务模板，适合在新会话中让 AI 帮你把本插件接入一个现有的 Vite 项目。

供业务项目调用 AI 时使用；不属于插件运行时配置的一部分。插件的权威接入规则、边界和平台说明仍以上文 README 正文为准。

````text
请把 `@kanjianmusic/vite-plugin-third-party-injector` 接入当前 Vite 项目。

## 先读文档

先执行下面的命令读取插件文档：

```bash
npm view @kanjianmusic/vite-plugin-third-party-injector readme --json
```

然后根据文档完成接入。

## 检查

- 检查项目中现有的 `index.html` 或其他位置，确认是否已经存在手写的 GA、GTM、Clarity、Meta Pixel 等第三方统计 snippet
- 检查项目是否已经在 `router` 或其他业务代码中手动处理了页面浏览或事件上报逻辑；如有需要，请根据文档中的说明选择合适的接入方式
- 检查项目当前统计代码在不同环境下的实际生效范围，并区分“当前行为”与“明确策略”
- 如果无法从现有代码、配置或文档中高置信度判断应该在哪些环境启用统计，请先用一个简短问题询问用户，并附 1 句当前现状摘要；不要输出长段解释

## 执行

- 不要让旧 snippet 与插件注入的新 snippet 同时处于生效状态，避免重复注入
- 先判断 `vite.config.ts` 是否已经采用 `loadEnv` / `env` 文件这类配置方式；如果没有，不要主动引入 `env` 改造，除非用户明确要求重构
- 优先保持改动最小

## 校验

- 在开始验证前，先明确最终采用的环境启用策略
- 如果项目存在多个构建目标或 `mode`，请按最终环境策略分别验证：应生效的环境必须注入，不应生效的环境不得注入
- 验证多个 `mode` 或构建目标时，优先使用独立临时输出目录并可并行执行；验证完成后必须清理所有临时产物
- 完成后只汇报任务是否完成、最终环境策略、验证结论，以及仍需用户手动确认的风险；不要展开实现细节、文件清单、具体 ID、逐条命令或过程性说明
````
