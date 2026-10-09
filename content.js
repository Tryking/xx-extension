(() => {
  const cache = new XXModel.UserCache();
  let settings = { ...XXI18n.defaults },
    epoch = -1,
    scheduled = false;
  function schedule() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      render();
    });
  }
  function render() {
    const active =
      settings.enabled &&
      (settings.followers || settings.following || settings.relationship);
    document.querySelectorAll('[data-testid="tweet"]').forEach((tweet) => {
      const name = [
        ...tweet.querySelectorAll('[data-testid="User-Name"]'),
      ].find((node) => node.closest('[data-testid="tweet"]') === tweet);
      if (!name) return;
      let badge = [...tweet.querySelectorAll(".xx-account-info")].find(
        (node) => node.closest('[data-testid="tweet"]') === tweet,
      );
      if (!active) {
        badge?.remove();
        return;
      }
      const link = [...name.querySelectorAll("a[href]")].find((a) =>
        /^\/[a-zA-Z0-9_]{1,15}\/?$/.test(
          new URL(a.href, location.href).pathname,
        ),
      );
      if (!link) {
        badge?.remove();
        return;
      }
      const handle = new URL(link.href, location.href).pathname
        .replaceAll("/", "")
        .toLowerCase();
      if (!badge) {
        badge = document.createElement("span");
        badge.className = "xx-account-info";
      }
      badge.dataset.position = settings.position;
      const host = settings.position === "inline" ? name : name.parentElement;
      if (!host) return;
      if (badge.parentElement !== host) {
        if (settings.position === "inline") host.append(badge);
        else name.after(badge);
      }
      const parts = XXI18n.parts(cache.get(handle), settings);
      const key = JSON.stringify([handle, parts, settings.position]);
      if (badge.dataset.render === key) return;
      badge.dataset.render = key;
      badge.replaceChildren();
      for (const [index, part] of parts.entries()) {
        if (index) badge.append(document.createTextNode(" · "));
        const span = document.createElement("span");
        span.textContent = part.text;
        span.title = part.title;
        badge.append(span);
      }
    });
  }
  window.addEventListener("message", (event) => {
    const message = event.data;
    if (
      event.source !== window ||
      event.origin !== location.origin ||
      message?.source !== "xx-passive-v1" ||
      !Number.isSafeInteger(message.epoch) ||
      !Array.isArray(message.users) ||
      message.users.length > 3000
    )
      return;
    if (message.epoch < epoch) return;
    if (message.epoch !== epoch) {
      epoch = message.epoch;
      cache.clear();
    }
    for (const user of message.users) cache.put(user);
    schedule();
  });
  chrome.storage.local.get("settings").then((result) => {
    settings = XXI18n.sanitize(result.settings);
    schedule();
  });
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "local" && changes.settings) {
      settings = XXI18n.sanitize(changes.settings.newValue);
      schedule();
    }
  });
  new MutationObserver(schedule).observe(document, {
    childList: true,
    subtree: true,
  });
  setInterval(schedule, 30000);
})();
