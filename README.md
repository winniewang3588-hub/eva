# 報修登記系統

用於登記與追蹤公司內部的報修需求。前端使用純 HTML、CSS、JavaScript，透過 CDN 載入固定版本的 supabase-js v2，不需要建置步驟。

[報修欄位表（Excel）](文件/報修欄位表.xlsx)

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

## 驗證

- `node --check app.js`、`node --check config.js`：JavaScript 語法檢查。
- `git diff --check`：差異空白檢查。
- 已使用 Chromium 與 Playwright，在 390px／1280px 寬度，以攔截的 Supabase 回應測試空清單、20 筆清單、排序及筆數參數、送出欄位、重複送出防護、成功清空、錯誤保留、重新整理及純文字呈現。
- 緊急程度篩選已另外測試 320px／390px／1280px 顯示、至少 44px 按鈕、選取樣式與鍵盤操作、切換不增加請求、刷新保留篩選、空結果與錯誤狀態，以及紅色「高」標籤。
- 瀏覽器測試沒有寫入正式資料庫；此雲端環境的真實 Supabase 唯讀連線遭代理回覆 403，正式資料表與權限尚未完成端到端驗證。
