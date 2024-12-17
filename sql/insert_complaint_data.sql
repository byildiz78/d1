-- Şikayet Yönetimi Modülü Örnek Veri Ekleme Scripti

-- Not: Bu script örnek veriler içindir. Gerçek ortamda kullanılmadan önce:
-- 1. efr_subeler tablosundaki gerçek şube ID'leri
-- 2. efr_users tablosundaki kategori=4 olan kullanıcı ID'leri
-- ile güncellenmelidir.

-- Örnek kullanıcı ve şube ID'lerini al
DECLARE @branch_kadikoy INT = (SELECT TOP 1 SubeID FROM efr_subeler WHERE SubeAdi LIKE '%kadıköy%');
DECLARE @branch_besiktas INT = (SELECT TOP 1 SubeID FROM efr_subeler WHERE SubeAdi LIKE '%beşiktaş%');
DECLARE @branch_sisli INT = (SELECT TOP 1 SubeID FROM efr_subeler WHERE SubeAdi LIKE '%şişli%');
DECLARE @branch_umraniye INT = (SELECT TOP 1 SubeID FROM efr_subeler WHERE SubeAdi LIKE '%ümraniye%');
DECLARE @branch_maltepe INT = (SELECT TOP 1 SubeID FROM efr_subeler WHERE SubeAdi LIKE '%maltepe%');

-- Kategori 4 olan kullanıcıları al
DECLARE @user_cursor CURSOR;
DECLARE @user_id INT;
DECLARE @user_count INT = 0;
DECLARE @user_ids TABLE (id INT);

SET @user_cursor = CURSOR FOR
SELECT UserID FROM efr_users WHERE category = 4;

OPEN @user_cursor;
FETCH NEXT FROM @user_cursor INTO @user_id;

WHILE @@FETCH_STATUS = 0 AND @user_count < 5
BEGIN
    INSERT INTO @user_ids (id) VALUES (@user_id);
    SET @user_count = @user_count + 1;
    FETCH NEXT FROM @user_cursor INTO @user_id;
END

CLOSE @user_cursor;
DEALLOCATE @user_cursor;

-- Kullanıcı ID'lerini değişkenlere ata
DECLARE @user_1 INT = (SELECT TOP 1 id FROM @user_ids ORDER BY id);
DECLARE @user_2 INT = (SELECT TOP 1 id FROM @user_ids WHERE id > @user_1 ORDER BY id);
DECLARE @user_3 INT = (SELECT TOP 1 id FROM @user_ids WHERE id > @user_2 ORDER BY id);
DECLARE @user_4 INT = (SELECT TOP 1 id FROM @user_ids WHERE id > @user_3 ORDER BY id);
DECLARE @user_5 INT = (SELECT TOP 1 id FROM @user_ids WHERE id > @user_4 ORDER BY id);

-- Ana şikayet kayıtları
INSERT INTO om_complaints (
    title, description, branch_id, source, status, priority,
    created_at, resolved_at, last_action_at,
    assigned_to, customer_name, customer_contact
)
VALUES 
    (
        N'Sipariş Gecikmesi',
        N'Siparişim 2 saat geçmesine rağmen hala teslim edilmedi.',
        @branch_kadikoy,
        'website',
        'open',
        'high',
        '2024-03-20T10:30:00',
        NULL,
        '2024-03-21T15:45:00',
        @user_1,
        N'Mehmet Demir',
        N'0555-555-5555'
    ),
    (
        N'Yanlış Ürün Teslimi',
        N'Sipariş ettiğim üründen farklı bir ürün teslim edildi.',
        @branch_besiktas,
        'call_center',
        'resolved',
        'medium',
        '2024-03-19T14:20:00',
        '2024-03-20T09:15:00',
        '2024-03-20T09:15:00',
        @user_2,
        N'Ayşe Kaya',
        N'ayse.kaya@email.com'
    ),
    (
        N'Kalite Sorunu',
        N'Ürünün kalitesi beklentilerimi karşılamadı.',
        @branch_sisli,
        'sikayetvar',
        'in_progress',
        'high',
        '2024-03-21T09:00:00',
        NULL,
        '2024-03-21T16:30:00',
        @user_3,
        N'Ali Öztürk',
        N'0532-532-5322'
    ),
    (
        N'Müşteri Hizmetleri İletişimi',
        N'Müşteri hizmetlerine ulaşmakta zorluk yaşıyorum.',
        @branch_umraniye,
        'email',
        'pending',
        'low',
        '2024-03-18T11:45:00',
        NULL,
        '2024-03-19T10:20:00',
        @user_4,
        N'Fatma Şahin',
        N'fatma.sahin@email.com'
    ),
    (
        N'Fiyatlandırma Hatası',
        N'Web sitesinde gösterilen fiyat ile fatura tutarı farklı.',
        @branch_maltepe,
        'website',
        'resolved',
        'medium',
        '2024-03-17T16:15:00',
        '2024-03-18T14:30:00',
        '2024-03-18T14:30:00',
        @user_5,
        N'Mustafa Yılmaz',
        N'0533-333-3333'
    );

-- Şikayet tarihçesi kayıtları
INSERT INTO om_complaint_history (
    complaint_id, action_type, action_description, created_at, created_by
)
SELECT 
    id,
    'status_change',
    CASE 
        WHEN status = 'resolved' THEN N'Şikayet çözüldü'
        WHEN status = 'in_progress' THEN N'Şikayet işleme alındı'
        WHEN status = 'pending' THEN N'Şikayet beklemede'
        ELSE N'Yeni şikayet kaydı oluşturuldu'
    END,
    created_at,
    assigned_to
FROM om_complaints;

-- Örnek dosya kayıtları
INSERT INTO om_complaint_files (
    complaint_id, file_name, file_path, file_size, uploaded_at, uploaded_by
)
SELECT 
    id,
    N'şikayet_' + CAST(id AS NVARCHAR) + N'_ek.pdf',
    N'/uploads/complaints/' + CAST(id AS NVARCHAR) + N'/ek.pdf',
    1024 * (id % 5 + 1), -- Örnek dosya boyutları
    created_at,
    assigned_to
FROM om_complaints
WHERE id IN (1, 3, 5); -- Sadece bazı şikayetlere dosya ekliyoruz

-- Örnek gözlemci kayıtları
INSERT INTO om_complaint_observers (
    complaint_id, user_id, assigned_at, assigned_by
)
VALUES
    (1, @user_2, '2024-03-20T10:35:00', @user_1),
    (1, @user_3, '2024-03-20T10:35:00', @user_1),
    (3, @user_4, '2024-03-21T09:05:00', @user_3),
    (3, @user_5, '2024-03-21T09:05:00', @user_3),
    (5, @user_1, '2024-03-17T16:20:00', @user_5);

-- Ek tarihçe kayıtları (gözlemci atamaları için)
INSERT INTO om_complaint_history (
    complaint_id, action_type, action_description, created_at, created_by
)
VALUES
    (1, 'observer_added', N'Gözlemci eklendi: ' + (SELECT Username FROM efr_users WHERE UserID = @user_2), '2024-03-20T10:35:00', @user_1),
    (1, 'observer_added', N'Gözlemci eklendi: ' + (SELECT Username FROM efr_users WHERE UserID = @user_3), '2024-03-20T10:35:00', @user_1),
    (3, 'observer_added', N'Gözlemci eklendi: ' + (SELECT Username FROM efr_users WHERE UserID = @user_4), '2024-03-21T09:05:00', @user_3),
    (3, 'observer_added', N'Gözlemci eklendi: ' + (SELECT Username FROM efr_users WHERE UserID = @user_5), '2024-03-21T09:05:00', @user_3),
    (5, 'observer_added', N'Gözlemci eklendi: ' + (SELECT Username FROM efr_users WHERE UserID = @user_1), '2024-03-17T16:20:00', @user_5);
