(() => {
  const defaults = {
    enabled: true,
    followers: true,
    following: true,
    relationship: true,
    position: "below",
    numberFormat: "compact",
    language: "auto",
  };
  const messages = {
    en: {
      title: "Extra tools for X",
      subtitle: "A little extra for your X.",
      account: "Account information",
      description: "See the people behind your timeline.",
      enabled: "Enable XX",
      followers: "Show follower count",
      following: "Show following count",
      relationship: "Show follow relationship",
      position: "Display position",
      below: "Below the username",
      inline: "Beside the username",
      numberFormat: "Number format",
      compact: "Compact",
      full: "Full numbers",
      language: "Language",
      auto: "Follow browser",
      preview: "Live preview · sample data",
      saved: "Saved",
      saving: "Saving…",
      error: "Could not save. Please try again.",
      privacy:
        "Account data stays in this tab. XX only reads responses X has already loaded; it makes no extra API requests.",
      missing: "Missing data appears as unknown. Refresh X after installing.",
      settings: "Open settings",
      followerLabel: "followers",
      followingLabel: "following",
      mutual: "Mutual follow",
      followsYou: "Follows you",
      youFollow: "Following",
      neither: "No follow connection",
      unknown: "Relationship unknown",
      pending: "Waiting for page data",
      unknownCount: "unknown",
    },
    zh_CN: {
      title: "X 增强工具箱",
      subtitle: "给你的 X，加点料。",
      account: "账号信息",
      description: "刷到一条推文，一眼了解作者。",
      enabled: "启用 XX",
      followers: "显示粉丝数",
      following: "显示关注数",
      relationship: "显示关注关系",
      position: "显示位置",
      below: "用户名下方",
      inline: "用户名旁边",
      numberFormat: "数字格式",
      compact: "简写",
      full: "完整数字",
      language: "界面语言",
      auto: "跟随浏览器",
      preview: "实时预览 · 示例数据",
      saved: "已保存",
      saving: "保存中…",
      error: "保存失败，请重试。",
      privacy:
        "账号数据只保留在当前标签页。XX 仅读取 X 已加载的响应，不额外请求接口。",
      missing: "未获取到的数据标记为未知。安装后请刷新 X。",
      settings: "打开设置",
      followerLabel: "粉丝",
      followingLabel: "关注",
      mutual: "互相关注",
      followsYou: "关注了你",
      youFollow: "你已关注",
      neither: "无关注关系",
      unknown: "关注关系未知",
      pending: "等待页面数据",
      unknownCount: "未知",
    },
  };
  function locale(settings) {
    return settings.language === "auto"
      ? /^zh/i.test(globalThis.navigator?.language || "en")
        ? "zh_CN"
        : "en"
      : settings.language === "zh_CN"
        ? "zh_CN"
        : "en";
  }
  function count(value, settings) {
    const lang = locale(settings);
    if (value === undefined) return messages[lang].unknownCount;
    if (settings.numberFormat === "full")
      return value.toLocaleString(lang === "zh_CN" ? "zh-CN" : "en-US");
    if (lang === "zh_CN") {
      const divisor = value >= 1e8 ? 1e8 : value >= 1e4 ? 1e4 : 1;
      return divisor === 1
        ? String(value)
        : `${Math.round((value / divisor) * 10) / 10}${divisor === 1e8 ? "亿" : "万"}`;
    }
    return new Intl.NumberFormat("en-US", {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value);
  }
  function relation(user, t) {
    if (user?.followsYou === true && user?.youFollow === true) return t.mutual;
    if (user?.followsYou === true) return t.followsYou;
    if (user?.youFollow === true) return t.youFollow;
    if (user?.followsYou === false && user?.youFollow === false)
      return t.neither;
    return t.unknown;
  }
  function parts(user, settings) {
    const lang = locale(settings),
      t = messages[lang],
      result = [];
    for (const [field, label] of [
      ["followers", "followerLabel"],
      ["following", "followingLabel"],
    ])
      if (settings[field]) {
        const n = count(user?.[field], settings);
        result.push({
          text: lang === "zh_CN" ? `${t[label]} ${n}` : `${n} ${t[label]}`,
          title:
            user?.[field] === undefined
              ? t.pending
              : user[field].toLocaleString(
                  lang === "zh_CN" ? "zh-CN" : "en-US",
                ),
        });
      }
    if (settings.relationship)
      result.push({ text: relation(user, t), title: t.relationship });
    return result;
  }
  function sanitize(input) {
    const result = { ...defaults };
    for (const key of ["enabled", "followers", "following", "relationship"])
      if (typeof input?.[key] === "boolean") result[key] = input[key];
    for (const [key, allowed] of Object.entries({
      position: ["below", "inline"],
      numberFormat: ["compact", "full"],
      language: ["auto", "en", "zh_CN"],
    }))
      if (allowed.includes(input?.[key])) result[key] = input[key];
    return result;
  }
  globalThis.XXI18n = { defaults, messages, locale, parts, sanitize };
})();
