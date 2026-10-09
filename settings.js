(() => {
  let settings = { ...XXI18n.defaults };
  let queue = Promise.resolve();
  function render() {
    const lang = XXI18n.locale(settings),
      t = XXI18n.messages[lang];
    document.documentElement.lang = lang === "zh_CN" ? "zh-CN" : "en";
    document.querySelectorAll("[data-i18n]").forEach((node) => {
      node.textContent = t[node.dataset.i18n];
    });
    for (const [key, value] of Object.entries(settings)) {
      const input = document.getElementById(key);
      if (!input) continue;
      if (input.type === "checkbox") input.checked = value;
      else input.value = value;
    }
    const preview = document.getElementById("preview-badge");
    if (preview) {
      preview.dataset.position = settings.position;
      preview.textContent = settings.enabled
        ? XXI18n.parts(
            {
              followers: 23456,
              following: 816,
              followsYou: true,
              youFollow: true,
            },
            settings,
          )
            .map((p) => p.text)
            .join(" · ")
        : "";
    }
  }
  chrome.storage.local.get("settings").then((result) => {
    settings = XXI18n.sanitize(result.settings);
    render();
  });
  document.querySelectorAll("input,select").forEach((input) =>
    input.addEventListener("change", () => {
      settings[input.id] =
        input.type === "checkbox" ? input.checked : input.value;
      render();
      const snapshot = { ...settings },
        status = document.getElementById("status");
      if (status)
        status.textContent = XXI18n.messages[XXI18n.locale(settings)].saving;
      queue = queue
        .catch(() => {})
        .then(() => chrome.storage.local.set({ settings: snapshot }))
        .then(() => {
          if (status)
            status.textContent = XXI18n.messages[XXI18n.locale(settings)].saved;
        })
        .catch(() => {
          if (status)
            status.textContent = XXI18n.messages[XXI18n.locale(settings)].error;
        });
    }),
  );
  document
    .getElementById("open-settings")
    ?.addEventListener("click", () => chrome.runtime.openOptionsPage());
})();
