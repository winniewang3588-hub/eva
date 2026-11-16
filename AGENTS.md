# 專案協作指引

## 專案現況

東京自由行指南，採純 HTML、CSS、JavaScript；首頁為根目錄 `index.html`，可直接以 GitHub Pages 發布，無建置步驟、無資料庫與外部 API。東京篇為首頁、北海道篇為 `hokkaido.html`、九州篇為 `kyushu.html`，內容資料分別寫在 `app.js`、`hokkaido.js`、`kyushu.js`；頁首地點下拉選單由 `menu.js` 輔助，新增地區頁時三頁選單須同步更新；行前清單勾選狀態只存在瀏覽器 localStorage。`文件/`、`supabase/` 與 `報修需求筆記.txt` 為先前報修系統的舊交付檔，現行網站不使用，不要在前端開發時執行 `supabase/schema.sql`。

## 溝通與工作方式

- 預設使用繁體中文溝通；程式碼識別字沿用所用語言及框架的慣例。
- 開始修改前先檢查相關檔案與 Git 狀態，保留使用者既有變更。
- 依使用者需求實作，避免加入無關功能、依賴或大範圍重構。
- 不提交密碼、secret、service_role 或存取權杖；使用者指定的 Supabase publishable key 可公開。
- 動態內容透過 `textContent` 呈現，避免將文字當成 HTML。
- 票價、時刻與規定等易變資訊以約略值或「以官方公告為準」呈現，避免寫死精確價格。

## 結構與文件

- `index.html`、`style.css`、`app.js` 放在根目錄；靜態資源採相對路徑，支援 GitHub Pages 專案子目錄。
- PWA 使用 `manifest.webmanifest`、`pwa.js`、`sw.js` 與 `icons/`，scope 與資源路徑必須支援 GitHub Pages 子目錄。
- 修改介面或預先快取檔案時遞增 `sw.js` 的快取版本，並同步更新各頁 HTML 中 CSS／JS 的 `?v=` 參數。只快取固定介面檔案，不快取 Office 文件或外部資源。
- README.md 記錄功能、本機預覽、部署及驗證方式，變更流程時同步更新。
- 排除依賴、建置產物、暫存檔及本機機密設定；不為前端加入不必要的套件或建置工具。

## 驗證與交付

- 本機預覽：儲存庫根目錄執行 `python3 -m http.server 8000`。
- 已驗證語法指令：`node --check app.js`、`node --check hokkaido.js`、`node --check kyushu.js`、`node --check menu.js`；差異檢查：`git diff --check`。
- PWA 需另檢查 `node --check pwa.js`、`node --check sw.js`，並用真正的 Service Worker 驗證根目錄／子路徑、離線重開、更新待命與快取清理。
- 瀏覽器驗證應涵蓋手機版與桌機版版面、行程分頁鍵盤操作、區域篩選、預算試算（含錯誤輸入）及行前清單保存與重設。
- 完成時簡述變更、驗證結果與限制，清楚區分本機測試與 GitHub Pages 部署狀態。
