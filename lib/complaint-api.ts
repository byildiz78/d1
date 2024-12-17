'use server'

import { executeQuery } from './api-client'

export interface ComplaintFilters {
  status?: string;
  branchId?: number;
  assignedTo?: number;
  searchTerm?: string;
  startDate?: string;
  endDate?: string;
}

export interface ComplaintInput {
  title: string;
  description: string;
  branchId: number;
  source: string;
  status: string;
  priority: string;
  assignedTo: number;
  observers: string;
  customerName: string;
  customerContact: string;
}

export interface FileInput {
  complaintId: number;
  fileName: string;
  filePath: string;
  fileSize: number;
  uploadedBy: number;
}

// Şikayet listesini getir
export async function getComplaints(filters?: ComplaintFilters) {
  const query = `
    SELECT 
      c.id,
      c.title,
      s.BranchName as branch_name,
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
    INNER JOIN efr_Branchs s ON c.branch_id = s.BranchID
    INNER JOIN efr_users u ON c.assigned_to = u.UserID
    WHERE 1=1
      ${filters?.status ? "AND c.status = '" + filters.status + "'" : ''}
      ${filters?.branchId ? 'AND c.branch_id = ' + filters.branchId : ''}
      ${filters?.assignedTo ? 'AND c.assigned_to = ' + filters.assignedTo : ''}
      ${filters?.searchTerm ? "AND (c.title LIKE '%" + filters.searchTerm + "%' OR c.description LIKE '%" + filters.searchTerm + "%' OR c.customer_name LIKE '%" + filters.searchTerm + "%')" : ''}
      ${filters?.startDate ? "AND c.created_at >= '" + filters.startDate + "'" : ''}
      ${filters?.endDate ? "AND c.created_at <= '" + filters.endDate + "'" : ''}
    ORDER BY c.last_action_at DESC;
  `;
  
  return executeQuery(query);
}

// Tekil şikayet detayını getir
export async function getComplaintDetail(complaintId: number) {
  const query = `
    SELECT 
      c.id,
      c.title,
      c.description,
      s.BranchName as branch_name,
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
        SELECT STRING_AGG(u2.Username, ', ')
        FROM om_complaint_observers co
        INNER JOIN efr_users u2 ON co.user_id = u2.UserID
        WHERE co.complaint_id = c.id
      ) as observers
    FROM om_complaints c
    INNER JOIN efr_Branchs s ON c.branch_id = s.BranchID
    INNER JOIN efr_users u ON c.assigned_to = u.UserID
    WHERE c.id = ${complaintId};
  `;
  
  return executeQuery(query);
}

// Şikayet tarihçesini getir
export async function getComplaintHistory(complaintId: number) {
  const query = `
    SELECT 
      h.id,
      h.action_type,
      h.action_description,
      h.created_at,
      u.Username as created_by_name
    FROM om_complaint_history h
    INNER JOIN efr_users u ON h.created_by = u.UserID
    WHERE h.complaint_id = ${complaintId}
    ORDER BY h.created_at DESC;
  `;
  
  return executeQuery(query);
}

// Şikayet dosyalarını getir
export async function getComplaintFiles(complaintId: number) {
  const query = `
    SELECT 
      f.id,
      f.file_name,
      f.file_path,
      f.file_size,
      f.uploaded_at,
      u.Username as uploaded_by_name
    FROM om_complaint_files f
    INNER JOIN efr_users u ON f.uploaded_by = u.UserID
    WHERE f.complaint_id = ${complaintId}
    ORDER BY f.uploaded_at DESC;
  `;
  
  return executeQuery(query);
}

// Yeni şikayet oluştur
export async function createComplaint(input: ComplaintInput) {
  // Boş observers dizisini kontrol et
  const observers = input.observers?.trim() || '';
  
  const query = `
    -- Önce kullanıcının kategori 4 olduğunu kontrol et
    IF NOT EXISTS (SELECT 1 FROM efr_users WHERE UserID = ${input.assignedTo} AND category = 4)
    BEGIN
      RAISERROR (N'Atanan kullanıcı şikayet yöneticisi olmalıdır.', 16, 1);
      RETURN;
    END

    DECLARE @now DATETIME = GETDATE();

    INSERT INTO om_complaints (
      title, description, branch_id, source, status,
      priority, assigned_to, customer_name, customer_contact,
      created_at, last_action_at
    )
    VALUES (
      '${input.title}',
      '${input.description}',
      ${input.branchId},
      '${input.source}',
      '${input.status}',
      '${input.priority}',
      ${input.assignedTo},
      '${input.customerName}',
      '${input.customerContact}',
      @now,
      @now
    );

    DECLARE @new_complaint_id INT = SCOPE_IDENTITY();

    -- Gözlemcileri ekle (sadece kategori 4 olan kullanıcılar)
    ${observers ? `
    DECLARE @observer_id INT;
    DECLARE @pos INT = 1;
    DECLARE @len INT = LEN('${observers}');
    DECLARE @value NVARCHAR(20);
    
    WHILE @pos <= @len
    BEGIN
        -- Virgüle kadar olan kısmı al
        SET @value = '';
        WHILE @pos <= @len AND SUBSTRING('${observers}', @pos, 1) != ','
        BEGIN
            SET @value = @value + SUBSTRING('${observers}', @pos, 1);
            SET @pos = @pos + 1;
        END
        
        -- Virgülü atla
        SET @pos = @pos + 1;
        
        -- Boş değilse ve sayıysa ekle
        IF @value != '' AND ISNUMERIC(@value) = 1
        BEGIN
            SET @observer_id = CAST(@value AS INT);
            IF EXISTS (SELECT 1 FROM efr_users WHERE UserID = @observer_id AND category = 4)
            BEGIN
                INSERT INTO om_complaint_observers (complaint_id, user_id, assigned_by)
                VALUES (@new_complaint_id, @observer_id, ${input.assignedTo});
            END
        END
    END
    ` : '-- No observers to add'}

    INSERT INTO om_complaint_history (
      complaint_id, action_type, action_description, created_by, created_at
    )
    VALUES (
      @new_complaint_id,
      'created',
      N'Yeni şikayet kaydı oluşturuldu',
      ${input.assignedTo},
      @now
    );

    SELECT @new_complaint_id as id;
  `;
  
  return executeQuery(query);
}

// Şikayet güncelle
export async function updateComplaint(complaintId: number, input: ComplaintInput) {
  // Boş observers dizisini kontrol et
  const observers = input.observers?.trim() || '';
  
  const query = `
    -- Önce kullanıcının kategori 4 olduğunu kontrol et
    IF NOT EXISTS (SELECT 1 FROM efr_users WHERE UserID = ${input.assignedTo} AND category = 4)
    BEGIN
      RAISERROR (N'Atanan kullanıcı şikayet yöneticisi olmalıdır.', 16, 1);
      RETURN;
    END

    DECLARE @now DATETIME = GETDATE();

    UPDATE om_complaints
    SET 
      title = '${input.title}',
      description = '${input.description}',
      branch_id = ${input.branchId},
      source = '${input.source}',
      status = '${input.status}',
      priority = '${input.priority}',
      assigned_to = ${input.assignedTo},
      customer_name = '${input.customerName}',
      customer_contact = '${input.customerContact}',
      last_action_at = @now,
      resolved_at = CASE 
        WHEN '${input.status}' = 'resolved' AND resolved_at IS NULL THEN @now
        WHEN '${input.status}' != 'resolved' THEN NULL
        ELSE resolved_at
      END
    WHERE id = ${complaintId};

    -- Gözlemcileri güncelle (sadece kategori 4 olan kullanıcılar)
    DELETE FROM om_complaint_observers WHERE complaint_id = ${complaintId};

    ${observers ? `
    DECLARE @observer_id INT;
    DECLARE @pos INT = 1;
    DECLARE @len INT = LEN('${observers}');
    DECLARE @value NVARCHAR(20);
    
    WHILE @pos <= @len
    BEGIN
        -- Virgüle kadar olan kısmı al
        SET @value = '';
        WHILE @pos <= @len AND SUBSTRING('${observers}', @pos, 1) != ','
        BEGIN
            SET @value = @value + SUBSTRING('${observers}', @pos, 1);
            SET @pos = @pos + 1;
        END
        
        -- Virgülü atla
        SET @pos = @pos + 1;
        
        -- Boş değilse ve sayıysa ekle
        IF @value != '' AND ISNUMERIC(@value) = 1
        BEGIN
            SET @observer_id = CAST(@value AS INT);
            IF EXISTS (SELECT 1 FROM efr_users WHERE UserID = @observer_id AND category = 4)
            BEGIN
                INSERT INTO om_complaint_observers (complaint_id, user_id, assigned_by)
                VALUES (${complaintId}, @observer_id, ${input.assignedTo});
            END
        END
    END
    ` : '-- No observers to add'}

    INSERT INTO om_complaint_history (
      complaint_id, action_type, action_description, created_by, created_at
    )
    VALUES (
      ${complaintId},
      'updated',
      N'Şikayet bilgileri güncellendi',
      ${input.assignedTo},
      @now
    );
  `;
  
  return executeQuery(query);
}

// Dosya ekle
export async function addComplaintFile(input: FileInput) {
  const query = `
    -- Önce kullanıcının kategori 4 olduğunu kontrol et
    IF NOT EXISTS (SELECT 1 FROM efr_users WHERE UserID = ${input.uploadedBy} AND category = 4)
    BEGIN
      RAISERROR (N'Dosya yükleyen kullanıcı şikayet yöneticisi olmalıdır.', 16, 1);
      RETURN;
    END

    INSERT INTO om_complaint_files (
      complaint_id, file_name, file_path, file_size, uploaded_by
    )
    VALUES (
      ${input.complaintId},
      '${input.fileName}',
      '${input.filePath}',
      ${input.fileSize},
      ${input.uploadedBy}
    );

    INSERT INTO om_complaint_history (
      complaint_id, action_type, action_description, created_by
    )
    VALUES (
      ${input.complaintId},
      'file_upload',
      N'Dosya yüklendi: ' + '${input.fileName}',
      ${input.uploadedBy}
    );
  `;
  
  return executeQuery(query);
}

// Yorum ekle
export async function addComplaintComment(complaintId: number, comment: string, createdBy: number) {
  const query = `
    -- Önce kullanıcının kategori 4 olduğunu kontrol et
    IF NOT EXISTS (SELECT 1 FROM efr_users WHERE UserID = ${createdBy} AND category = 4)
    BEGIN
      RAISERROR (N'Yorum ekleyen kullanıcı şikayet yöneticisi olmalıdır.', 16, 1);
      RETURN;
    END

    INSERT INTO om_complaint_history (
      complaint_id, action_type, action_description, created_by
    )
    VALUES (
      ${complaintId},
      'comment',
      '${comment}',
      ${createdBy}
    );
  `;
  
  return executeQuery(query);
}

// Şubeleri getir
export async function getBranches() {
  const query = `
    SELECT BranchID as id, BranchName as name
    FROM efr_Branchs
    ORDER BY BranchName;
  `;
  
  return executeQuery(query);
}

// Kullanıcıları getir
export async function getUsers() {
  const query = `
    SELECT UserID as id, Username as name
    FROM efr_users
    WHERE category = 4
    ORDER BY Username;
  `;
  
  return executeQuery(query);
}

// Dosya yükle
export async function uploadComplaintFile(complaintId: number, file: File) {
  const formData = new FormData()
  formData.append('file', file)
  
  const response = await fetch(`${API_BASE_URL}/complaints/${complaintId}/files`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    throw new Error('Dosya yüklenirken bir hata oluştu')
  }

  return await response.json()
}

// Dosya sil
export async function deleteComplaintFile(complaintId: number, fileId: number) {
  const response = await fetch(`${API_BASE_URL}/complaints/${complaintId}/files/${fileId}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error('Dosya silinirken bir hata oluştu')
  }
}

// Dosya indir
export async function downloadComplaintFile(complaintId: number, fileId: number) {
  const response = await fetch(`${API_BASE_URL}/complaints/${complaintId}/files/${fileId}/download`)

  if (!response.ok) {
    throw new Error('Dosya indirilirken bir hata oluştu')
  }

  return response.blob()
}
