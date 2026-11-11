(() => {
  "use strict";

  const installButton = document.querySelector("#install-button");
  const installHelp = document.querySelector("#install-help");
  const updateNotice = document.querySelector("#update-notice");
  const updateButton = document.querySelector("#update-button");
  const status = document.querySelector("#pwa-message");
  let installPrompt = null;
  let refreshing = false;

  function installed() {
    return window.matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
  }

  installHelp.hidden = installed();
  window.addEventListener("beforeinstallprompt", event => {
    event.preventDefault();
    installPrompt = event;
    installButton.hidden = installed();
    installHelp.hidden = true;
  });
  installButton.addEventListener("click", async () => {
    if (!installPrompt) return;
    const prompt = installPrompt;
    installPrompt = null;
    installButton.hidden = true;
    try {
      await prompt.prompt();
      const result = await prompt.userChoice;
      installHelp.hidden = result.outcome === "accepted";
    } catch {
      installHelp.hidden = false;
    }
  });
  window.addEventListener("appinstalled", () => {
    installPrompt = null;
    installButton.hidden = true;
    installHelp.hidden = true;
  });

  if (!("serviceWorker" in navigator) || !window.isSecureContext) {
    status.textContent = "此環境無法啟用離線功能；請透過 HTTPS 或 localhost 開啟。";
    status.hidden = false;
    return;
  }

  // 僅在使用者按更新後重新載入，避免新版本自動清掉正在填寫的表單。
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (refreshing) window.location.reload();
  });
  navigator.serviceWorker.register("./sw.js", { scope: "./", updateViaCache: "none" })
    .then(registration => {
      function offerUpdate() {
        updateNotice.hidden = !registration.waiting;
      }
      offerUpdate();
      registration.addEventListener("updatefound", () => {
        const worker = registration.installing;
        worker?.addEventListener("statechange", () => {
          if (worker.state === "installed" && navigator.serviceWorker.controller) offerUpdate();
        });
      });
      updateButton.addEventListener("click", () => {
        if (!registration.waiting) return;
        refreshing = true;
        registration.waiting.postMessage({ type: "SKIP_WAITING" });
      });
    })
    .catch(() => {
      status.textContent = "離線功能尚未準備好；目前仍可在線上使用，請連線後重新整理。";
      status.hidden = false;
    });
})();
