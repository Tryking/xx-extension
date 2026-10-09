# Privacy / 隐私说明

XX has no server, telemetry, analytics SDK or external data upload. It does not send extra X API requests. / XX 无服务端、遥测、统计 SDK 或外部数据上传，不额外请求 X API。

Only display settings persist locally through `chrome.storage.local`. Account IDs, handles, follower counts, following counts and boolean relationship fields stay in tab memory; closing or refreshing the tab clears them. Each cached field expires after five minutes. / 只在本机持久保存显示设置；账号 ID、用户名、计数和关系布尔值仅保存在标签页内存，关闭或刷新即清空，字段五分钟过期。

The page bridge temporarily reads readable session cookies (`twid` and `ct0`) to compare account/session changes. Cookie values are not sent through the bridge, logged, persisted or uploaded. The shared page world can affect bridge behavior. / 桥接脚本在页面内临时读取可访问的会话 Cookie 以检测变化；值不通过消息传送、不记录、不持久化、不上传。网页主世界中的脚本可以影响桥接行为。

The extension runs on `https://x.com/*` and `https://twitter.com/*` and requests only the `storage` extension permission. / 扩展仅在这两个站点运行，扩展权限仅申请 `storage`。

No private-message content is extracted or retained. Raw JSON responses are transiently parsed locally to locate user records, then discarded. / 不提取或保留私信正文；原始 JSON 在本地临时解析以定位用户对象，随后丢弃。

Uninstalling the extension removes its settings. / 卸载扩展会删除其设置。

Contact / 联系方式: [ktingdeng@gmail.com](mailto:ktingdeng@gmail.com). Publisher / 发布者: The Faceless.
