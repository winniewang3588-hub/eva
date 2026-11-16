(() => {
  "use strict";

  // 所有內容都以 textContent 呈現，不將文字解析為 HTML。
  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  /* ---------- 01 五天行程 ---------- */
  const days = [
    {
      title: "抵達・淺草與上野", theme: "下町老街",
      stops: [
        ["上午", "抵達機場", "搭 Skyliner 或京急線進市區，先到飯店寄放行李。"],
        ["下午", "淺草寺・雷門", "走仲見世通吃人形燒，再到隅田川畔看晴空塔。"],
        ["傍晚", "東京晴空塔", "想登塔可預約日落時段；不登塔也能在周邊商場逛逛。"],
        ["晚上", "上野・阿美橫丁", "平價居酒屋與小吃攤林立，適合第一晚輕鬆吃。"],
      ],
    },
    {
      title: "原宿・澀谷・新宿", theme: "潮流與夜景",
      stops: [
        ["上午", "明治神宮", "早上人少、空氣好，穿過大鳥居走進森林參道。"],
        ["中午", "竹下通・表參道", "從年輕潮流街一路逛到精品建築大道。"],
        ["傍晚", "澀谷十字路口・SHIBUYA SKY", "展望台熱門時段常額滿，建議提早網路預約。"],
        ["晚上", "新宿", "都廳展望室可免費看夜景，再到回憶橫丁吃串燒。"],
      ],
    },
    {
      title: "築地・銀座・台場", theme: "美食與海灣",
      stops: [
        ["早上", "築地場外市場", "海鮮丼、玉子燒當早餐；部分店家週日或週三公休。"],
        ["中午", "銀座", "百貨與旗艦店集中，週末下午中央通常規劃為行人徒步區。"],
        ["下午", "台場", "搭百合海鷗號過彩虹大橋，海濱公園散步。"],
        ["晚上", "彩虹大橋夜景", "在台場海濱看燈光，再搭車回市區。"],
      ],
    },
    {
      title: "鎌倉・江之島一日遊", theme: "近郊小旅行",
      stops: [
        ["上午", "前往鎌倉", "從東京或新宿搭 JR 約 1 小時。"],
        ["中午", "鶴岡八幡宮・小町通", "參拜後在小町通吃午餐、買伴手禮。"],
        ["下午", "鎌倉大佛・江之電", "搭復古的江之電沿海岸線前往江之島。"],
        ["傍晚", "江之島", "天氣好時可遠眺富士山，看完夕陽再返回東京。"],
      ],
    },
    {
      title: "自由採買・返程", theme: "收尾不趕",
      stops: [
        ["上午", "東京車站・丸之內", "紅磚車站拍照，一番街可買伴手禮與零食。"],
        ["中午", "最後一餐", "車站周邊拉麵、壽司選擇多，取完行李再出發。"],
        ["下午", "前往機場", "國際線建議起飛前 2–3 小時抵達，預留交通延誤時間。"],
      ],
    },
  ];

  const dayTabs = document.querySelector("#day-tabs");
  const dayPanel = document.querySelector("#day-panel");
  let selectedDay = 0;

  function renderDay() {
    const day = days[selectedDay];
    [...dayTabs.children].forEach((tab, index) => {
      const active = index === selectedDay;
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
    });
    dayPanel.setAttribute("aria-labelledby", `day-tab-${selectedDay}`);
    const heading = element("div", "day-heading");
    heading.append(element("h3", "", `Day ${selectedDay + 1}｜${day.title}`), element("span", "badge", day.theme));
    const timeline = element("ol", "timeline");
    day.stops.forEach(([time, place, note]) => {
      const item = element("li");
      item.append(element("span", "timeline-time", time), element("strong", "", place), element("p", "", note));
      timeline.append(item);
    });
    dayPanel.replaceChildren(heading, timeline);
  }

  days.forEach((day, index) => {
    const tab = element("button", "day-tab");
    tab.type = "button";
    tab.id = `day-tab-${index}`;
    tab.setAttribute("role", "tab");
    tab.setAttribute("aria-controls", "day-panel");
    tab.append(element("span", "day-tab-num", `Day ${index + 1}`), element("span", "day-tab-title", day.title));
    tab.addEventListener("click", () => { selectedDay = index; renderDay(); });
    dayTabs.append(tab);
  });
  dayTabs.addEventListener("keydown", event => {
    const moves = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    let next;
    if (event.key in moves) next = (selectedDay + moves[event.key] + days.length) % days.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = days.length - 1;
    else return;
    event.preventDefault();
    selectedDay = next;
    renderDay();
    dayTabs.children[next].focus();
  });
  renderDay();

  /* ---------- 02 區域指南 ---------- */
  const areas = [
    { name: "淺草", tags: ["文化", "美食"], station: "淺草站", desc: "淺草寺與仲見世通，最有江戶下町氣氛的地方。" },
    { name: "上野", tags: ["文化", "美食"], station: "上野站", desc: "上野公園、博物館群與阿美橫丁，交通往成田方便。" },
    { name: "谷根千", tags: ["文化"], station: "千駄木站・日暮里站", desc: "谷中、根津、千駄木一帶的老街與貓咪小巷，適合慢慢散步。" },
    { name: "秋葉原", tags: ["購物"], station: "秋葉原站", desc: "電器、動漫、模型與遊戲中心的集散地。" },
    { name: "銀座", tags: ["購物", "美食"], station: "銀座站", desc: "百貨、精品與老字號甜點店，街道整齊好逛。" },
    { name: "築地・豐洲", tags: ["美食"], station: "築地站・市場前站", desc: "築地場外市場吃海鮮早餐，豐洲則是新的批發市場。" },
    { name: "原宿・表參道", tags: ["購物", "文化"], station: "原宿站・表參道站", desc: "明治神宮的寧靜與竹下通的熱鬧只隔一條馬路。" },
    { name: "澀谷", tags: ["購物", "夜景"], station: "澀谷站", desc: "全球知名的十字路口與高樓展望台，年輕潮流中心。" },
    { name: "新宿", tags: ["美食", "夜景", "購物"], station: "新宿站", desc: "百貨、居酒屋巷弄與免費的都廳展望室，住宿選擇多。" },
    { name: "池袋", tags: ["購物", "美食"], station: "池袋站", desc: "大型商場與拉麵激戰區，住宿價格常比新宿親民。" },
    { name: "台場", tags: ["夜景", "購物"], station: "台場站", desc: "海濱公園與彩虹大橋，適合安排傍晚到晚上。" },
    { name: "吉祥寺", tags: ["自然", "美食"], station: "吉祥寺站", desc: "井之頭恩賜公園與文青小店，當地人也愛的生活感街區。" },
  ];
  const areaTags = ["全部", "美食", "購物", "文化", "夜景", "自然"];
  const areaFilters = document.querySelector("#area-filters");
  const areaList = document.querySelector("#area-list");
  const areaMessage = document.querySelector("#area-message");
  let selectedTag = "全部";

  function renderAreas() {
    [...areaFilters.children].forEach(button => {
      button.setAttribute("aria-pressed", String(button.dataset.tag === selectedTag));
    });
    const visible = selectedTag === "全部" ? areas : areas.filter(area => area.tags.includes(selectedTag));
    areaList.replaceChildren(...visible.map(area => {
      const item = element("li", "area-card");
      const top = element("div", "card-top");
      top.append(element("h3", "", area.name), element("span", "card-tags", area.tags.join("・")));
      item.append(top, element("p", "card-description", area.desc), element("p", "card-meta", `🚉 ${area.station}`));
      const photo = window.tripPhoto?.("tokyo", area.name);
      if (photo) { item.prepend(photo); item.classList.add("has-photo"); }
      return item;
    }));
    areaMessage.textContent = selectedTag === "全部"
      ? `共 ${visible.length} 個區域`
      : `適合「${selectedTag}」的區域：${visible.length} 個`;
  }

  areaTags.forEach(tag => {
    const button = element("button", "filter-button", tag);
    button.type = "button";
    button.dataset.tag = tag;
    button.addEventListener("click", () => { selectedTag = tag; renderAreas(); });
    areaFilters.append(button);
  });
  renderAreas();

  /* ---------- 04 預算試算 ---------- */
  const budgetForm = document.querySelector("#budget-form");
  const budgetError = document.querySelector("#budget-error");
  const budgetSummary = document.querySelector("#budget-summary");
  const yen = new Intl.NumberFormat("zh-TW", { maximumFractionDigits: 0 });

  function calculateBudget() {
    const fields = ["days", "people", "flight", "hotel", "food", "transit", "fun", "rate"];
    const value = Object.fromEntries(fields.map(name => [name, Number(budgetForm.elements[name].value)]));
    const valid = budgetForm.checkValidity() && fields.every(name => Number.isFinite(value[name]))
      && Number.isInteger(value.days) && Number.isInteger(value.people);
    budgetError.hidden = valid;
    budgetSummary.hidden = !valid;
    if (!valid) {
      budgetError.textContent = "請確認欄位：天數 1–30、人數 1–20 且為整數，金額不可為負數，匯率需大於 0。";
      return;
    }
    const nights = Math.max(value.days - 1, 0);
    const inJapan = value.hotel * nights + (value.food + value.transit + value.fun) * value.days * value.people;
    const total = inJapan * value.rate + value.flight * value.people;
    document.querySelector("#budget-yen").textContent = `¥${yen.format(inJapan)}（約 NT$${yen.format(inJapan * value.rate)}）`;
    document.querySelector("#budget-total").textContent = `NT$${yen.format(total)}`;
    document.querySelector("#budget-person").textContent = `NT$${yen.format(total / value.people)}`;
  }

  budgetForm.addEventListener("input", calculateBudget);
  budgetForm.addEventListener("submit", event => event.preventDefault());
  calculateBudget();

  /* ---------- 05 行前清單（只存在本機 localStorage） ---------- */
  const checklistItems = [
    "護照（確認效期足夠）",
    "機票與住宿確認信",
    "填寫 Visit Japan Web",
    "網卡、eSIM 或漫遊",
    "日圓現金與信用卡",
    "Suica／PASMO 交通卡",
    "行動電源（需隨身攜帶登機）",
    "旅遊平安險與不便險",
    "常備藥品",
    "好走的鞋子",
    "摺疊傘",
    "環保購物袋",
  ];
  const storageKey = "tokyo-trip-checklist:v1";
  const checklistList = document.querySelector("#checklist-list");
  const checklistProgress = document.querySelector("#checklist-progress");
  const checklistReset = document.querySelector("#checklist-reset");
  let checked = new Set();

  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || "[]");
    if (Array.isArray(saved)) checked = new Set(saved.filter(item => checklistItems.includes(item)));
  } catch {
    checked = new Set();
  }

  function saveChecklist() {
    try {
      localStorage.setItem(storageKey, JSON.stringify([...checked]));
    } catch {
      checklistProgress.textContent += "（此瀏覽器無法儲存勾選紀錄）";
    }
  }

  function renderProgress() {
    checklistProgress.textContent = checked.size === checklistItems.length
      ? `全部 ${checklistItems.length} 項都準備好了，出發吧！`
      : `已完成 ${checked.size}／${checklistItems.length} 項`;
  }

  checklistItems.forEach((text, index) => {
    const item = element("li");
    const label = element("label", "check-item");
    const box = document.createElement("input");
    box.type = "checkbox";
    box.id = `check-${index}`;
    box.checked = checked.has(text);
    box.addEventListener("change", () => {
      if (box.checked) checked.add(text); else checked.delete(text);
      renderProgress();
      saveChecklist();
    });
    label.append(box, element("span", "", text));
    item.append(label);
    checklistList.append(item);
  });
  checklistReset.addEventListener("click", () => {
    checked.clear();
    checklistList.querySelectorAll("input").forEach(box => { box.checked = false; });
    renderProgress();
    saveChecklist();
  });
  renderProgress();
})();
