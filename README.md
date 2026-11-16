# 東京自由行指南

給第一次去東京自由行的人使用的靜態網站：五天行程範例、區域指南、交通攻略、預算試算、行前清單與在地小提醒。純 HTML、CSS、JavaScript，無建置步驟、無資料庫，可直接以 GitHub Pages 發布，並可安裝成 PWA 離線查看。

## 功能

- **五天經典行程**：Day 1–5 分頁切換（支援方向鍵、Home／End），每天以時間軸列出景點與提醒。
- **區域指南**：12 個區域，可依「美食／購物／文化／夜景／自然」篩選。
- **交通攻略**：成田、羽田進市區方式，IC 卡與地鐵券說明，搭車小訣竅。
- **預算試算**：輸入天數、人數、機票、住宿、餐飲、交通、門票購物與匯率，即時算出日圓花費、全程總計與每人平均。住宿以「天數 − 1」晚計算；匯率需自行輸入最新值，網站不連線查詢匯率。
- **行前清單**：勾選紀錄只存在該裝置瀏覽器的 localStorage（鍵名 `tokyo-trip-checklist:v1`），不會上傳。
- 內容僅供參考；票價、時刻、營業時間與入境／免稅規定請以官方公告為準。

## 本機預覽

在儲存庫根目錄執行 `python3 -m http.server 8000`，再以瀏覽器開啟 `http://localhost:8000/`。不需要任何外部 CDN 或 API。

## GitHub Pages

合併至 `main` 後，在 GitHub 的 **Settings → Pages → Build and deployment** 選擇 **Deploy from a branch**，分支選 `main`，資料夾選 **/ (root)**。所有資源皆使用相對路徑，適用專案子目錄。

預期網址：<https://winniewang3588-hub.github.io/eva/>。實際可用狀態以 GitHub Pages 部署結果為準。

## PWA：安裝到主畫面與離線瀏覽

- 使用 `manifest.webmanifest`、`sw.js`、`pwa.js` 與 `icons/`，支援 `/eva/` 子路徑。
- 以 HTTPS（正式網站）或 localhost（開發）開啟一次後，Service Worker 會快取整個介面；之後離線（例如在日本沒網路時）也能開啟並使用所有功能。`file://` 不支援。
- Android Chrome／Edge 符合條件時會出現「安裝到主畫面」按鈕；iPhone／iPad 請用 Safari「分享 → 加入主畫面」。
- 有新版本時顯示「更新指南」，不會自動重新載入。每次變更介面或快取清單都必須遞增 `sw.js` 的 `CACHE_NAME` 版本。
- 本網址先前是報修登記 PWA；新版 Service Worker 啟用時會清除舊的 `repair-pwa:` 快取。舊使用者需按一次「更新」才會換成新版。

## 舊專案檔案

`文件/`、`supabase/schema.sql` 與 `報修需求筆記.txt` 為先前報修登記系統的交付文件，目前網站不再使用，保留作為紀錄。

## 驗證

- `node --check app.js`、`node --check pwa.js`、`node --check sw.js`：語法檢查。
- `git diff --check`：差異空白檢查。
- 已用 Chromium 與 Playwright 在 390px／1280px 檢查版面無水平捲動；測試行程分頁（點擊與鍵盤）、區域篩選、預算計算與錯誤輸入提示、清單勾選重新整理後保留與重設。
- 以真正的 Service Worker 驗證根目錄 `/` 與子路徑 `/eva/` 的快取與離線重開，以及舊 `repair-pwa:` 快取清除、不影響其他快取。手機原生安裝仍需在實機確認。
