(() => {
  if (window.__xxBridgeInstalled) return;
  window.__xxBridgeInstalled = true;
  // Cookies stay in this world. Only an opaque generation reaches the UI.
  const signature = () =>
    document.cookie
      .split(";")
      .map((s) => s.trim())
      .filter((s) => /^(twid|ct0)=/.test(s))
      .sort()
      .join(";");
  let identity = signature(),
    epoch = 0;
  const emit = (users) =>
    window.postMessage(
      { source: "xx-passive-v1", epoch, users },
      location.origin,
    );
  const sync = () => {
    const next = signature();
    if (next !== identity) {
      identity = next;
      epoch++;
      emit([]);
    }
    return epoch;
  };
  setInterval(sync, 1000);
  const eligible = (input) => {
    try {
      const url = new URL(input, location.href);
      return (
        ["x.com", "twitter.com", "api.x.com", "api.twitter.com"].includes(
          url.hostname,
        ) && /\/(graphql|2|1\.1)\//.test(url.pathname)
      );
    } catch {
      return false;
    }
  };
  const accept = (body, generation) => {
    if (sync() !== generation) return;
    try {
      const users = XXModel.collectUsers(body);
      if (users.length) emit(users);
    } catch {}
  };
  const originalFetch = window.fetch;
  window.fetch = function (...args) {
    const generation = sync();
    const result = Reflect.apply(originalFetch, this, args);
    if (
      eligible(
        typeof args[0] === "string" || args[0] instanceof URL
          ? args[0]
          : args[0]?.url,
      )
    ) {
      result
        .then((response) => {
          if (
            !response.ok ||
            !response.headers.get("content-type")?.includes("json")
          )
            return;
          response
            .clone()
            .json()
            .then((body) => accept(body, generation))
            .catch(() => {});
        })
        .catch(() => {});
    }
    return result;
  };
  const originalOpen = XMLHttpRequest.prototype.open,
    originalSend = XMLHttpRequest.prototype.send;
  const requests = new WeakMap();
  XMLHttpRequest.prototype.open = function (method, url, ...rest) {
    requests.set(this, eligible(url));
    return Reflect.apply(originalOpen, this, [method, url, ...rest]);
  };
  XMLHttpRequest.prototype.send = function (...args) {
    const generation = sync();
    if (requests.get(this))
      this.addEventListener(
        "load",
        () => {
          try {
            if (this.status < 200 || this.status >= 300) return;
            const body =
              this.responseType === "json"
                ? this.response
                : JSON.parse(this.responseText);
            accept(body, generation);
          } catch {}
        },
        { once: true },
      );
    return Reflect.apply(originalSend, this, args);
  };
})();
