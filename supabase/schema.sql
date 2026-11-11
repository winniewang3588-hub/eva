-- 報修登記系統：供人工審閱的 Supabase 建表腳本，本次僅產生檔案，不執行。
-- 本檔適用於首次建表，須由資料庫管理角色執行；已有同名表時應停止並另寫遷移。
-- 使用交易確保建表、權限與資料列安全設定一併完成，避免留下部分設定。
BEGIN;

-- 資料結構：所有欄位皆不可為空值；識別碼與建立時間由資料庫產生。
-- 建立時間使用含時區的時間型態；顯示時區由前端決定。
CREATE TABLE public.repair_requests (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz NOT NULL DEFAULT now(),
    reporter_name text NOT NULL,
    location text NOT NULL,
    category text NOT NULL,
    description text NOT NULL,
    urgency text NOT NULL DEFAULT '中',
    status text NOT NULL DEFAULT '待處理',

    -- 第三層 CHECK：姓名與地點不得為空字串或全為半形空白，並限制原文總長。
    -- 本版採姓名最多 80、地點最多 120 字元；長度以字元計算，不以位元組計算。
    CONSTRAINT repair_requests_reporter_name_check CHECK (
        char_length(btrim(reporter_name)) >= 1
        AND char_length(reporter_name) <= 80
    ),
    CONSTRAINT repair_requests_location_check CHECK (
        char_length(btrim(location)) >= 1
        AND char_length(location) <= 120
    ),

    -- 第三層 CHECK：問題說明不得為空字串或全為半形空白，最多 2,000 字元。
    CONSTRAINT repair_requests_description_check CHECK (
        char_length(btrim(description)) >= 1
        AND char_length(description) <= 2000
    ),

    -- 第三層 CHECK：限定類別、緊急程度及狀態的完整文字值，也間接限制其長度。
    -- 狀態在資料結構上保留三種值；匿名新增另由欄位權限及 RLS 限制。
    CONSTRAINT repair_requests_category_check CHECK (
        category IN ('設備', '網路', '環境', '其他')
    ),
    CONSTRAINT repair_requests_urgency_check CHECK (
        urgency IN ('低', '中', '高')
    ),
    CONSTRAINT repair_requests_status_check CHECK (
        status IN ('待處理', '處理中', '已完成')
    )
);

-- 第一層 GRANT：不依賴新資料表的自動授權，先移除一般應用角色的表級權限。
-- 本版只開放 anon；authenticated 不另開放，資料庫管理角色仍須妥善保管。
REVOKE ALL PRIVILEGES ON TABLE public.repair_requests
    FROM PUBLIC, anon, authenticated;

-- 第一層 GRANT：提供 anon 存取公開結構描述及讀取清單所需的最低權限。
-- 此處僅授予結構描述的 USAGE，未授予建立資料表的權限。
GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT ON TABLE public.repair_requests TO anon;

-- 第一層 GRANT：只允許新增報修內容；緊急程度可省略並使用預設值「中」。
-- 前端須省略 id、created_at、status，讓資料庫填入預設值；不得傳入自訂值。
-- 不授予表級 INSERT，也不授予 UPDATE、DELETE、TRUNCATE 等權限。
GRANT INSERT (reporter_name, location, category, description, urgency)
    ON TABLE public.repair_requests TO anon;

-- 第二層 RLS：啟用資料列安全；有 GRANT 仍須通過對應資料列政策。
ALTER TABLE public.repair_requests ENABLE ROW LEVEL SECURITY;

-- 第二層 RLS：所有使用 anon 角色的訪客都能讀取全部報修清單。
CREATE POLICY repair_requests_anon_select
    ON public.repair_requests
    FOR SELECT
    TO anon
    USING (true);

-- 第二層 RLS：新增後的狀態必須是「待處理」；檢查會套用到預設值填入後的資料。
-- 即使未來擴大 status 的新增欄位權限，這項政策仍限制匿名新增的初始狀態。
-- 不建立 UPDATE 或 DELETE 政策；一般訪客無法修改或刪除報修資料。
CREATE POLICY repair_requests_anon_insert
    ON public.repair_requests
    FOR INSERT
    TO anon
    WITH CHECK (status = '待處理');

-- 資料字典：提醒清單公開可讀，不應填入真實個資或機密內容。
COMMENT ON TABLE public.repair_requests IS
    '公開示範報修清單；僅供虛構資料，匿名訪客可新增及讀取，不可修改或刪除。';
COMMENT ON COLUMN public.repair_requests.id IS '資料庫自動產生的 UUID 主鍵。';
COMMENT ON COLUMN public.repair_requests.created_at IS '資料庫自動產生的建立時間，使用含時區時間型態。';
COMMENT ON COLUMN public.repair_requests.reporter_name IS '報修人姓名，1 至 80 字元；示範請使用虛構姓名。';
COMMENT ON COLUMN public.repair_requests.location IS '地點或部門，1 至 120 字元；示範請使用虛構地點。';
COMMENT ON COLUMN public.repair_requests.category IS '類別：設備、網路、環境、其他。';
COMMENT ON COLUMN public.repair_requests.description IS '問題說明，1 至 2,000 字元；不可全為半形空白。';
COMMENT ON COLUMN public.repair_requests.urgency IS '緊急程度：低、中、高；預設為中。';
COMMENT ON COLUMN public.repair_requests.status IS '處理狀態：待處理、處理中、已完成；匿名新增固定為待處理。';

-- 完成交易：僅供未來人工執行時使用，本次任務不會連線至資料庫。
COMMIT;
