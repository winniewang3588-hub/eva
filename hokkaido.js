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
      title: "抵達・札幌市區", theme: "城市初體驗",
      stops: [
        ["中午", "新千歲機場", "搭 JR 快速 Airport 約 40 分鐘到札幌站，先到飯店寄放行李。"],
        ["下午", "大通公園・札幌電視塔", "公園橫跨市中心，冬天是雪祭主會場；附近的札幌市時計台也可順路看看。"],
        ["傍晚", "狸小路商店街", "有屋頂的長商店街，藥妝、伴手禮一次買。"],
        ["晚上", "薄野", "吃味噌拉麵或成吉思汗烤肉，感受札幌的夜晚。"],
      ],
    },
    {
      title: "小樽一日遊", theme: "運河與玻璃",
      stops: [
        ["上午", "前往小樽", "從札幌搭 JR 約 35–50 分鐘，沿途可看到海岸線。"],
        ["中午", "堺町通", "北一硝子、音樂盒堂與甜點店集中，順便吃海鮮丼當午餐。"],
        ["下午", "小樽運河", "沿著石造倉庫散步；冬天 2 月有雪燈之路活動。"],
        ["傍晚", "運河夜景", "瓦斯燈亮起後最有氣氛，看完再搭 JR 回札幌。"],
      ],
    },
    {
      title: "旭川・旭山動物園", theme: "北國動物",
      stops: [
        ["上午", "札幌 → 旭川", "搭 JR 特急約 1.5 小時，行李可寄放在旭川的飯店或車站置物櫃。"],
        ["中午", "旭山動物園", "以行動展示聞名，可近距離看北極熊、海豹；冬季有企鵝散步（依園方公告）。"],
        ["晚上", "旭川拉麵", "醬油湯頭加一層豬油保溫，是寒冷城市的味道。"],
      ],
    },
    {
      title: "美瑛丘陵", theme: "拼布般的風景",
      stops: [
        ["上午", "青池・白鬚瀑布", "藍色池水隨天氣變化，冬季夜間可能有點燈活動。"],
        ["中午", "拼布之路・超廣角之路", "起伏丘陵與花田，請只在道路或指定區拍照，不要進入農地。"],
        ["下午", "四季彩之丘", "大片花田，夏季最繽紛。"],
        ["提醒", "交通", "景點分散，建議自駕或報名當地觀光巴士；騎單車需留意坡道多。"],
      ],
    },
    {
      title: "富良野 → 回札幌", theme: "薰衣草季",
      stops: [
        ["上午", "富田農場", "7 月中旬前後薰衣草最盛，其他月份也有不同花卉。"],
        ["中午", "富良野起司工房・哈密瓜", "夏季的富良野哈密瓜很有名。"],
        ["下午", "森林精靈露台", "森林裡的小木屋手作商店，傍晚點燈後很漂亮。"],
        ["晚上", "返回札幌", "可從富良野或旭川搭 JR 回札幌，或還車後再搭車。"],
      ],
    },
    {
      title: "札幌採買・回程", theme: "滿載而歸",
      stops: [
        ["早上", "二條市場", "早上的海鮮丼最新鮮，也可買螃蟹宅配（依店家規定）。"],
        ["上午", "白色戀人公園", "巧克力工廠與歐風庭園，適合買伴手禮。"],
        ["下午", "新千歲機場", "建議起飛前 3 小時抵達，機場的拉麵道場和購物區很好逛。"],
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

  /* ---------- 03 區域指南（依季節篩選） ---------- */
  const areas = [
    { name: "札幌", seasons: ["春", "夏", "秋", "冬"], access: "新千歲機場 JR 約 40 分", desc: "北海道最大城市，美食、購物集中，2 月雪祭是冬季重頭戲。" },
    { name: "小樽", seasons: ["春", "夏", "秋", "冬"], access: "札幌 JR 約 35–50 分", desc: "運河、石造倉庫與玻璃工藝，雪夜的運河特別浪漫。" },
    { name: "函館", seasons: ["春", "夏", "秋", "冬"], access: "札幌 JR 特急約 3.5–4 小時", desc: "函館山夜景、五稜郭與朝市，西洋風坡道街景。" },
    { name: "旭川", seasons: ["春", "夏", "秋", "冬"], access: "札幌 JR 特急約 1.5 小時", desc: "旭山動物園與旭川拉麵，也是前往美瑛、富良野的據點。" },
    { name: "美瑛", seasons: ["夏", "秋", "冬"], access: "旭川 JR 約 30 分", desc: "青池與丘陵花田，冬天的雪原與孤樹也很有味道。" },
    { name: "富良野", seasons: ["夏", "冬"], access: "旭川 JR 約 1 小時多", desc: "夏季薰衣草花田聞名，冬季則是滑雪勝地。" },
    { name: "登別", seasons: ["春", "夏", "秋", "冬"], access: "札幌 JR 特急約 1 小時多", desc: "地獄谷的硫磺噴氣地景，溫泉種類豐富。" },
    { name: "洞爺湖", seasons: ["春", "夏", "秋"], access: "札幌 JR 特急約 2 小時", desc: "火山湖與昭和新山，夏季夜晚湖上常有煙火。" },
    { name: "二世古", seasons: ["夏", "冬"], access: "札幌開車約 2 小時", desc: "世界級粉雪滑雪場；夏天可泛舟、健行。" },
    { name: "知床", seasons: ["夏", "冬"], access: "女滿別機場開車約 2 小時", desc: "世界自然遺產，夏季搭船看棕熊海岸，冬季有流冰。" },
    { name: "釧路", seasons: ["夏", "秋", "冬"], access: "釧路機場或札幌 JR 特急約 4 小時", desc: "日本最大的釧路濕原，冬天可看丹頂鶴。" },
  ];
  const seasonTags = ["全部", "春", "夏", "秋", "冬"];
  const areaFilters = document.querySelector("#area-filters");
  const areaList = document.querySelector("#area-list");
  const areaMessage = document.querySelector("#area-message");
  let selectedSeason = "全部";

  function renderAreas() {
    [...areaFilters.children].forEach(button => {
      button.setAttribute("aria-pressed", String(button.dataset.tag === selectedSeason));
    });
    const visible = selectedSeason === "全部"
      ? areas : areas.filter(area => area.seasons.includes(selectedSeason));
    areaList.replaceChildren(...visible.map(area => {
      const item = element("li", "area-card");
      const top = element("div", "card-top");
      top.append(element("h3", "", area.name), element("span", "card-tags", `適合：${area.seasons.join("・")}`));
      item.append(top, element("p", "card-description", area.desc), element("p", "card-meta", `🚉 ${area.access}`));
      const photo = window.tripPhoto?.("hokkaido", area.name);
      if (photo) { item.prepend(photo); item.classList.add("has-photo"); }
      return item;
    }));
    areaMessage.textContent = selectedSeason === "全部"
      ? `共 ${visible.length} 個區域`
      : `${selectedSeason}季推薦：${visible.length} 個區域`;
  }

  seasonTags.forEach(tag => {
    const button = element("button", "filter-button", tag === "全部" ? tag : `${tag}季`);
    button.type = "button";
    button.dataset.tag = tag;
    button.addEventListener("click", () => { selectedSeason = tag; renderAreas(); });
    areaFilters.append(button);
  });
  renderAreas();
})();
