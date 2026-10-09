(() => {
  const fields = ["followers", "following", "followsYou", "youFollow"];
  const number = (value) =>
    Number.isSafeInteger(value) && value >= 0 ? value : undefined;
  const boolean = (...values) =>
    values.find((value) => typeof value === "boolean");
  function normalizeUser(raw) {
    if (!raw || typeof raw !== "object") return null;
    const legacy = raw.legacy || raw;
    const handle =
      raw.core?.screen_name || legacy.core?.screen_name || legacy.screen_name;
    const id = raw.rest_id || legacy.id_str;
    if (!id || !/^[a-zA-Z0-9_]{1,15}$/.test(handle || "")) return null;
    if (raw.__typename && raw.__typename !== "User") return null;
    const rel = raw.relationship_perspectives || {};
    return {
      id: String(id),
      handle: handle.toLowerCase(),
      followers: number(raw.relationship_counts?.followers) ?? number(legacy.followers_count),
      following: number(raw.relationship_counts?.following) ?? number(legacy.friends_count),
      followsYou: boolean(rel.followed_by, legacy.followed_by),
      youFollow: boolean(rel.following, legacy.following),
    };
  }
  function collectUsers(root) {
    const users = new Map(),
      stack = [root];
    let visited = 0;
    while (stack.length && visited++ < 100000) {
      const value = stack.pop();
      if (!value || typeof value !== "object") continue;
      const user = normalizeUser(value);
      if (user) {
        const old = users.get(user.handle);
        const merged = old?.id === user.id ? { ...old } : {};
        for (const [key, val] of Object.entries(user))
          if (val !== undefined) merged[key] = val;
        users.set(user.handle, merged);
      }
      for (const child of Object.values(value))
        if (child && typeof child === "object") stack.push(child);
    }
    return [...users.values()];
  }
  class UserCache {
    constructor(freshFor = 300000, limit = 3000) {
      this.freshFor = freshFor;
      this.limit = limit;
      this.entries = new Map();
    }
    clear() {
      this.entries.clear();
    }
    put(user, now = Date.now()) {
      if (
        !user ||
        !/^[a-z0-9_]{1,15}$/.test(user.handle || "") ||
        typeof user.id !== "string"
      )
        return;
      let entry = this.entries.get(user.handle);
      if (entry?.id !== user.id)
        entry = { id: user.id, handle: user.handle, times: {} };
      for (const field of fields) {
        const value = user[field];
        if (
          field === "followers" || field === "following"
            ? number(value) !== undefined
            : typeof value === "boolean"
        ) {
          entry[field] = value;
          entry.times[field] = now;
        }
      }
      this.entries.delete(user.handle);
      this.entries.set(user.handle, entry);
      while (this.entries.size > this.limit)
        this.entries.delete(this.entries.keys().next().value);
    }
    get(handle, now = Date.now()) {
      const entry = this.entries.get(handle.toLowerCase());
      if (!entry) return null;
      // X can prefetch a timeline long before its virtual rows are displayed.
      // Age marks a snapshot as stale; it must not erase already observed data.
      this.entries.delete(entry.handle);
      this.entries.set(entry.handle, entry);
      const result = { id: entry.id, handle: entry.handle, stale: {} };
      for (const field of fields) {
        if (entry[field] === undefined) continue;
        result[field] = entry[field];
        result.stale[field] = now - entry.times[field] >= this.freshFor;
      }
      return result;
    }
  }
  globalThis.XXModel = { normalizeUser, collectUsers, UserCache };
})();
