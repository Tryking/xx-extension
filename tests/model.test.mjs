import { test } from "node:test";
import assert from "node:assert/strict";
import "../shared/model.js";
import "../shared/i18n.js";
const { normalizeUser, collectUsers, UserCache } = globalThis.XXModel;
test("new and legacy user schemas preserve false and zero", () => {
  const user = normalizeUser({
    __typename: "User",
    rest_id: "42",
    core: { screen_name: "Alice" },
    legacy: { followers_count: 0, friends_count: 12, followed_by: true },
    relationship_perspectives: { followed_by: false, following: null },
  });
  assert.equal(user.handle, "alice");
  assert.equal(user.followers, 0);
  assert.equal(user.followsYou, false);
  assert.equal(user.youFollow, undefined);
  assert.equal(
    normalizeUser({ id_str: "2", screen_name: "bob", followers_count: 3 })
      .followers,
    3,
  );
  assert.equal(
    normalizeUser({
      __typename: "UserUnavailable",
      rest_id: "4",
      core: { screen_name: "a" },
    }),
    null,
  );
});
test("nested timeline traversal merges only observed fields", () => {
  const users = collectUsers({
    entries: [
      {
        user: {
          rest_id: "1",
          legacy: { screen_name: "a", followers_count: 8 },
        },
      },
      {
        user: {
          rest_id: "1",
          core: { screen_name: "a" },
          relationship_perspectives: { following: false },
        },
      },
    ],
  });
  assert.equal(users.length, 1);
  assert.equal(users[0].followers, 8);
  assert.equal(users[0].youFollow, false);
});
test("partial updates do not prolong relationship TTL; changed IDs do not inherit fields", () => {
  const cache = new UserCache(100, 2);
  cache.put({ id: "1", handle: "a", followers: 8, followsYou: true }, 0);
  cache.put({ id: "1", handle: "a", followers: 9 }, 80);
  assert.equal(cache.get("a", 101).followsYou, undefined);
  assert.equal(cache.get("a", 101).followers, 9);
  cache.put({ id: "2", handle: "a", following: 4 }, 110);
  assert.equal(cache.get("a", 111).followers, undefined);
  cache.put({ id: "3", handle: "b" }, 120);
  cache.put({ id: "4", handle: "c" }, 130);
  assert.equal(cache.get("a", 140), null);
  cache.clear();
  assert.equal(cache.get("b", 140), null);
});
test("missing relationships never imply no connection; localized formatting", () => {
  const { parts, defaults, messages } = XXI18n;
  const settings = { ...defaults, language: "zh_CN" };
  assert.equal(
    parts({ followers: 23456, following: 0 }, settings)[0].text,
    "粉丝 2.3万",
  );
  assert.equal(parts({}, settings)[2].text, messages.zh_CN.unknown);
  assert.equal(
    parts({ followsYou: false }, settings)[2].text,
    messages.zh_CN.unknown,
  );
  assert.equal(
    parts({ followsYou: false, youFollow: false }, settings)[2].text,
    messages.zh_CN.neither,
  );
  assert.equal(
    parts({ followsYou: true, youFollow: true }, settings)[2].text,
    messages.zh_CN.mutual,
  );
  assert.equal(
    parts({ followers: 23456 }, { ...settings, language: "en" })[0].text,
    "23.5K followers",
  );
});
