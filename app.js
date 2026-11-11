(() => {
  "use strict";

  const form = document.querySelector("#request-form");
  const fields = document.querySelector("#request-fields");
  const submitButton = document.querySelector("#submit-button");
  const refreshButton = document.querySelector("#refresh-button");
  const formMessage = document.querySelector("#form-message");
  const listMessage = document.querySelector("#list-message");
  const list = document.querySelector("#request-list");
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
    bottom.append(element("span", request.urgency === "高" ? "urgency-high" : "", `緊急程度：${request.urgency}`), time);
    item.append(top, element("p", "card-description", request.description), meta, bottom);
    return item;
  }

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
      list.replaceChildren(...(data || []).map(card));
      message(listMessage, data?.length ? "" : "目前還沒有報修，送出第一筆需求吧。");
    } catch {
      message(listMessage, "清單載入失敗，請確認網路後按「重新整理」。若下方仍有資料，為先前載入的內容。", "error");
    } finally {
      loading = false;
      list.setAttribute("aria-busy", "false");
      refreshButton.disabled = submitting;
    }
  }

  form.addEventListener("submit", async event => {
    event.preventDefault();
    if (submitting || !client || !form.reportValidity()) return;
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
      refreshButton.disabled = loading;
      submitButton.textContent = "送出報修 ↗";
    }
  });

  refreshButton.addEventListener("click", loadRequests);
  try {
    const config = window.REPAIR_CONFIG;
    if (!window.supabase?.createClient || !config?.supabaseUrl || !config?.supabasePublishableKey?.startsWith("sb_publishable_")) {
      throw new Error("Initialization unavailable");
    }
    client = window.supabase.createClient(config.supabaseUrl, config.supabasePublishableKey, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    });
    fields.disabled = false;
    loadRequests();
  } catch {
    fields.disabled = true;
    refreshButton.disabled = true;
    list.setAttribute("aria-busy", "false");
    message(formMessage, "報修服務尚未載入，請確認網路後重新整理此頁。", "error");
    message(listMessage, "目前無法載入清單，請稍後重新整理此頁。", "error");
  }
})();
