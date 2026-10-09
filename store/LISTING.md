# Chrome Web Store 提交材料

状态：准备中，尚未提交审核。0.1.2 已在真实登录 X 的 Chrome 时间线验证计数和关系。账号持有人已开启两步验证，待重新上传新版。

## 中文名称与短描述

XX — X 增强工具箱

在 X 时间线显示作者的粉丝数、关注数和关注关系，支持中文、英文及独立显示开关。

## 中文详细描述

给你的 X，加点料。

XX 在推文作者旁展示粉丝数、关注数和关注关系，帮助你在浏览时间线时了解作者。

功能：
- 粉丝数、关注数、关注关系独立开关。
- 用户名下方或旁边两种显示位置。
- 简写或完整数字；悬停显示完整计数。
- 区分互相关注、关注了你、你已关注和无关注关系。
- 未获取到的数据明确显示未知，不会推断为未关注。
- 简体中文、English 或跟随浏览器语言。
- 设置自动保存，系统浅色和深色样式。

数据说明：XX 仅读取 X 网站已经加载的响应，不额外请求资料接口。账号数据在当前标签页本地处理，设置保存在本机。没有数据上传、统计追踪或广告。

安装后请刷新 X。部分响应不包含计数或关注关系，相关项目会显示未知；XX 不保证每条推文的所有字段都能获取。X 网站结构变化可能影响功能。

XX 是独立项目，与 X Corp. 无关联，未获其背书。

## English name and short description

XX — Extra tools for X

Show timeline authors' follower counts, following counts and follow relationships, with English and Chinese settings.

## English detailed description

A little extra for your X.

XX displays account information beside authors in your X timeline.

Features:
- Independent switches for follower counts, following counts and follow relationships.
- Display below or beside usernames.
- Compact or full numbers, with exact counts on hover.
- Mutual follow, follows you, following and no-connection labels.
- Explicit unknown states when the page has not provided the required data.
- English, Simplified Chinese or browser-language detection.
- Auto-saved local settings and system light/dark styles.

XX reads responses the X website has already loaded. It does not request additional profile data. Account information is processed locally in the current tab; preferences are saved locally. There is no data upload, analytics, advertising or tracking.

Refresh X after installing. Some responses omit counts or relationship fields, which will remain unknown. Availability is not guaranteed for every author. Changes to X's website may affect compatibility.

XX is an independent project, not affiliated with or endorsed by X Corp.

## 单一用途 / Single purpose

Display X timeline authors' follower counts, following counts and follow relationships using data already received by the page.

## 权限说明 / Permission justifications

storage: Save only user-selected display preferences locally and synchronize preference changes across open X tabs. Account data is never stored in chrome.storage.

Site access (x.com and twitter.com): Read already-loaded user records and insert account information into timeline author headers. No other websites are accessed.

Remote code: No. All JavaScript is bundled in the extension package. No downloaded scripts, eval, or remotely executed code.

## 审核测试步骤 / Reviewer instructions

1. Install the extension and use your own X account to sign in to x.com.
2. Refresh the home timeline after installation so page responses can be observed.
3. Inspect the account-information line beside timeline authors.
4. Open XX's popup, then Open settings. Toggle each field and the global switch.
5. Test compact/full numbers, both placement options and English/Chinese localization.
6. Missing fields are intentionally shown as unknown. Normal browsing may supply additional fields; the extension never sends extra profile requests.
7. Account records are kept only in tab memory. When switching X accounts, refresh the tab if an observable session change is not detected.

No test credentials are bundled or supplied. The extension does not operate accounts or publish posts.

## 仍需确认

- 开发者账号已注册，公开发布者显示名：The Faceless。
- 已在真实 Chrome 中安装 0.1.2，验证 X 时间线计数和关注关系。已修复首页新计数字段解析，并验证多次刷新；真正缺失字段按设计显示未知。
- 仓库与隐私政策已公开，匿名访问返回 HTTP 200：https://github.com/Tryking/xx-extension/blob/main/PRIVACY.md
- 商店介绍/主页：https://github.com/Tryking/xx-extension
- 公开联系邮箱已验证：ktingdeng@gmail.com。
- 发布者账号 kaitingdeng@gmail.com 已由用户开启两步验证。
- 上传图标、小型宣传图和真实功能截图；示例数据需明确标注。
- 依据后台当前问卷准确填写数据使用披露；不将本地处理误写为完全不访问用户数据。
