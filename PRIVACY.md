# Privacy / 隐私说明

XX has no server, telemetry, analytics SDK or external data upload. It does not send extra X API requests. / XX 无服务端、遥测、统计 SDK 或外部数据上传，不额外请求 X API。

Only display settings persist locally through `chrome.storage.local`. Account IDs, handles, follower counts, following counts and boolean relationship fields stay in tab memory; closing or refreshing the tab clears them. Previously received fields remain in the bounded cache for the current X session; after five minutes their tooltips indicate that the snapshot may have changed. Switching accounts clears the cache when a session change is observed. / 只在本机持久保存显示设置；账号 ID、用户名、计数和关系布尔值仅保存在标签页内存，关闭或刷新即清空，本次 X 会话已收到的字段保留在有数量上限的缓存中，超过五分钟时悬停提示会标明数据可能已变化；检测到账号会话变化时清空缓存。

The page bridge temporarily reads readable session cookies (`twid` and `ct0`) to compare account/session changes. Cookie values are not sent through the bridge, logged, persisted or uploaded. The shared page world can affect bridge behavior. / 桥接脚本在页面内临时读取可访问的会话 Cookie 以检测变化；值不通过消息传送、不记录、不持久化、不上传。网页主世界中的脚本可以影响桥接行为。

The extension runs on `https://x.com/*` and `https://twitter.com/*` and requests only the `storage` extension permission. / 扩展仅在这两个站点运行，扩展权限仅申请 `storage`。

No private-message content is extracted or retained. Raw JSON responses are transiently parsed locally to locate user records, then discarded. / 不提取或保留私信正文；原始 JSON 在本地临时解析以定位用户对象，随后丢弃。

XX examines the URLs of existing X API requests to identify relevant responses and observes those responses locally. It does not keep a browsing-history log or monitor clicks, keystrokes, mouse movements or visits to other sites. / XX 在本机检查现有 X API 请求的网址以识别相关响应，并观察这些响应；不保存浏览历史日志，不记录点击、按键、鼠标移动或其他网站的访问。

XX uses this data only to display account counts and follow relationships and to clear stale data when the X session changes. It does not sell or share user data, use it for advertising, or use it for creditworthiness or lending decisions. XX's use of information complies with the Chrome Web Store User Data Policy, including its Limited Use requirements. / XX 仅将这些数据用于显示账号计数、关注关系及在 X 会话变化时清除旧数据；不出售或分享用户数据，不用于广告、信用评估或借贷决策。XX 对信息的使用遵守 Chrome Web Store 用户数据政策，包括受限使用要求。

Uninstalling the extension removes its settings. / 卸载扩展会删除其设置。

Contact / 联系方式: [ktingdeng@gmail.com](mailto:ktingdeng@gmail.com). Publisher / 发布者: The Faceless.
