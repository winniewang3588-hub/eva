(() => {
  "use strict";

  // 所有內容都以 textContent 呈現，不將文字解析為 HTML。
  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  /* ---------- 01 六天路線 ---------- */
  const days = [
    {
      title: "福岡市區", theme: "博多與屋台",
      stops: [
        ["上午", "福岡機場 → 博多", "機場離市區很近，先到飯店寄放行李。"],
        ["中午", "櫛田神社・博多運河城", "博多總鎮守，境內可看到祇園山笠的裝飾山車。"],
        ["下午", "天神・大濠公園", "天神逛街購物，再到大濠公園的湖邊散步。"],
        ["晚上", "中洲屋台", "河岸邊一整排屋台，點碗拉麵、幾串烤物，感受博多夜晚。"],
      ],
    },
    {
      title: "太宰府・柳川", theme: "學問之神與水鄉",
      stops: [
        ["上午", "太宰府天滿宮", "從天神搭西鐵約 30–40 分鐘；參道上的梅枝餅一定要吃。"],
        ["中午", "西鐵前往柳川", "可購買太宰府、柳川的西鐵套票，交通加遊船更划算。"],
        ["下午", "柳川遊船", "船夫撐篙穿梭水道，約 1 小時；冬季船上有暖桌。"],
        ["晚上", "鰻魚蒸籠飯", "柳川名物，吃完搭西鐵回福岡。"],
      ],
    },
    {
      title: "由布院", theme: "溫泉小鎮",
      stops: [
        ["上午", "博多 → 由布院", "搭 JR 特急約 2 小時多，觀光列車「由布院之森」需提早劃位；也可搭高速巴士。"],
        ["中午", "湯之坪街道", "甜點、雜貨小店林立，邊走邊吃。"],
        ["下午", "金鱗湖", "湖底湧出溫泉，冬天清晨湖面會起霧。"],
        ["晚上", "溫泉旅館", "建議住一晚，享受晚餐與露天溫泉。"],
      ],
    },
    {
      title: "別府 → 博多", theme: "地獄巡禮",
      stops: [
        ["上午", "由布院 → 別府", "搭巴士約 1 小時，翻過山就是海邊溫泉城市。"],
        ["中午", "別府地獄巡禮", "海地獄的鈷藍色、血池地獄的赤紅色，順便吃地獄蒸料理。"],
        ["下午", "溫泉體驗", "可試試砂湯或泥湯，體驗不同的別府溫泉。"],
        ["晚上", "返回博多", "搭 JR 特急約 2 小時回博多。"],
      ],
    },
    {
      title: "熊本一日遊", theme: "城與熊本熊",
      stops: [
        ["上午", "博多 → 熊本", "搭九州新幹線約 35–50 分鐘。"],
        ["中午", "熊本城", "震災後重建的天守閣已重新開放，部分區域仍在修復中。"],
        ["下午", "櫻之馬場城彩苑・熊本熊廣場", "品嘗當地小吃，看熊本熊（出場時間依官方公告）。"],
        ["晚上", "熊本拉麵・馬肉", "蒜油香氣的熊本拉麵，敢嘗鮮可以試試馬肉刺身，再搭新幹線回博多。"],
      ],
    },
    {
      title: "福岡採買・回程", theme: "滿載而歸",
      stops: [
        ["上午", "博多站周邊", "車站大樓與阪急百貨，明太子、博多通りもん等伴手禮一次買齊。"],
        ["中午", "最後一碗豚骨拉麵", "博多站周邊拉麵店多，吃完取行李出發。"],
        ["下午", "福岡機場", "國際線建議起飛前 2–3 小時抵達。"],
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
    { name: "福岡・博多", tags: ["美食"], access: "福岡機場地下鐵約 5 分", desc: "九州最大城市，豚骨拉麵、牛腸鍋與屋台，購物也方便。" },
    { name: "太宰府", tags: ["歷史"], access: "天神西鐵約 30–40 分", desc: "供奉學問之神的天滿宮，參道商店街熱鬧好逛。" },
    { name: "柳川", tags: ["歷史", "自然"], access: "天神西鐵特急約 50 分", desc: "水路縱橫的城下町，搭遊船慢慢欣賞水鄉風景。" },
    { name: "由布院", tags: ["溫泉"], access: "博多 JR 特急約 2 小時多", desc: "群山環繞的溫泉小鎮，湯之坪街道與金鱗湖。" },
    { name: "別府", tags: ["溫泉"], access: "博多 JR 特急約 2 小時", desc: "溫泉湧出量日本第一，地獄巡禮與砂湯體驗。" },
    { name: "黑川溫泉", tags: ["溫泉", "自然"], access: "博多高速巴士約 2.5 小時", desc: "山谷裡的溫泉街，買「入湯手形」可泡多家露天風呂。" },
    { name: "熊本", tags: ["歷史", "美食"], access: "博多新幹線約 35–50 分", desc: "日本三大名城之一的熊本城，還有熊本熊與馬肉料理。" },
    { name: "阿蘇", tags: ["自然"], access: "熊本 JR 約 1–1.5 小時", desc: "世界級的巨大火山口與草千里草原，自駕最方便。" },
    { name: "高千穗", tags: ["自然", "歷史"], access: "熊本開車約 2.5 小時", desc: "神話之鄉，高千穗峽划船穿過瀑布與峭壁。" },
    { name: "長崎", tags: ["歷史", "美食"], access: "博多新幹線轉乘約 1.5 小時", desc: "港町異國風情、稻佐山夜景、原爆資料館與強棒麵。" },
    { name: "豪斯登堡", tags: ["樂園"], access: "博多 JR 特急約 1 小時 50 分", desc: "重現荷蘭街景的大型主題園區，夜間燈光秀很受歡迎。" },
    { name: "鹿兒島・櫻島", tags: ["自然", "美食"], access: "博多新幹線最快約 1.5 小時", desc: "對岸就是活火山櫻島，搭渡輪約 15 分鐘；黑豬肉必吃。" },
    { name: "指宿", tags: ["溫泉"], access: "鹿兒島中央 JR 約 1 小時", desc: "躺在海邊熱砂裡的砂蒸溫泉，獨特又放鬆。" },
    { name: "屋久島", tags: ["自然"], access: "鹿兒島高速船約 2–3 小時", desc: "世界自然遺產，千年屋久杉與白谷雲水峽的苔蘚森林。" },
  ];
  const areaTags = ["全部", "溫泉", "美食", "歷史", "自然", "樂園"];
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
      const photo = window.tripPhoto?.("kyushu", area.name);
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
