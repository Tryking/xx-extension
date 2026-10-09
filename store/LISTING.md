# Chrome Web Store 提交材料

状态：2026-10-10 已提交 0.1.2 审核，后台显示 Pending review。已设置审核通过后自动发布；当前尚未正式上线。真实登录 X 的 Chrome 时间线连续刷新三次验证计数和关系，自动化测试和 GitHub CI 已通过。英文、中文介绍及图标、截图、宣传图、隐私问卷与审核说明均已保存；分发设置为免费、公开、所有地区。

商店条目 ID：`khjpghbgccnkkikdmmlkoogjigojnklc`。此 ID 不代表插件已经上线。

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

## 隐私问卷填写依据 / Data disclosure rationale

Local processing still counts as handling user data under the Chrome Web Store User Data Policy. The questionnaire must disclose the actual data accessed, not claim that XX never handles user data.

- Personally identifiable information: X account IDs and handles, used only to match badges to authors in the current tab.
- Authentication information: readable `twid` and `ct0` session cookies, temporarily compared in page memory solely to clear stale relationship data when the session changes. No values are forwarded, logged, persisted or uploaded.
- Website content: already-loaded X response data and author headers, processed locally to obtain counts and relationships and attach badges.
- Web history: X API request URLs are examined only to identify relevant existing responses. XX does not record browsing history or access other sites.
- User activity: existing X fetch/XHR responses are observed locally. No click, keystroke or mouse-movement logging is performed.

The five corresponding categories above were disclosed after reading the current dashboard wording. XX does not sell data, use it outside its single purpose, or use it for creditworthiness or lending decisions. The public privacy policy documents these restrictions.

## 审核测试步骤 / Reviewer instructions

1. Install the extension and use your own X account to sign in to x.com.
2. Refresh the home timeline after installation so page responses can be observed.
3. Inspect the account-information line beside timeline authors.
4. Open XX's popup, then Open settings. Toggle each field and the global switch.
5. Test compact/full numbers, both placement options and English/Chinese localization.
6. Missing fields are intentionally shown as unknown. Normal browsing may supply additional fields; the extension never sends extra profile requests.
7. Account records are kept only in tab memory. When switching X accounts, refresh the tab if an observable session change is not detected.

No test credentials are bundled or supplied. The extension does not operate accounts or publish posts.

## 提交记录

- 开发者账号已注册，公开发布者显示名：The Faceless。
- 已在真实 Chrome 中安装 0.1.2，验证 X 时间线计数和关注关系。已修复首页新计数字段解析，并验证多次刷新；真正缺失字段按设计显示未知。
- 仓库与隐私政策已公开，匿名访问返回 HTTP 200：https://github.com/Tryking/xx-extension/blob/main/PRIVACY.md
- 商店介绍/主页：https://github.com/Tryking/xx-extension
- 公开联系邮箱已验证：ktingdeng@gmail.com。
- 发布者账号 kaitingdeng@gmail.com 已由用户开启两步验证。
- 已上传图标、小型宣传图和英文/中文功能截图；设置页的示例数据已明确标注。
- 已依据后台当前问卷填写数据使用披露，不将本地处理误写为完全不访问用户数据。
- 已保存英文审核步骤；不向审核人员提供个人账号密码。
- 提交确认窗口显示 Your extension was submitted for review；条目状态为 Pending review。
