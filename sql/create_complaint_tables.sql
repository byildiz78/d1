-- Şikayet Yönetimi Modülü Tablo Oluşturma Scripti

-- Enum değerlerini kontrol etmek için check constraint'ler
CREATE FUNCTION dbo.fn_check_complaint_source(@source VARCHAR(20))
RETURNS BIT
AS
BEGIN
    RETURN CASE WHEN @source IN ('website', 'email', 'sikayetvar', 'call_center', 'twitter', 'facebook', 'instagram') THEN 1 ELSE 0 END
END
GO

CREATE FUNCTION dbo.fn_check_complaint_status(@status VARCHAR(20))
RETURNS BIT
AS
BEGIN
    RETURN CASE WHEN @status IN ('open', 'in_progress', 'resolved', 'pending') THEN 1 ELSE 0 END
END
GO

CREATE FUNCTION dbo.fn_check_complaint_priority(@priority VARCHAR(10))
RETURNS BIT
AS
BEGIN
    RETURN CASE WHEN @priority IN ('high', 'medium', 'low') THEN 1 ELSE 0 END
END
GO

-- Split string function
CREATE FUNCTION [dbo].[fnSplitString] 
(
    @string NVARCHAR(MAX),
    @delimiter CHAR(1)
)
RETURNS @output TABLE(item NVARCHAR(MAX))
BEGIN
    DECLARE @start INT, @end INT
    SELECT @start = 1, @end = CHARINDEX(@delimiter, @string)

    WHILE @start < LEN(@string) + 1 BEGIN
        IF @end = 0 
            SET @end = LEN(@string) + 1

        INSERT INTO @output (item)
        VALUES(SUBSTRING(@string, @start, @end - @start))

        SET @start = @end + 1
        SET @end = CHARINDEX(@delimiter, @string, @start)
    END

    RETURN
END
GO

-- Ana Şikayet Tablosu
CREATE TABLE om_complaints (
    id INT IDENTITY(1,1) PRIMARY KEY,
    title NVARCHAR(200) NOT NULL,
    description NVARCHAR(MAX) NOT NULL,
    branch_id INT NOT NULL,
    source VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL,
    priority VARCHAR(10) NOT NULL,
    created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    resolved_at DATETIME2 NULL,
    last_action_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    assigned_to INT NOT NULL,
    customer_name NVARCHAR(100) NOT NULL,
    customer_contact NVARCHAR(100) NOT NULL,
    FOREIGN KEY (branch_id) REFERENCES efr_subeler(SubeID),
    FOREIGN KEY (assigned_to) REFERENCES efr_users(UserID),
    CONSTRAINT CHK_complaint_source CHECK (dbo.fn_check_complaint_source(source) = 1),
    CONSTRAINT CHK_complaint_status CHECK (dbo.fn_check_complaint_status(status) = 1),
    CONSTRAINT CHK_complaint_priority CHECK (dbo.fn_check_complaint_priority(priority) = 1),
    CONSTRAINT CHK_assigned_to_category CHECK (
        EXISTS (
            SELECT 1 FROM efr_users 
            WHERE UserID = assigned_to AND category = 4
        )
    )
);

-- Şikayet Tarihçesi
CREATE TABLE om_complaint_history (
    id INT IDENTITY(1,1) PRIMARY KEY,
    complaint_id INT NOT NULL,
    action_type VARCHAR(50) NOT NULL,
    action_description NVARCHAR(MAX) NOT NULL,
    created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    created_by INT NOT NULL,
    FOREIGN KEY (complaint_id) REFERENCES om_complaints(id),
    FOREIGN KEY (created_by) REFERENCES efr_users(UserID),
    CONSTRAINT CHK_history_created_by_category CHECK (
        EXISTS (
            SELECT 1 FROM efr_users 
            WHERE UserID = created_by AND category = 4
        )
    )
);

-- Şikayet Dosyaları
CREATE TABLE om_complaint_files (
    id INT IDENTITY(1,1) PRIMARY KEY,
    complaint_id INT NOT NULL,
    file_name NVARCHAR(255) NOT NULL,
    file_path NVARCHAR(500) NOT NULL,
    file_size INT NOT NULL,
    uploaded_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    uploaded_by INT NOT NULL,
    FOREIGN KEY (complaint_id) REFERENCES om_complaints(id),
    FOREIGN KEY (uploaded_by) REFERENCES efr_users(UserID),
    CONSTRAINT CHK_files_uploaded_by_category CHECK (
        EXISTS (
            SELECT 1 FROM efr_users 
            WHERE UserID = uploaded_by AND category = 4
        )
    )
);

-- Şikayet Gözlemcileri
CREATE TABLE om_complaint_observers (
    complaint_id INT NOT NULL,
    user_id INT NOT NULL,
    assigned_at DATETIME2 NOT NULL DEFAULT GETDATE(),
    assigned_by INT NOT NULL,
    PRIMARY KEY (complaint_id, user_id),
    FOREIGN KEY (complaint_id) REFERENCES om_complaints(id),
    FOREIGN KEY (user_id) REFERENCES efr_users(UserID),
    FOREIGN KEY (assigned_by) REFERENCES efr_users(UserID),
    CONSTRAINT CHK_observer_user_category CHECK (
        EXISTS (
            SELECT 1 FROM efr_users 
            WHERE UserID = user_id AND category = 4
        )
    ),
    CONSTRAINT CHK_observer_assigned_by_category CHECK (
        EXISTS (
            SELECT 1 FROM efr_users 
            WHERE UserID = assigned_by AND category = 4
        )
    )
);

-- İndeksler
CREATE INDEX IX_om_complaints_status ON om_complaints(status);
CREATE INDEX IX_om_complaints_branch_id ON om_complaints(branch_id);
CREATE INDEX IX_om_complaints_assigned_to ON om_complaints(assigned_to);
CREATE INDEX IX_om_complaints_created_at ON om_complaints(created_at DESC);

CREATE INDEX IX_om_complaint_history_complaint_id ON om_complaint_history(complaint_id);
CREATE INDEX IX_om_complaint_history_created_at ON om_complaint_history(created_at DESC);

CREATE INDEX IX_om_complaint_files_complaint_id ON om_complaint_files(complaint_id);

CREATE INDEX IX_om_complaint_observers_user_id ON om_complaint_observers(user_id);

-- Trigger: last_action_at alanını güncellemek için
CREATE TRIGGER tr_complaint_update_last_action
ON om_complaints
AFTER UPDATE
AS
BEGIN
    IF NOT UPDATE(last_action_at)
    BEGIN
        UPDATE om_complaints
        SET last_action_at = GETDATE()
        FROM om_complaints c
        INNER JOIN inserted i ON c.id = i.id
    END
END
GO

-- Trigger: Şikayet durumu değiştiğinde history tablosuna kayıt eklemek için
CREATE TRIGGER tr_complaint_status_history
ON om_complaints
AFTER UPDATE
AS
BEGIN
    IF UPDATE(status)
    BEGIN
        INSERT INTO om_complaint_history (complaint_id, action_type, action_description, created_by)
        SELECT 
            i.id,
            'status_change',
            'Status changed from ' + d.status + ' to ' + i.status,
            i.assigned_to
        FROM inserted i
        INNER JOIN deleted d ON i.id = d.id
        WHERE i.status <> d.status
    END
END
GO
