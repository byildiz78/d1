-- Şikayet Yönetimi Modülü SQL Sorguları

-- 1. Şikayet Listesi Sorgusu
-- Kullanım: Ana liste sayfası
-- Parametreler: @status, @branch_id, @assigned_to, @search_term, @start_date, @end_date
DECLARE @list_query NVARCHAR(MAX) = N'
SELECT 
    c.id,
    c.title,
    s.SubeAdi as branch_name,
    c.source,
    c.status,
    c.priority,
    c.created_at,
    c.resolved_at,
    c.last_action_at,
    u.Username as assigned_to_name,
    c.customer_name,
    c.description
FROM om_complaints c
INNER JOIN efr_Branchs s ON c.branch_id = s.SubeID
INNER JOIN efr_users u ON c.assigned_to = u.UserID
WHERE 1=1
    AND (@status IS NULL OR c.status = @status)
    AND (@branch_id IS NULL OR c.branch_id = @branch_id)
    AND (@assigned_to IS NULL OR c.assigned_to = @assigned_to)
    AND (@search_term IS NULL OR (
        c.title LIKE N''%'' + @search_term + N''%'' OR
        c.description LIKE N''%'' + @search_term + N''%'' OR
        c.customer_name LIKE N''%'' + @search_term + N''%''
    ))
    AND (@start_date IS NULL OR c.created_at >= @start_date)
    AND (@end_date IS NULL OR c.created_at <= @end_date)
ORDER BY c.last_action_at DESC;
';

-- 2. Tekil Şikayet Detayı Sorgusu
-- Kullanım: Detay sayfası
-- Parametreler: @complaint_id
DECLARE @detail_query NVARCHAR(MAX) = N'
SELECT 
    c.id,
    c.title,
    c.description,
    s.SubeAdi as branch_name,
    c.source,
    c.status,
    c.priority,
    c.created_at,
    c.resolved_at,
    c.last_action_at,
    u.Username as assigned_to_name,
    c.customer_name,
    c.customer_contact,
    (
        SELECT COUNT(*) 
        FROM om_complaint_files 
        WHERE complaint_id = c.id
    ) as file_count,
    (
        SELECT STRING_AGG(u2.Username, N'', '')
        FROM om_complaint_observers co
        INNER JOIN efr_users u2 ON co.user_id = u2.UserID
        WHERE co.complaint_id = c.id
    ) as observers
FROM om_complaints c
INNER JOIN efr_Branchs s ON c.branch_id = s.SubeID
INNER JOIN efr_users u ON c.assigned_to = u.UserID
WHERE c.id = @complaint_id;
';

-- 3. Şikayet Tarihçesi Sorgusu
-- Kullanım: Detay sayfasındaki tarihçe bölümü
-- Parametreler: @complaint_id
DECLARE @history_query NVARCHAR(MAX) = N'
SELECT 
    h.id,
    h.action_type,
    h.action_description,
    h.created_at,
    u.Username as created_by_name
FROM om_complaint_history h
INNER JOIN efr_users u ON h.created_by = u.UserID
WHERE h.complaint_id = @complaint_id
ORDER BY h.created_at DESC;
';

-- 4. Şikayet Dosyaları Sorgusu
-- Kullanım: Detay sayfasındaki dosyalar bölümü
-- Parametreler: @complaint_id
DECLARE @files_query NVARCHAR(MAX) = N'
SELECT 
    f.id,
    f.file_name,
    f.file_path,
    f.file_size,
    f.uploaded_at,
    u.Username as uploaded_by_name
FROM om_complaint_files f
INNER JOIN efr_users u ON f.uploaded_by = u.UserID
WHERE f.complaint_id = @complaint_id
ORDER BY f.uploaded_at DESC;
';

-- 5. Yeni Şikayet Ekleme Sorgusu
-- Kullanım: Yeni şikayet formu
-- Parametreler: Tüm şikayet alanları
DECLARE @insert_query NVARCHAR(MAX) = N'
-- Önce kullanıcının kategori 4 olduğunu kontrol et
IF NOT EXISTS (SELECT 1 FROM efr_users WHERE UserID = @assigned_to AND category = 4)
BEGIN
    RAISERROR (N''Atanan kullanıcı şikayet yöneticisi olmalıdır.'', 16, 1);
    RETURN;
END

INSERT INTO om_complaints (
    title, description, branch_id, source, status,
    priority, assigned_to, customer_name, customer_contact
)
VALUES (
    @title, @description, @branch_id, @source, @status,
    @priority, @assigned_to, @customer_name, @customer_contact
);

DECLARE @new_complaint_id INT = SCOPE_IDENTITY();

-- Gözlemcileri ekle (sadece kategori 4 olan kullanıcılar)
INSERT INTO om_complaint_observers (complaint_id, user_id, assigned_by)
SELECT 
    @new_complaint_id,
    u.UserID,
    @assigned_to
FROM STRING_SPLIT(@observers, '','') s
INNER JOIN efr_users u ON u.UserID = CAST(s.value AS INT)
WHERE u.category = 4;

-- İlk tarihçe kaydını ekle
INSERT INTO om_complaint_history (
    complaint_id, action_type, action_description, created_by
)
VALUES (
    @new_complaint_id,
    ''created'',
    N''Yeni şikayet kaydı oluşturuldu'',
    @assigned_to
);

SELECT @new_complaint_id as id;
';

-- 6. Şikayet Güncelleme Sorgusu
-- Kullanım: Şikayet düzenleme formu
-- Parametreler: Tüm şikayet alanları
DECLARE @update_query NVARCHAR(MAX) = N'
-- Önce kullanıcının kategori 4 olduğunu kontrol et
IF NOT EXISTS (SELECT 1 FROM efr_users WHERE UserID = @assigned_to AND category = 4)
BEGIN
    RAISERROR (N''Atanan kullanıcı şikayet yöneticisi olmalıdır.'', 16, 1);
    RETURN;
END

UPDATE om_complaints
SET 
    title = @title,
    description = @description,
    branch_id = @branch_id,
    source = @source,
    status = @status,
    priority = @priority,
    assigned_to = @assigned_to,
    customer_name = @customer_name,
    customer_contact = @customer_contact,
    resolved_at = CASE 
        WHEN @status = ''resolved'' AND resolved_at IS NULL THEN GETDATE()
        WHEN @status != ''resolved'' THEN NULL
        ELSE resolved_at
    END
WHERE id = @complaint_id;

-- Gözlemcileri güncelle (sadece kategori 4 olan kullanıcılar)
DELETE FROM om_complaint_observers WHERE complaint_id = @complaint_id;
INSERT INTO om_complaint_observers (complaint_id, user_id, assigned_by)
SELECT 
    @complaint_id,
    u.UserID,
    @assigned_to
FROM STRING_SPLIT(@observers, '','') s
INNER JOIN efr_users u ON u.UserID = CAST(s.value AS INT)
WHERE u.category = 4;

-- Tarihçe kaydı ekle
INSERT INTO om_complaint_history (
    complaint_id, action_type, action_description, created_by
)
VALUES (
    @complaint_id,
    ''updated'',
    N''Şikayet bilgileri güncellendi'',
    @assigned_to
);
';

-- 7. Yeni Dosya Ekleme Sorgusu
-- Kullanım: Dosya yükleme
-- Parametreler: @complaint_id, @file_name, @file_path, @file_size, @uploaded_by
DECLARE @add_file_query NVARCHAR(MAX) = N'
-- Önce kullanıcının kategori 4 olduğunu kontrol et
IF NOT EXISTS (SELECT 1 FROM efr_users WHERE UserID = @uploaded_by AND category = 4)
BEGIN
    RAISERROR (N''Dosya yükleyen kullanıcı şikayet yöneticisi olmalıdır.'', 16, 1);
    RETURN;
END

INSERT INTO om_complaint_files (
    complaint_id, file_name, file_path, file_size, uploaded_by
)
VALUES (
    @complaint_id, @file_name, @file_path, @file_size, @uploaded_by
);

-- Tarihçe kaydı ekle
INSERT INTO om_complaint_history (
    complaint_id, action_type, action_description, created_by
)
VALUES (
    @complaint_id,
    ''file_upload'',
    N''Dosya yüklendi: '' + @file_name,
    @uploaded_by
);
';

-- 8. Yeni Yorum Ekleme Sorgusu
-- Kullanım: Yorum ekleme formu
-- Parametreler: @complaint_id, @comment, @created_by
DECLARE @add_comment_query NVARCHAR(MAX) = N'
INSERT INTO om_complaint_history (
    complaint_id, action_type, action_description, created_by
)
VALUES (
    @complaint_id,
    ''comment'',
    @comment,
    @created_by
);
';
