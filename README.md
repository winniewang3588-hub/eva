# 報修登記系統

用於登記與追蹤公司內部的報修需求。前端使用純 HTML、CSS、JavaScript，透過 CDN 載入固定版本的 supabase-js v2，不需要建置步驟。

[報修欄位表（Excel）](文件/報修欄位表.xlsx)

[報修系統操作說明（Word）](文件/報修系統操作說明.docx)

[報修登記系統提案（PowerPoint）](文件/報修登記系統提案.pptx)

## 本機預覽

在儲存庫根目錄執行 `python3 -m http.server 8000`，再以瀏覽器開啟 `http://localhost:8000/`。網路必須允許載入 `cdn.jsdelivr.net` 及連線至 `bguhafvrgspwhlspfavx.supabase.co`。

## Supabase 設定

- `config.js` 已填入指定專案網址與可公開的 publishable key；不可放入 secret 或 service_role 金鑰。
- 使用前須由管理者確認資料表及權限已依 [supabase/schema.sql](supabase/schema.sql) 建立。本次前端開發不會執行該 SQL。
- 表單只新增 `reporter_name`、`location`、`category`、`description`、`urgency`，不傳送 `status`、`id`、`created_at`；由資料庫產生預設值。
- 清單讀取最近 20 筆，依建立時間由新到舊排列；時間顯示為台北時區。訪客無法在介面上修改或刪除資料。
- 清單公開可見，示範請使用虛構資料。送出失敗時會保留表單；若無法確認送出結果，請先重新整理清單再決定是否重送。

## 緊急程度篩選

- 最近報修清單上方提供「全部／高／中／低」四個按鈕，預設選取「全部」；選取中的按鈕以深底白字顯示，並提供 `aria-pressed` 狀態。
- 篩選只處理網頁已載入的最近 20 筆資料，不會額外查詢 Supabase，也不代表搜尋全部歷史報修。原本由新到舊的排序保持不變。
- 緊急程度為「高」的標籤使用紅字與淡紅底，仍保留文字，避免僅靠顏色辨識。
- 沒有符合條件的資料時會顯示提示；重新整理或新增成功後會保留目前的篩選選項。
- 本次只修改網頁與本說明，沒有修改資料庫、資料表欄位或 `supabase/` 內的檔案。

手機確認方式：開啟待審分支的預覽頁，依序點「高／中／低／全部」，確認按鈕的選取樣式、清單緊急程度及紅色「高」標籤；若某級沒有資料，應看到無符合項目的提示。正式 GitHub Pages 在 PR 尚未合併前仍可能是舊版。

## GitHub Pages

合併至 `main` 後，在 GitHub 的 **Settings → Pages → Build and deployment** 選擇 **Deploy from a branch**，分支選 `main`，資料夾選 **/ (root)**。首頁為根目錄的 `index.html`，CSS 與 JavaScript 均使用相對路徑，適用專案子目錄。

預期網址：<https://winniewang3588-hub.github.io/eva/>。實際可用狀態以 GitHub Pages 部署結果為準。

## PWA：安裝到主畫面與離線使用

手機網址：<https://winniewang3588-hub.github.io/eva/>。

[下載手機掃描用 QR Code](文件/報修登記PWA-QR.png)（連結與 QR Code 指向相同網址；實際上線以 GitHub Pages 部署結果為準）。

- 網頁包含 `manifest.webmanifest`、`sw.js`、`pwa.js` 與手機圖示，支援 GitHub Pages 的 `/eva/` 子路徑；不需要建置工具或修改資料庫。
- 請以 HTTPS（正式網站）或 localhost（開發）開啟，先連線造訪一次，讓 Service Worker 安裝及快取介面。直接用 `file://` 開啟不支援離線安裝。
- Android Chrome／Edge 等瀏覽器符合安裝條件時，頁面會出現「安裝到主畫面」；也可使用瀏覽器選單的「安裝應用程式／加入主畫面」。iPhone／iPad 請用 Safari 的「分享 → 加入主畫面」。安裝後以獨立視窗開啟；各系統的選單名稱可能不同。
- 離線可重開已快取的介面並填寫表單，但無法送出或重新讀取清單；必須連線後手動操作。連線恢復不會自動送出，也沒有背景同步或離線待送佇列。
- 表單草稿僅留在目前頁面記憶體，重新整理、更新或關閉會遺失。報修清單不存入 Cache Storage、localStorage 或 IndexedDB；同一頁若保留舊清單，會提示它不是最新資料，離線重開時不會還原清單。
- 只快取固定介面檔案、圖示、公開設定與通過完整性校驗的固定版 Supabase SDK，不快取 Supabase API 回應或 Office 文件。若 CDN 首次取用失敗，仍可離線開啟介面，但報修服務須待連線後重新整理才可啟用。
- 有新版本時顯示「更新應用程式」，不會自動重新載入；請先完成或記下表單再按更新。每次變更介面或快取檔案都必須遞增 `sw.js` 的 `CACHE_NAME` 版本；更新 SDK 時也須同步 URL 與 SRI。舊版快取僅清理本應用程式、相同 scope 的項目，不影響其他專案。

手機確認：先在線上開啟並安裝，關閉後從主畫面重開；再開啟飛航模式，確認仍看到介面與離線提示，且送出／重新整理按鈕停用。恢復連線後先確認資料再手動送出；PWA 不代表正式 Supabase 連線與權限已驗證。

## 驗證

- `node --check app.js`、`node --check config.js`：JavaScript 語法檢查。
- `node --check pwa.js`、`node --check sw.js`：PWA 與 Service Worker 語法檢查。
- `git diff --check`：差異空白檢查。
- 已使用 Chromium 與 Playwright，在 390px／1280px 寬度，以攔截的 Supabase 回應測試空清單、20 筆清單、排序及筆數參數、送出欄位、重複送出防護、成功清空、錯誤保留、重新整理及純文字呈現。
- 緊急程度篩選已另外測試 320px／390px／1280px 顯示、至少 44px 按鈕、選取樣式與鍵盤操作、切換不增加請求、刷新保留篩選、空結果與錯誤狀態，以及紅色「高」標籤。
- PWA 已用 Chromium 的一般持久化設定檔檢查安裝條件，並以真正的 Service Worker 驗證 `/` 與 `/eva/`：離線重開、SDK 快取、API／文件不快取、離線停用送出、連線恢復不自動送出、新版待命與手動更新、舊快取清理及 CDN 失敗時的介面備援；手機原生安裝操作仍需在實機確認。
- 瀏覽器測試沒有寫入正式資料庫；此雲端環境的真實 Supabase 唯讀連線遭代理回覆 403，正式資料表與權限尚未完成端到端驗證。
