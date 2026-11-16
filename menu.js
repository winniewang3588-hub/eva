(() => {
  "use strict";

  // 地點下拉選單以 <details> 實作，沒有 JavaScript 也能展開；這裡只補上點外面或按 Esc 收合。
  const menu = document.querySelector(".place-menu");
  if (!menu) return;
  const summary = menu.querySelector("summary");

  document.addEventListener("click", event => {
    if (menu.open && !menu.contains(event.target)) menu.open = false;
  });
  menu.addEventListener("keydown", event => {
    if (event.key === "Escape" && menu.open) {
      menu.open = false;
      summary.focus();
    }
  });
})();
