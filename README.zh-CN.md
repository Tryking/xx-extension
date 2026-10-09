# XX — X 增强工具箱

**给你的 X，加点料。** 在时间线中展示作者的粉丝数、关注数与关注关系，支持中文和英文，按需开启每一项。

[English](README.md) · [隐私说明](PRIVACY.md) · [更新记录](CHANGELOG.md)

> 当前版本：`0.1.3`，可加载的 Manifest V3 原型。已通过核心、页面集成及真实 Manifest 扩展测试，并在登录 X 的 Chrome 时间线验证计数和关系信息栏。已验证多次刷新首页，支持新的 `relationship_counts` 计数字段；真正缺失的字段仍显示未知。尚未发布到 Chrome Web Store。

## 功能

- 在推文作者用户名下方或旁边显示账号信息。
- 独立开启粉丝数、关注数和关注关系；提供总开关。
- 区分互相关注、关注了你、你已关注、无关注关系和未知状态。
- 支持简写与完整数字，鼠标悬停查看完整计数。
- 中英文界面；默认跟随浏览器语言，可独立于 X 网站选择。
- 设置自动保存，已打开的 X 标签页同步更新显示。
- 浅色、深色样式与实时示例预览。

中文示例：`粉丝 2.3万 · 关注 816 · 互相关注`  
英文示例：`23.5K followers · 816 following · Mutual follow`

## 安装

需要 **Chrome 111 或更高版本**。无需 Node.js、API Key 或构建步骤。

1. 下载仓库 ZIP 并解压，或克隆仓库。
2. 打开 Chrome 扩展程序管理页（`chrome://extensions`）。
3. 开启「开发者模式」，点击「加载已解压的扩展程序」。
4. 选择包含 `manifest.json` 的目录，不能选择 ZIP 文件或上一级目录。
5. 打开或刷新 X 时间线，让 X 重新加载页面数据。
6. 点击 XX 扩展图标，再点击「打开设置」调整显示。

首次显示「未知」通常表示 X 尚未返回对应字段。正常滚动时间线或打开用户资料卡，让网站自行加载信息，随后插件会更新显示。

更新代码后，在扩展程序管理页点击 XX 的刷新按钮，再刷新 X 标签页。

## 数据从哪里来

XX 不调用 X API、不主动获取用户资料，也不保存推文正文。

1. `bridge-main.js`（由共享模型和 `bridge.js` 生成）在页面主世界、`document_start` 阶段包装页面自己的 `fetch` 和 `XMLHttpRequest`，检查 X API 路径返回的 JSON。
2. 只从响应中提取用户 ID、用户名、粉丝数、关注数和两个关注关系布尔字段。
3. 通过同源 `postMessage` 把精简数据交给隔离世界里的 `content.js`，在那里更新时间线。
4. 账号信息保存在当前标签页内存中，最多缓存 3,000 个账号；已收到的数据保留至当前会话结束，超过 5 分钟的字段会在悬停提示中标明可能已变化；只有设置写入本机 `chrome.storage.local`。

兼容的字段包括旧版 `legacy.screen_name`、新版 `core.screen_name`（以及 `legacy.core.screen_name`），计数字段 `followers_count`、`friends_count`，关注关系 `relationship_perspectives.followed_by/following` 与旧版 `legacy` 字段。关系只接受明确的布尔值；缺失、`null` 或非布尔值均视为未知。

账号切换检测在页面内比较可读取的 `twid` / `ct0` Cookie 签名，只把递增的代数发送给显示脚本，**Cookie 值不会传出页面主世界**。检测到变化时清空缓存，并丢弃先前请求的迟到响应。如果 Cookie 不可读取，或切换没有触发可观察变化，请刷新标签页，以彻底清空旧数据。

参考：[Chrome 内容脚本清单](https://developer.chrome.com/docs/extensions/reference/manifest/content-scripts)、[X 用户字段迁移样例](https://github.com/fa0311/twitter-openapi/issues/95)。这些样例不是 X 对网页内部接口的稳定性承诺。

## 设置

| 选项 | 默认值 | 说明 |
| --- | --- | --- |
| 启用 XX | 开启 | 总显示开关 |
| 粉丝数 / 关注数 / 关注关系 | 全部开启 | 可独立开关 |
| 显示位置 | 用户名下方 | 可改为用户名旁边 |
| 数字格式 | 简写 | 中文万 / 亿，英文 K / M；也可用完整数字 |
| 界面语言 | 跟随浏览器 | 自动 / 简体中文 / English |

## 开发与验证

运行核心自动测试，需要 Node.js 22 或更高版本，无需安装 npm 依赖：

```sh
npm test
```

浏览器集成测试需要 Python 3 和 Playwright（含 Chromium）：

```sh
python3 -m pip install playwright
python3 -m playwright install chromium
# 终端 1：启动静态服务
python3 -m http.server 8765 --bind 127.0.0.1
# 终端 2：运行集成测试
python3 tests/browser.py
# 使用真实 Manifest 和合成 X 响应验证两个脚本环境
python3 tests/extension.py
```

测试使用合成的 X 响应与本地 `chrome.storage` 模拟器，覆盖字段解析、缓存过期、旧账户迟到响应、虚拟列表节点复用、语言切换、设置持久化和显示开关。真实 Manifest 测试另外将扩展装入 Chromium，覆盖网页主环境与扩展隔离环境；这些测试不能保证所有真实 X 响应的兼容性。修改共享模型或桥接源文件后，运行 `python3 package.py` 重新生成 `bridge-main.js`，避免 Chrome 对两个环境中相同脚本路径去重。

生成仅包含运行文件的安装 ZIP：

```sh
python3 package.py
```

输出：`dist/xx-extension-0.1.3.zip`。解压后按安装说明加载；`dist` 不纳入 Git。

## 项目结构

```text
manifest.json       Manifest V3 配置及最小权限声明
bridge-main.js      生成的网页主环境脚本
bridge.js           被动读取 X 已返回的响应
content.js/css      时间线显示与节点更新
shared/model.js     新旧用户与 relationship_counts 字段解析、缓存
shared/i18n.js      中英文文案、数字格式、设置校验
options.html        完整设置页
popup.html          总开关与设置入口
settings.js/css     设置保存和示例预览
_locales/           Chrome 商店名称与描述本地化
icons/              扩展图标
tests/             核心及浏览器集成测试
```

## 已知限制与故障排查

- **数字或关系未知：** 页面响应未提供字段，或缓存过期；XX 不补发请求，也不会把缺失关系当成未关注。
- **安装后无变化：** 确认扩展已启用且三个显示项至少开启一个；刷新 X。安装前收到的响应无法恢复。
- **X 更新后显示异常：** 网页 DOM、数据结构、请求方式都可能变化，需要更新选择器或解析器。
- **账号切换：** 缓存按可观察的会话变化重置；无法观察到的切换需手动刷新。计数为最近一次已接收响应的快照，不是实时数据库。
- **捕获范围：** 目前支持主页面的 `fetch` / `XMLHttpRequest` JSON；不读取 Service Worker 内部请求、WebSocket 或已缓存的初始状态。
- **深色显示：** 当前样式跟随系统颜色偏好，X 独立主题设置可能与之不同。
- **信任边界：** 主世界与网页共享运行环境，同源网页脚本可影响桥接数据，因此显示仅作辅助信息。未申请账号操作权限。

## 后续方向

第一版保持「账号信息」模块独立。后续可以扩展本地账号备注和时间线过滤，并沿用现有设置和国际化体系。

## 参与开发

提交问题时请附上 Chrome 版本、XX 版本、当前语言、问题所在页面类型和复现步骤。不要提交 Cookie、认证令牌、私信、真实接口完整响应或其他私人数据。新增功能请优先提供最小权限方案及中英文文案。

## 许可与声明

目前未附开源许可证；公开可见不代表授予再分发许可。XX 是独立项目，与 X Corp. 无关联，未获其背书。正式发布前需继续验证兼容性并检查平台及商店规则。
