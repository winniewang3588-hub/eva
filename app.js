(() => {
  "use strict";

  const form = document.querySelector("#request-form");
  const fields = document.querySelector("#request-fields");
  const submitButton = document.querySelector("#submit-button");
  const refreshButton = document.querySelector("#refresh-button");
  const formMessage = document.querySelector("#form-message");
  const listMessage = document.querySelector("#list-message");
  const list = document.querySelector("#request-list");
  const filterButtons = document.querySelectorAll("#urgency-filters button");
  const filterMessage = document.querySelector("#filter-message");
  const categories = new Set(["設備", "網路", "環境", "其他"]);
  const urgencies = new Set(["低", "中", "高"]);
  const statusClasses = { "待處理": "pending", "處理中": "progress", "已完成": "done" };
  const formatter = new Intl.DateTimeFormat("zh-TW", {
    dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Taipei",
  });
  let client;
  let submitting = false;
  let loading = false;
  let currentLoad = null;
  let requests = [];
  let hasLoaded = false;
  let selectedUrgency = "全部";
  let wasOffline = false;

  function updateConnection() {
    const offline = !navigator.onLine;
    submitButton.disabled = offline || !client;
    refreshButton.disabled = offline || loading || submitting || !client;
    if (!client) fields.disabled = !offline;
    message(document.querySelector("#connection-message"), offline
      ? "目前離線：可填寫表單，但無法送出或重新讀取清單。畫面若有資料，僅為本次開啟期間已載入的內容；連線恢復後請按「重新整理」。"
      : "");
    if (offline) {
      message(listMessage, "目前離線，清單不會自動更新；請連線後按「重新整理」。");
    } else if (wasOffline) {
      message(listMessage, client
        ? "連線已恢復，請按「重新整理」取得最新清單。"
        : "連線已恢復，請重新整理整個頁面載入報修服務。");
    }
    wasOffline = offline;
  }

  window.addEventListener("online", updateConnection);
  window.addEventListener("offline", updateConnection);

  function message(element, text, kind = "") {
    element.textContent = text;
    element.className = `message ${kind}`.trim();
    element.hidden = !text;
  }

  // 所有使用者內容都透過 textContent 顯示，不將資料庫文字解析為 HTML。
  function element(tag, className, text) {
    const node = document.createElement(tag);
    node.className = className;
    node.textContent = text;
    return node;
  }

  function card(request) {
    const item = element("li", "request-card", "");
    const top = element("div", "card-top", "");
    const statusClass = statusClasses[request.status] || "pending";
    top.append(element("span", `badge status-${statusClass}`, request.status || "待處理"),
      element("span", "card-category", request.category));
    const meta = element("div", "card-meta", "");
    meta.append(element("span", "", `報修人：${request.reporter_name}`),
      element("span", "", `地點：${request.location}`));
    const bottom = element("div", "card-bottom", "");
    const time = element("time", "", "時間未知");
    const date = new Date(request.created_at);
    if (request.created_at && !Number.isNaN(date.getTime())) {
      time.dateTime = date.toISOString();
      time.textContent = `${formatter.format(date)}（台北）`;
    }
    bottom.append(element("span", request.urgency === "高" ? "badge urgency-high" : "badge", `緊急程度：${request.urgency}`), time);
    item.append(top, element("p", "card-description", request.description), meta, bottom);
    return item;
  }

  // 篩選只使用已載入的最近 20 筆，不新增任何資料庫請求，並保留原有排序。
  function renderRequests() {
    filterButtons.forEach(button => {
      button.setAttribute("aria-pressed", String(button.dataset.urgency === selectedUrgency));
    });
    if (!hasLoaded) return;
    const visibleRequests = selectedUrgency === "全部"
      ? requests
      : requests.filter(request => request.urgency === selectedUrgency);
    list.replaceChildren(...visibleRequests.map(card));
    filterMessage.hidden = false;
    if (!requests.length) {
      filterMessage.textContent = "目前還沒有報修，送出第一筆需求吧。";
    } else if (!visibleRequests.length) {
      filterMessage.textContent = `最近 20 筆中沒有緊急程度「${selectedUrgency}」的報修。`;
    } else {
      filterMessage.textContent = selectedUrgency === "全部"
        ? `顯示最近 ${visibleRequests.length} 筆報修`
        : `顯示緊急程度「${selectedUrgency}」的 ${visibleRequests.length} 筆報修（限最近 20 筆）`;
    }
  }

  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      selectedUrgency = button.dataset.urgency;
      renderRequests();
    });
  });

  // 設定等待上限；中斷寫入時不自動重送，避免產生重複報修。
  async function withTimeout(operation) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);
    try {
      return await operation(controller.signal);
    } finally {
      clearTimeout(timer);
    }
  }

  function loadRequests() {
    if (currentLoad) return currentLoad;
    currentLoad = fetchRequests().finally(() => { currentLoad = null; });
    return currentLoad;
  }

  async function fetchRequests() {
    if (!navigator.onLine) {
      message(listMessage, "目前離線，清單不會自動更新；請連線後按「重新整理」。");
      updateConnection();
      return;
    }
    loading = true;
    refreshButton.disabled = true;
    list.setAttribute("aria-busy", "true");
    message(listMessage, "正在載入報修清單…");
    try {
      const { data, error } = await withTimeout(signal => client
        .from("repair_requests")
        .select("id,created_at,reporter_name,location,category,description,urgency,status")
        .order("created_at", { ascending: false })
        .order("id", { ascending: false })
        .limit(20)
        .abortSignal(signal));
      if (error) throw error;
      requests = data || [];
      hasLoaded = true;
      renderRequests();
      message(listMessage, "");
    } catch {
      message(listMessage, "清單載入失敗，請確認網路後按「重新整理」。若下方仍有資料，為先前載入的內容。", "error");
    } finally {
      loading = false;
      list.setAttribute("aria-busy", "false");
      updateConnection();
    }
  }

  form.addEventListener("submit", async event => {
    event.preventDefault();
    if (submitting || !client || !form.reportValidity()) return;
    if (!navigator.onLine) {
      message(formMessage, "目前離線，尚未送出；請保持此頁開啟，連線後再手動送出。", "error");
      return;
    }
    const input = new FormData(form);
    // 僅送出獲准新增的五個內容欄位；不傳 status、id 或 created_at。
    const payload = Object.fromEntries(["reporter_name", "location", "category", "description", "urgency"]
      .map(name => [name, String(input.get(name) || "").trim()]));
    if (!payload.reporter_name || !payload.location || !payload.description) {
      message(formMessage, "報修人、地點與問題說明不能只填空白。", "error");
      return;
    }
    if (payload.reporter_name.length > 80 || payload.location.length > 120 || payload.description.length > 2000
      || !categories.has(payload.category) || !urgencies.has(payload.urgency)) {
      message(formMessage, "請確認欄位長度，並使用清單中的類別與緊急程度。", "error");
      return;
    }
    submitting = true;
    fields.disabled = true;
    refreshButton.disabled = true;
    submitButton.textContent = "送出中…";
    message(formMessage, "正在送出報修，請稍候…");
    try {
      const { error } = await withTimeout(signal => client.from("repair_requests").insert(payload).abortSignal(signal));
      if (error) throw error;
      form.reset();
      message(formMessage, "報修已成功送出，謝謝你的登記！", "success");
      if (currentLoad) await currentLoad;
      await loadRequests();
    } catch {
      message(formMessage, "報修未能確認送出，已保留填寫內容。請確認網路，先重新整理清單確認是否已登記，再決定是否重送。", "error");
    } finally {
      submitting = false;
      fields.disabled = false;
      updateConnection();
      submitButton.textContent = "送出報修 ↗";
    }
  });

  refreshButton.addEventListener("click", loadRequests);
  updateConnection();
  try {
    const config = window.REPAIR_CONFIG;
    if (!window.supabase?.createClient || !config?.supabaseUrl || !config?.supabasePublishableKey?.startsWith("sb_publishable_")) {
      throw new Error("Initialization unavailable");
    }
    client = window.supabase.createClient(config.supabaseUrl, config.supabasePublishableKey, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    });
    fields.disabled = false;
    updateConnection();
    loadRequests();
  } catch {
    fields.disabled = navigator.onLine;
    refreshButton.disabled = true;
    list.setAttribute("aria-busy", "false");
    message(formMessage, navigator.onLine
      ? "報修服務尚未載入，請確認網路後重新整理此頁。"
      : "報修服務尚未載入，內容不會自動送出；連線後請重新整理頁面，再手動送出。", "error");
    message(listMessage, navigator.onLine
      ? "目前無法載入清單，請稍後重新整理此頁。"
      : "目前離線，無法讀取清單；報修資料不會儲存在離線快取。");
  }
})();
