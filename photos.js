(() => {
  "use strict";

  // 景點照片皆來自 Wikimedia Commons 的自由授權檔案，顯示時須標示作者、授權與來源。
  // 鍵值為「地區/區域名稱」，沒有照片的區域不顯示圖片。
  const photos = Object.freeze({
    "hokkaido/洞爺湖": {
      "src": "./images/hokkaido/toya.webp",
      "w": 640,
      "h": 427,
      "alt": "從高處眺望洞爺湖與湖中島",
      "artist": "663highland",
      "license": "CC BY 2.5",
      "page": "https://commons.wikimedia.org/wiki/File:130922_Lake_Toya_Toyako_Hokkaido_Japan03s3.jpg"
    },
    "kyushu/太宰府": {
      "src": "./images/kyushu/dazaifu.webp",
      "w": 640,
      "h": 426,
      "alt": "太宰府天滿宮本殿",
      "artist": "Jakub Hałun",
      "license": "CC BY-SA 4.0",
      "page": "https://commons.wikimedia.org/wiki/File:20100719_Dazaifu_Tenmangu_Shrine_3328.jpg"
    },
    "kyushu/阿蘇": {
      "src": "./images/kyushu/aso.webp",
      "w": 640,
      "h": 467,
      "alt": "阿蘇火山口一帶鳥瞰",
      "artist": "Sonata",
      "license": "CC BY-SA 3.0",
      "page": "https://commons.wikimedia.org/wiki/File:20140516%E9%98%BF%E8%98%87%E5%B1%B1%E5%BA%83%E5%9F%9F.jpg"
    },
    "tokyo/澀谷": {
      "src": "./images/tokyo/shibuya.webp",
      "w": 640,
      "h": 411,
      "alt": "澀谷車站前的十字路口",
      "artist": "Kakidai",
      "license": "CC BY-SA 4.0",
      "page": "https://commons.wikimedia.org/wiki/File:2018_Shibuya_Crossing.jpg"
    },
    "tokyo/築地・豐洲": {
      "src": "./images/tokyo/tsukiji.webp",
      "w": 640,
      "h": 411,
      "alt": "築地一帶鳥瞰（2018 年）",
      "artist": "Kakidai",
      "license": "CC BY-SA 4.0",
      "page": "https://commons.wikimedia.org/wiki/File:2018_Tsukiji_fish_market.jpg"
    },
    "hokkaido/旭川": {
      "src": "./images/hokkaido/asahikawa.webp",
      "w": 640,
      "h": 480,
      "alt": "旭山動物園入口",
      "artist": "欅 (Keyaki)",
      "license": "CC BY-SA 3.0",
      "page": "https://commons.wikimedia.org/wiki/File:Asahiyama_zoo_entrance.jpg"
    },
    "tokyo/淺草": {
      "src": "./images/tokyo/asakusa.webp",
      "w": 640,
      "h": 425,
      "alt": "淺草寺本堂與五重塔",
      "artist": "Asturio Cantabrio",
      "license": "CC BY-SA 4.0",
      "page": "https://commons.wikimedia.org/wiki/File:Asakusa_Senso-ji_2021-12_ac_(2).jpg"
    },
    "kyushu/別府": {
      "src": "./images/kyushu/beppu.webp",
      "w": 640,
      "h": 960,
      "alt": "別府血池地獄的紅色泉水",
      "artist": "663highland",
      "license": "CC BY 2.5",
      "page": "https://commons.wikimedia.org/wiki/File:Beppu_Chinoike-jigoku03n3200.jpg"
    },
    "hokkaido/美瑛": {
      "src": "./images/hokkaido/biei.webp",
      "w": 640,
      "h": 427,
      "alt": "美瑛青池與水中的枯樹",
      "artist": "MaedaAkihiko",
      "license": "CC BY-SA 4.0",
      "page": "https://commons.wikimedia.org/wiki/File:Biei_Blue-pond.jpg"
    },
    "kyushu/柳川": {
      "src": "./images/kyushu/yanagawa.webp",
      "w": 640,
      "h": 427,
      "alt": "柳川的撐篙遊船",
      "artist": "663highland",
      "license": "CC BY 2.5",
      "page": "https://commons.wikimedia.org/wiki/File:Fukuoka_Yanagawa03bs3200.jpg"
    },
    "kyushu/豪斯登堡": {
      "src": "./images/kyushu/huis-ten-bosch.webp",
      "w": 640,
      "h": 480,
      "alt": "豪斯登堡的荷蘭風格街景",
      "artist": "JKT-c",
      "license": "CC BY 3.0",
      "page": "https://commons.wikimedia.org/wiki/File:Huis_Ten_Bosch_-_01.jpg"
    },
    "kyushu/指宿": {
      "src": "./images/kyushu/ibusuki.webp",
      "w": 640,
      "h": 480,
      "alt": "指宿砂蒸溫泉的工作人員鋪砂",
      "artist": "Trinida",
      "license": "CC BY 3.0",
      "page": "https://commons.wikimedia.org/wiki/File:Ibusuki.jpg"
    },
    "tokyo/池袋": {
      "src": "./images/tokyo/ikebukuro.webp",
      "w": 640,
      "h": 427,
      "alt": "池袋高樓街景",
      "artist": "Komont",
      "license": "Public domain",
      "page": "https://commons.wikimedia.org/wiki/File:Ikebukuro2007.jpg"
    },
    "kyushu/熊本": {
      "src": "./images/kyushu/kumamoto.webp",
      "w": 640,
      "h": 427,
      "alt": "熊本城天守閣",
      "artist": "Suicasmo",
      "license": "CC BY-SA 4.0",
      "page": "https://commons.wikimedia.org/wiki/File:Kumamoto_Castle_Keep_Tower_20221022-3.jpg"
    },
    "kyushu/黑川溫泉": {
      "src": "./images/kyushu/kurokawa.webp",
      "w": 640,
      "h": 428,
      "alt": "黑川溫泉街與木造旅館",
      "artist": "hiroooooki",
      "license": "CC BY 2.0",
      "page": "https://commons.wikimedia.org/wiki/File:Kurokawa_Onsen_-%E6%B8%A9%E6%B3%89%E8%A1%97.jpg"
    },
    "kyushu/由布院": {
      "src": "./images/kyushu/yufuin.webp",
      "w": 640,
      "h": 480,
      "alt": "由布院金鱗湖",
      "artist": "Reggaeman",
      "license": "CC BY-SA 3.0",
      "page": "https://commons.wikimedia.org/wiki/File:Lake_Kinrin.JPG"
    },
    "tokyo/吉祥寺": {
      "src": "./images/tokyo/kichijoji.webp",
      "w": 640,
      "h": 427,
      "alt": "春天櫻花盛開的井之頭恩賜公園",
      "artist": "京浜にけ",
      "license": "CC BY-SA 3.0",
      "page": "https://commons.wikimedia.org/wiki/File:Mitaka_Inokashira_Park_In_Spring_1.JPG"
    },
    "kyushu/長崎": {
      "src": "./images/kyushu/nagasaki.webp",
      "w": 640,
      "h": 427,
      "alt": "從長崎港眺望稻佐山",
      "artist": "ぱちょぴ",
      "license": "CC BY-SA 3.0",
      "page": "https://commons.wikimedia.org/wiki/File:Mt.Inasa_2010.jpg"
    },
    "nagoya/長島": {
      "src": "./images/nagoya/nagashima.webp",
      "w": 640,
      "h": 429,
      "alt": "長島溫泉樂園鳥瞰",
      "artist": "Hideyuki KAMON",
      "license": "CC BY-SA 2.0",
      "page": "https://commons.wikimedia.org/wiki/File:Nagashima_spa_land_skyview.jpg"
    },
    "nagoya/榮・大須": {
      "src": "./images/nagoya/sakae.webp",
      "w": 640,
      "h": 427,
      "alt": "名古屋電視塔與綠洲 21",
      "artist": "Tomio344456",
      "license": "CC BY-SA 4.0",
      "page": "https://commons.wikimedia.org/wiki/File:Nagoya_TV_Tower_%26_Spaceship-Aqua,_Higashisakura_Higashi_Ward_Nagoya_2020.jpg"
    },
    "nagoya/伊勢神宮": {
      "src": "./images/nagoya/ise.webp",
      "w": 640,
      "h": 425,
      "alt": "伊勢神宮的鳥居與社殿",
      "artist": "Ocdp",
      "license": "CC0",
      "page": "https://commons.wikimedia.org/wiki/File:Naiku_001.jpg"
    },
    "kyushu/福岡・博多": {
      "src": "./images/kyushu/fukuoka.webp",
      "w": 640,
      "h": 435,
      "alt": "福岡中洲河岸街景",
      "artist": "STA3816",
      "license": "CC BY-SA 3.0",
      "page": "https://commons.wikimedia.org/wiki/File:Nakasu02.jpg"
    },
    "hokkaido/小樽": {
      "src": "./images/hokkaido/otaru.webp",
      "w": 640,
      "h": 427,
      "alt": "傍晚的小樽運河與石造倉庫",
      "artist": "Chi ing（Flickr）",
      "license": "CC BY 2.0",
      "page": "https://commons.wikimedia.org/wiki/File:Otaru_Hokkaido_Japan.jpg"
    },
    "hokkaido/札幌": {
      "src": "./images/hokkaido/sapporo.webp",
      "w": 640,
      "h": 853,
      "alt": "札幌電視塔",
      "artist": "欅 (Keyaki)",
      "license": "CC BY-SA 3.0",
      "page": "https://commons.wikimedia.org/wiki/File:Sapporo_television_tower_01.jpg"
    },
    "kyushu/高千穗": {
      "src": "./images/kyushu/takachiho.webp",
      "w": 640,
      "h": 451,
      "alt": "高千穗峽的峭壁與划船",
      "artist": "TANAKA Juuyoh (田中十洋)",
      "license": "CC BY 2.0",
      "page": "https://commons.wikimedia.org/wiki/File:Takachiho-kyo(Gorge)_-_River_-_%E5%B7%9D.jpg"
    },
    "tokyo/原宿・表參道": {
      "src": "./images/tokyo/harajuku.webp",
      "w": 640,
      "h": 853,
      "alt": "人潮擁擠的竹下通入口",
      "artist": "Intforce",
      "license": "CC BY-SA 4.0",
      "page": "https://commons.wikimedia.org/wiki/File:Takeshita_Street_in_December_2018.jpg"
    },
    "tokyo/台場": {
      "src": "./images/tokyo/odaiba.webp",
      "w": 640,
      "h": 427,
      "alt": "台場一帶鳥瞰",
      "artist": "MaedaAkihiko",
      "license": "CC BY-SA 4.0",
      "page": "https://commons.wikimedia.org/wiki/File:Tokyo-Odaiba.jpg"
    },
    "nagoya/豐田產業技術紀念館": {
      "src": "./images/nagoya/toyota-museum.webp",
      "w": 640,
      "h": 426,
      "alt": "豐田產業技術紀念館紅磚外觀",
      "artist": "Bariston",
      "license": "CC BY-SA 4.0",
      "page": "https://commons.wikimedia.org/wiki/File:Toyota_tecno_museum.jpg"
    },
    "hokkaido/函館": {
      "src": "./images/hokkaido/hakodate.webp",
      "w": 640,
      "h": 360,
      "alt": "從海邊眺望函館山",
      "artist": "掬茶",
      "license": "CC BY-SA 4.0",
      "page": "https://commons.wikimedia.org/wiki/File:Wide_view_of_Mount_Hakodate_from_Mashu-Maru.jpg"
    },
    "hokkaido/二世古": {
      "src": "./images/hokkaido/niseko.webp",
      "w": 640,
      "h": 480,
      "alt": "冬季白雪覆蓋的二世古山景",
      "artist": "Wakimasa",
      "license": "CC BY-SA 3.0",
      "page": "https://commons.wikimedia.org/wiki/File:%E3%83%8B%E3%82%BB%E3%82%B3%E6%9D%B1%E5%B1%B1%E3%82%B9%E3%82%AD%E3%83%BC%E5%A0%B42.JPG"
    },
    "tokyo/秋葉原": {
      "src": "./images/tokyo/akihabara.webp",
      "w": 640,
      "h": 429,
      "alt": "清晨的秋葉原電器街",
      "artist": "おいしい水（濃縮還元）",
      "license": "CC BY-SA 3.0",
      "page": "https://commons.wikimedia.org/wiki/File:%E9%9B%BB%E6%B0%97%E8%A1%97%E3%81%AE%E5%A4%9C%E6%98%8E%E3%81%91_-_panoramio.jpg"
    },
    "nagoya/高山": {
      "src": "./images/nagoya/takayama.webp",
      "w": 640,
      "h": 427,
      "alt": "高山三町古街的木造老屋",
      "artist": "663highland",
      "license": "CC BY-SA 4.0",
      "page": "https://commons.wikimedia.org/wiki/File:260923_Sanmachi_Takayama_Japan03s3.jpg"
    },
    "nagoya/熱田神宮": {
      "src": "./images/nagoya/atsuta.webp",
      "w": 640,
      "h": 427,
      "alt": "熱田神宮拜殿",
      "artist": "Tomio344456",
      "license": "CC BY-SA 4.0",
      "page": "https://commons.wikimedia.org/wiki/File:Atsuta-jingu_Shrine_Haiden,_Jingu_Atsuta_Ward_Nagoya_2023.jpg"
    },
    "nagoya/岐阜・長良川": {
      "src": "./images/nagoya/nagara.webp",
      "w": 640,
      "h": 427,
      "alt": "長良川夜間的鵜飼漁船與篝火",
      "artist": "Ludger Heide",
      "license": "CC BY-SA 4.0",
      "page": "https://commons.wikimedia.org/wiki/File:Cormorant_fishing_on_the_Nagara_River_-_Jul_7,_2025.jpg"
    },
    "nagoya/犬山": {
      "src": "./images/nagoya/inuyama.webp",
      "w": 640,
      "h": 427,
      "alt": "櫻花季的犬山城",
      "artist": "Tomio344456",
      "license": "CC BY-SA 4.0",
      "page": "https://commons.wikimedia.org/wiki/File:Inuyama_Castle_(1),_Kitakoken_Inuyama_Inuyama_City_2023.jpg"
    },
    "nagoya/香嵐溪": {
      "src": "./images/nagoya/korankei.webp",
      "w": 640,
      "h": 427,
      "alt": "香嵐溪的紅葉與待月橋",
      "artist": "Bariston",
      "license": "CC BY-SA 4.0",
      "page": "https://commons.wikimedia.org/wiki/File:K%C5%8Drankei.jpg"
    },
    "nagoya/名古屋城": {
      "src": "./images/nagoya/nagoya-castle.webp",
      "w": 640,
      "h": 426,
      "alt": "名古屋城天守與金鯱",
      "artist": "Bariston",
      "license": "CC BY-SA 4.0",
      "page": "https://commons.wikimedia.org/wiki/File:Nagoya_Castle_7.jpg"
    },
    "nagoya/名古屋港": {
      "src": "./images/nagoya/nagoya-port.webp",
      "w": 640,
      "h": 427,
      "alt": "名古屋港水族館與港區",
      "artist": "Bariston",
      "license": "CC BY-SA 4.0",
      "page": "https://commons.wikimedia.org/wiki/File:Port_of_Nagoya_Public_Aquarium1.jpg"
    },
    "nagoya/白川鄉": {
      "src": "./images/nagoya/shirakawago.webp",
      "w": 640,
      "h": 423,
      "alt": "白川鄉合掌造聚落全景",
      "artist": "Alpsdake",
      "license": "CC BY-SA 4.0",
      "page": "https://commons.wikimedia.org/wiki/File:Shirakawa-go_(2017-07-22).jpg"
    },
    "nagoya/名古屋站周邊": {
      "src": "./images/nagoya/nagoya-station.webp",
      "w": 640,
      "h": 427,
      "alt": "名古屋站與周邊高樓",
      "artist": "Tomio344456",
      "license": "CC BY-SA 4.0",
      "page": "https://commons.wikimedia.org/wiki/File:View_of_Nagoya_Station,_Tsubaki-cho_Nakamura_Ward_Nagoya_2022.jpg"
    },
    "nagoya/常滑": {
      "src": "./images/nagoya/tokoname.webp",
      "w": 640,
      "h": 427,
      "alt": "常滑陶藝散步道的土管坂",
      "artist": "Bariston",
      "license": "CC BY-SA 4.0",
      "page": "https://commons.wikimedia.org/wiki/File:Yakimonosanpomichi1.JPG"
    }
  });

  function credit(photo) {
    const caption = document.createElement("figcaption");
    caption.append(`照片：${photo.artist}／${photo.license}　`);
    const link = document.createElement("a");
    link.href = photo.page;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "來源";
    caption.append(link);
    return caption;
  }

  // 傳回含照片與出處的 <figure>；沒有照片時傳回 null。
  window.tripPhoto = (region, name) => {
    const photo = photos[`${region}/${name}`];
    if (!photo) return null;
    const figure = document.createElement("figure");
    figure.className = "area-photo";
    const img = document.createElement("img");
    img.src = photo.src;
    img.alt = photo.alt;
    img.width = photo.w;
    img.height = photo.h;
    img.loading = "lazy";
    img.decoding = "async";
    figure.append(img, credit(photo));
    return figure;
  };
})();
