# 專案協作指引

## 專案現況

報修登記示範系統，採純 HTML、CSS、JavaScript；首頁為根目錄 `index.html`，可直接以 GitHub Pages 發布，無建置步驟。`app.js` 透過 CDN 的 supabase-js v2 存取 Supabase；`config.js` 僅存公開網址與 publishable key。`supabase/schema.sql` 為人工審閱的建表與權限腳本，不要在前端開發時自動執行。

## 溝通與工作方式

- 預設使用繁體中文溝通；程式碼識別字沿用所用語言及框架的慣例。
- 開始修改前先檢查相關檔案與 Git 狀態，保留使用者既有變更。
- 依使用者需求實作，避免加入無關功能、依賴或大範圍重構。
- 不提交密碼、secret、service_role 或存取權杖；使用者指定的 Supabase publishable key 可公開。
- 報修內容透過 `textContent` 呈現，避免將資料庫文字當成 HTML。
- 新增請求僅傳送內容欄位，不傳 `status`、`id`、`created_at`。正式資料庫測試可能新增公開資料，優先用攔截回應測試。

## 結構與文件

- `index.html`、`style.css`、`app.js`、`config.js` 放在根目錄；靜態資源採相對路徑，支援 GitHub Pages 專案子目錄。
- `文件/` 存放交付文件；`supabase/` 存放資料庫 SQL。
- PWA 使用 `manifest.webmanifest`、`pwa.js`、`sw.js` 與 `icons/`，scope 與資源路徑必須支援 GitHub Pages 子目錄。
- 修改介面或預先快取檔案時遞增 `sw.js` 的快取版本。只快取固定介面與經 SRI 驗證的 SDK，不快取 Supabase API、報修內容或 Office 文件；不新增自動離線送出。
- README.md 記錄本機預覽、Supabase 前置條件、部署及驗證方式，變更流程時同步更新。
- 排除依賴、建置產物、暫存檔及本機機密設定；不為前端加入不必要的套件或建置工具。

## 驗證與交付

- 本機預覽：儲存庫根目錄執行 `python3 -m http.server 8000`。
- 已驗證語法指令：`node --check app.js`、`node --check config.js`；差異檢查：`git diff --check`。
- PWA 需另檢查 `node --check pwa.js`、`node --check sw.js`，並用真正的 Service Worker 驗證根目錄／子路徑、離線重開、更新待命與快取清理；模擬 API 不等於正式資料庫已可用。
- 瀏覽器驗證應涵蓋手機版、空清單、清單載入失敗、送出成功與失敗、重複送出及文字安全呈現。
- 完成時簡述變更、驗證結果與限制，清楚區分攔截回應測試、正式 Supabase 驗證及 GitHub Pages 部署狀態。
