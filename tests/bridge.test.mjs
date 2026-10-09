import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
const bridge = readFileSync(new URL("../bridge.js", import.meta.url), "utf8");
const model = readFileSync(
  new URL("../shared/model.js", import.meta.url),
  "utf8",
);
test("passive fetch returns original response, ignores non-X requests, discards old account responses", async () => {
  const messages = [],
    pending = [];
  let calls = 0;
  class XHR {
    open() {}
    send() {}
    addEventListener() {}
  }
  const context = {
    URL,
    XMLHttpRequest: XHR,
    document: { cookie: "twid=first; ct0=token" },
    location: { href: "https://x.com/home", origin: "https://x.com" },
    setInterval() {},
    fetch() {
      calls++;
      return new Promise((resolve) => pending.push(resolve));
    },
    postMessage(message) {
      messages.push(message);
    },
  };
  context.window = context;
  vm.createContext(context);
  vm.runInContext(model, context);
  vm.runInContext(bridge, context);
  const payload = {
    rest_id: "1",
    core: { screen_name: "alice" },
    legacy: { followers_count: 5, followed_by: true },
  };
  const response = {
    ok: true,
    headers: { get: () => "application/json" },
    clone: () => ({ json: async () => payload }),
  };
  const first = context.fetch("/i/api/graphql/id/HomeTimeline");
  pending.shift()(response);
  assert.equal(await first, response);
  await new Promise(setImmediate);
  assert.equal(messages[0].users[0].followers, 5);
  assert.equal(calls, 1);
  context.fetch("https://example.com/i/api/graphql/a");
  pending.shift()(response);
  await new Promise(setImmediate);
  assert.equal(messages.length, 1);
  context.fetch("/i/api/graphql/id/HomeTimeline");
  context.document.cookie = "twid=second; ct0=newtoken";
  pending.shift()(response);
  await new Promise(setImmediate);
  assert.equal(messages.at(-1).epoch, 1);
  assert.equal(messages.at(-1).users.length, 0);
  assert.equal(JSON.stringify(messages).includes("token"), false);
  context.fetch("/i/api/graphql/id/HomeTimeline");
  pending.shift()(response);
  await new Promise(setImmediate);
  assert.equal(messages.at(-1).epoch, 1);
  assert.equal(messages.at(-1).users.length, 1);
});
