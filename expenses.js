(() => {
  "use strict";

  // 花費記帳：資料只存在本機 localStorage，依地區分開記錄，所有頁面共用同一份資料與匯率。
  const section = document.querySelector("#expenses");
  if (!section) return;

  const region = section.dataset.region;
  const STORE_KEY = "trip-expenses:v1";
  const RATE_KEY = "trip-expense-rate:v1";
  const REGIONS = ["東京", "北海道", "九州", "名古屋"];
  const CATEGORIES = ["餐飲", "交通", "住宿", "購物", "門票", "其他"];
  const MAX_YEN = 10000000;
  const DEFAULT_RATE = 0.21;

  const form = section.querySelector("#expense-form");
  const dateInput = form.elements.date;
  const categoryInput = form.elements.category;
  const noteInput = form.elements.note;
  const yenInput = form.elements.yen;
  const rateInput = section.querySelector("#expense-rate");
  const preview = section.querySelector("#expense-preview");
  const status = section.querySelector("#expense-status");
  const list = section.querySelector("#expense-list");
  const empty = section.querySelector("#expense-empty");
  const clearButton = section.querySelector("#expense-clear");
  const number = new Intl.NumberFormat("zh-TW", { maximumFractionDigits: 0 });
  let storageOk = true;
  let lastDeleted = null;

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function today() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  }

  function validEntry(entry) {
    return entry && typeof entry.id === "string" && REGIONS.includes(entry.region)
      && CATEGORIES.includes(entry.category) && /^\d{4}-\d{2}-\d{2}$/.test(entry.date)
      && Number.isInteger(entry.yen) && entry.yen > 0 && entry.yen <= MAX_YEN
      && typeof entry.note === "string" && entry.note.length <= 60;
  }

  function loadEntries() {
    try {
      const data = JSON.parse(localStorage.getItem(STORE_KEY) || "[]");
      return Array.isArray(data) ? data.filter(validEntry) : [];
    } catch {
      return [];
    }
  }

  function saveEntries(entries) {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(entries));
      storageOk = true;
    } catch {
      storageOk = false;
    }
    return storageOk;
  }

  function loadRate() {
    try {
      const value = Number(localStorage.getItem(RATE_KEY));
      return value > 0 && value <= 5 ? value : DEFAULT_RATE;
    } catch {
      return DEFAULT_RATE;
    }
  }

  function currentRate() {
    const value = Number(rateInput.value);
    return rateInput.checkValidity() && value > 0 ? value : null;
  }

  function yen(value) { return `¥${number.format(value)}`; }
  function twd(value, rate) { return rate ? `NT$${number.format(value * rate)}` : "NT$—"; }

  function setStatus(text, kind = "", undo = false) {
    status.replaceChildren();
    status.className = `message ${kind}`.trim();
    status.hidden = !text;
    if (!text) return;
    status.append(document.createTextNode(text));
    if (undo) {
      const button = element("button", "link-button", "復原");
      button.type = "button";
      button.addEventListener("click", undoDelete);
      status.append(" ", button);
    }
  }

  function render() {
    const rate = currentRate();
    const entries = loadEntries();
    const mine = entries.filter(entry => entry.region === region)
      .sort((a, b) => b.date.localeCompare(a.date) || b.created - a.created);
    const regionTotal = mine.reduce((sum, entry) => sum + entry.yen, 0);
    const allTotal = entries.reduce((sum, entry) => sum + entry.yen, 0);

    section.querySelector("#expense-region-yen").textContent = yen(regionTotal);
    section.querySelector("#expense-region-twd").textContent = `約 ${twd(regionTotal, rate)}・${mine.length} 筆`;
    section.querySelector("#expense-all-yen").textContent = yen(allTotal);
    section.querySelector("#expense-all-twd").textContent = `約 ${twd(allTotal, rate)}・${entries.length} 筆`;

    const byCategory = section.querySelector("#expense-categories");
    byCategory.replaceChildren(...CATEGORIES.map(category => {
      const sum = mine.filter(entry => entry.category === category).reduce((total, entry) => total + entry.yen, 0);
      const item = element("li", sum ? "" : "is-zero");
      const bar = element("span", "category-bar");
      bar.style.setProperty("--share", regionTotal ? `${Math.round(sum / regionTotal * 100)}%` : "0%");
      item.append(element("span", "category-name", category), bar, element("span", "category-sum", `${yen(sum)}（${twd(sum, rate)}）`));
      return item;
    }));

    const byRegion = section.querySelector("#expense-regions");
    byRegion.replaceChildren(...REGIONS.map(name => {
      const sum = entries.filter(entry => entry.region === name).reduce((total, entry) => total + entry.yen, 0);
      const item = element("li", name === region ? "is-current" : "");
      item.append(element("span", "", name), element("span", "", `${yen(sum)}（${twd(sum, rate)}）`));
      return item;
    }));

    list.replaceChildren(...mine.map(entry => {
      const item = element("li", "expense-item");
      const info = element("div", "expense-info");
      info.append(element("span", "badge", entry.category), element("span", "expense-note", entry.note || "（未填項目）"),
        element("span", "expense-date", entry.date));
      const amount = element("div", "expense-amount");
      amount.append(element("strong", "", yen(entry.yen)), element("span", "", twd(entry.yen, rate)));
      const remove = element("button", "icon-button", "刪除");
      remove.type = "button";
      remove.setAttribute("aria-label", `刪除 ${entry.date} ${entry.note || entry.category} ${yen(entry.yen)}`);
      remove.addEventListener("click", () => deleteEntry(entry.id));
      item.append(info, amount, remove);
      return item;
    }));
    empty.hidden = mine.length > 0;
    clearButton.disabled = mine.length === 0;
  }

  function updatePreview() {
    const rate = currentRate();
    const value = Number(yenInput.value);
    preview.textContent = !rate
      ? "請輸入有效匯率（大於 0、最多 5）。"
      : value > 0 ? `約 ${twd(value, rate)}` : `匯率 1 日圓 ≈ ${rate} 台幣`;
  }

  function deleteEntry(id) {
    const entries = loadEntries();
    const index = entries.findIndex(entry => entry.id === id);
    if (index < 0) return;
    [lastDeleted] = entries.splice(index, 1);
    if (!saveEntries(entries)) {
      setStatus("無法刪除：此瀏覽器不允許儲存資料。", "error");
      return;
    }
    setStatus(`已刪除「${lastDeleted.note || lastDeleted.category}」${yen(lastDeleted.yen)}。`, "", true);
    render();
  }

  function undoDelete() {
    if (!lastDeleted) return;
    const entries = loadEntries();
    entries.push(lastDeleted);
    if (saveEntries(entries)) {
      setStatus(`已復原「${lastDeleted.note || lastDeleted.category}」。`, "success");
      lastDeleted = null;
      render();
    }
  }

  form.addEventListener("submit", event => {
    event.preventDefault();
    const amount = Number(yenInput.value);
    const note = noteInput.value.trim();
    if (!form.reportValidity()) return;
    if (!Number.isInteger(amount) || amount <= 0 || amount > MAX_YEN) {
      setStatus("金額請輸入 1 到 10,000,000 之間的整數日圓。", "error");
      return;
    }
    if (!CATEGORIES.includes(categoryInput.value) || !/^\d{4}-\d{2}-\d{2}$/.test(dateInput.value)) {
      setStatus("請確認日期與類別。", "error");
      return;
    }
    const entries = loadEntries();
    const entry = {
      id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
      region, date: dateInput.value, category: categoryInput.value, note: note.slice(0, 60), yen: amount, created: Date.now(),
    };
    entries.push(entry);
    if (!saveEntries(entries)) {
      setStatus("無法儲存：此瀏覽器可能為私密模式或已停用儲存空間。", "error");
      return;
    }
    setStatus(`已記錄 ${yen(amount)}（${twd(amount, currentRate())}）。`, "success");
    noteInput.value = "";
    yenInput.value = "";
    updatePreview();
    render();
    yenInput.focus();
  });

  rateInput.addEventListener("input", () => {
    const rate = currentRate();
    if (rate) {
      try { localStorage.setItem(RATE_KEY, String(rate)); } catch { /* 無法儲存時仍可在本頁使用 */ }
    }
    updatePreview();
    render();
  });
  yenInput.addEventListener("input", updatePreview);

  clearButton.addEventListener("click", () => {
    if (!window.confirm(`確定要刪除${region}的全部花費紀錄嗎？此動作無法復原。`)) return;
    if (saveEntries(loadEntries().filter(entry => entry.region !== region))) {
      lastDeleted = null;
      setStatus(`已清除${region}的全部紀錄。`);
      render();
    }
  });

  // 其他分頁修改資料時同步更新。
  window.addEventListener("storage", event => {
    if (event.key === RATE_KEY) rateInput.value = String(loadRate());
    if (event.key === STORE_KEY || event.key === RATE_KEY) { updatePreview(); render(); }
  });

  dateInput.value = today();
  rateInput.value = String(loadRate());
  try {
    localStorage.setItem("trip-expenses:probe", "1");
    localStorage.removeItem("trip-expenses:probe");
  } catch {
    setStatus("此瀏覽器無法儲存資料（可能為私密模式），記帳內容不會保留。", "error");
  }
  updatePreview();
  render();
})();
