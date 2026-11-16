(() => {
  "use strict";

  // 所有內容都以 textContent 呈現，不將文字解析為 HTML。
  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  /* ---------- 01 五天路線 ---------- */
  const days = [
    {
      title: "名古屋城・榮", theme: "城下町初體驗",
      stops: [
        ["上午", "中部國際機場 → 名古屋", "搭名鐵約 30 分鐘到名古屋站，先到飯店寄放行李。"],
        ["中午", "名古屋城", "天守閣因木造復原工程不開放入內，但金碧輝煌的本丸御殿非常值得看。"],
        ["下午", "榮・綠洲 21", "搭地下鐵到榮逛街，綠洲 21 的玻璃屋頂「水之宇宙船」可散步拍照。"],
        ["晚上", "手羽先與名古屋夜景", "吃甜辣炸雞翅，再到名古屋電視塔（中部電力 MIRAI TOWER）看夜景。"],
      ],
    },
    {
      title: "熱田神宮・大須", theme: "神社與庶民商店街",
      stops: [
        ["上午", "熱田神宮", "供奉三神器之一草薙劍，境內大樹參天，氣氛莊嚴。"],
        ["中午", "鰻魚飯三吃", "熱田神宮周邊有知名老店，用餐時段常要排隊，可早點去。"],
        ["下午", "大須觀音・大須商店街", "古著、電器、小吃混在一起的熱鬧商店街，邊走邊吃。"],
        ["晚上", "味噌豬排或台灣拉麵", "體驗名古屋獨特的重口味。"],
      ],
    },
    {
      title: "犬山一日遊", theme: "國寶天守",
      stops: [
        ["上午", "名古屋 → 犬山", "搭名鐵約 30 分鐘到犬山站。"],
        ["中午", "犬山城", "日本現存最古老的天守之一，登上頂樓可眺望木曾川。"],
        ["下午", "城下町", "老街上有串燒、田樂與和菓子，適合邊走邊吃。"],
        ["傍晚", "明治村（選擇）", "從犬山站搭巴士約 20 分鐘，保存明治時期建築的戶外博物館；也可改在城下町慢逛。"],
      ],
    },
    {
      title: "高山・白川鄉", theme: "合掌村與古街",
      stops: [
        ["早上", "名古屋 → 高山", "搭 JR 特急 Hida 約 2.5 小時，沿途溪谷景色很美。"],
        ["中午", "高山古街・飛驒牛", "三町古街保存江戶風情，飛驒牛握壽司、串燒不能錯過。"],
        ["下午", "白川鄉", "從高山搭巴士約 50 分鐘；到城山展望台俯瞰合掌村。"],
        ["提醒", "住一晚更從容", "一日往返很趕，建議在高山住一晚，或參加名古屋出發的巴士一日遊。"],
      ],
    },
    {
      title: "名古屋港或吉卜力公園・回程", theme: "二選一再出發",
      stops: [
        ["上午", "選擇 A：吉卜力公園", "位於長久手的愛・地球博紀念公園內，門票需事先預約購買。"],
        ["上午", "選擇 B：名古屋港", "名古屋港水族館或樂高樂園，親子旅行特別推薦。"],
        ["下午", "名古屋站採買", "車站百貨與地下街可買蝦餅、小倉吐司抹醬等伴手禮。"],
        ["傍晚", "前往機場", "國際線建議起飛前 2–3 小時抵達中部國際機場。"],
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

  /* ---------- 03 區域指南（依興趣篩選） ---------- */
  const areas = [
    { name: "名古屋站周邊", tags: ["購物", "美食"], access: "中部國際機場名鐵約 30 分", desc: "百貨與地下街連成一片，交通與住宿最方便。" },
    { name: "榮・大須", tags: ["購物", "美食"], access: "名古屋站地下鐵約 5–10 分", desc: "榮是百貨與時尚中心，大須商店街則充滿庶民小吃。" },
    { name: "名古屋城", tags: ["歷史"], access: "地下鐵名城線名古屋城站", desc: "金鯱是名古屋的象徵，本丸御殿的障壁畫華麗精緻。" },
    { name: "熱田神宮", tags: ["歷史"], access: "名鐵神宮前站・地下鐵神宮西站", desc: "歷史悠久的神社，周邊是鰻魚飯三吃的名店集中地。" },
    { name: "豐田產業技術紀念館", tags: ["歷史"], access: "名鐵榮生站步行約 3 分", desc: "從紡織機到汽車，認識豐田的技術發展史，大人小孩都好逛。" },
    { name: "名古屋港", tags: ["樂園"], access: "地下鐵名古屋港站", desc: "名古屋港水族館有海豚表演與白鯨；金城碼頭一帶有樂高樂園。" },
    { name: "吉卜力公園", tags: ["樂園", "自然"], access: "Linimo 愛・地球博紀念公園站", desc: "在公園自然環境中重現動畫場景，門票需事先預約。" },
    { name: "長島", tags: ["樂園", "購物"], access: "名古屋站巴士約 50 分", desc: "大型遊樂園、Outlet 與冬季燈光秀「花之饗宴」。" },
    { name: "犬山", tags: ["歷史", "美食"], access: "名鐵約 30 分", desc: "國寶犬山城與城下町老街，近郊還有明治村。" },
    { name: "常滑", tags: ["歷史"], access: "名鐵往機場途中", desc: "陶器之鄉，土管坂與陶藝散步道很好拍，可排在出入境前後。" },
    { name: "岐阜・長良川", tags: ["歷史", "自然"], access: "名鐵或 JR 約 20–30 分", desc: "5–10 月可看傳統鵜飼，山頂的岐阜城可眺望濃尾平原。" },
    { name: "香嵐溪", tags: ["自然"], access: "名古屋開車約 1.5 小時", desc: "愛知縣代表的紅葉名所，11 月滿山楓紅並有夜間點燈。" },
    { name: "高山", tags: ["歷史", "美食"], access: "JR 特急 Hida 約 2.5 小時", desc: "被稱為「飛驒小京都」的古街，早市與飛驒牛很有名。" },
    { name: "白川鄉", tags: ["歷史", "自然"], access: "高山巴士約 50 分", desc: "世界遺產合掌造聚落，四季景色各異，冬季雪景最夢幻。" },
    { name: "伊勢神宮", tags: ["歷史", "美食"], access: "近鐵特急約 1 小時 20 分", desc: "日本神社的本宗，參拜後到托福橫丁吃赤福與伊勢烏龍麵。" },
  ];
  const areaTags = ["全部", "歷史", "美食", "購物", "自然", "樂園"];
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
      item.append(top, element("p", "card-description", area.desc), element("p", "card-meta", `🚉 ${area.access}`));
      const photo = window.tripPhoto?.("nagoya", area.name);
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
})();
