'use server'

import sql from 'mssql'
import { promises as fs } from 'fs'
import path from 'path'

export async function testDatabaseConnection(connection: string) {
  let pool: sql.ConnectionPool | null = null
  
  try {
    // Parse connection string
    const match = connection.match(/mssql\+pyodbc:\/\/(.*?):(.*?)@(.*?),(.*?)\/(.*?)\?/)
    if (!match) {
      throw new Error("Geçersiz bağlantı dizesi formatı")
    }

    const [, username, password, server, port, database] = match
    const cleanServer = server.split('?')[0]

    const config: sql.config = {
      user: username,
      password: password,
      server: cleanServer,
      port: parseInt(port),
      database: database,
      options: {
        encrypt: true,
        trustServerCertificate: true,
        enableArithAbort: true
      }
    }

    pool = await new sql.ConnectionPool(config).connect()
    return { success: true, message: "Bağlantı başarılı" }
  } catch (error: any) {
    console.error("Connection error:", error)
    let errorMessage = "Bağlantı hatası"
    if (error.message) {
      errorMessage += ": " + error.message
    }
    if (error.code) {
      errorMessage += ` (Hata kodu: ${error.code})`
    }
    return { success: false, error: errorMessage }
  } finally {
    if (pool) {
      try {
        await pool.close()
      } catch (error) {
        console.error("Error closing connection:", error)
      }
    }
  }
}

export async function saveConnection(connectionString: string) {
  try {
    // First test the connection
    const result = await testDatabaseConnection(connectionString)
    if (!result.success) {
      return { success: false, message: result.error }
    }

    // If connection is successful, save to .env.local
    const envContent = `DATABASE_URL="${connectionString}"\n`
    await fs.writeFile('.env.local', envContent)

    return { success: true, message: 'Bağlantı bilgileri başarıyla kaydedildi.' }
  } catch (error) {
    console.error('Error saving connection:', error)
    return { success: false, message: 'Bağlantı bilgileri kaydedilirken hata oluştu.' }
  }
}

export async function showConnection() {
  try {
    const envPath = path.join(process.cwd(), ".env.local")
    let connection = ""

    try {
      const envContent = await fs.readFile(envPath, "utf-8")
      const match = envContent.match(/^DATABASE_URL="(.+)"$/m)
      if (match) {
        connection = match[1]
      }
    } catch (error) {
      // File doesn't exist
    }

    if (!connection) {
      return { success: false, error: "Kayıtlı bağlantı bilgisi bulunamadı" }
    }

    return { success: true, connection }
  } catch (error: any) {
    return { success: false, error: "Bağlantı bilgileri okunamadı: " + error.message }
  }
}

function parseConnectionString(connectionString: string) {
  const regex = /mssql\+pyodbc:\/\/([^:]+):([^@]+)@([^,]+),(\d+)\/([^?]+)/;
  const match = connectionString.match(regex);
  
  if (!match) {
    throw new Error('Invalid connection string format');
  }
  
  const [_, username, password, server, port, database] = match;
  
  return {
    user: username,
    password: password,
    server: server,
    port: parseInt(port),
    database: database,
    options: {
      encrypt: true,
      trustServerCertificate: true,
    }
  };
}

export async function executeQuery(query: string) {
  try {
    const config = parseConnectionString(process.env.DATABASE_URL!);
    const pool = await sql.connect(config);
    const result = await pool.request().query(query);
    await pool.close();
    
    return { 
      success: true, 
      data: result.recordset,
      rowsAffected: result.rowsAffected[0]
    };
  } catch (error: any) {
    console.error('Query execution error:', error);
    return { 
      success: false, 
      message: `Sorgu çalıştırılırken hata oluştu: ${error.message}` 
    };
  }
}

export async function getActiveBranchCount() {
  try {
    const result = await executeQuery(
      'select count(branchID) as count from efr_branchs where IsActive=1'
    );
    
    if (!result.success) {
      throw new Error(result.message);
    }
    
    return { 
      success: true, 
      count: result.data?.[0].count || 0
    };
  } catch (error: any) {
    console.error('Error getting branch count:', error);
    return { 
      success: false, 
      message: `Şube sayısı alınırken hata oluştu: ${error.message}`,
      count: 0
    };
  }
}

export async function getRecentInspections() {
  const sql = `
    SELECT TOP 20
      AuditId as No,
      AuditDate as 'Tarih',
      BranchName as 'Şube', 
      FormName as 'Form',
      BranchClass as 'Şube Sınıfı',
      BranchType as 'Şube Tipi',
      BranchKind as 'Şube Kategorisi',
      RegionalManager as 'Bölge Müdürü',
      ImageUrl as 'Resim Linki',
      CASE 
          WHEN ApproveStatus = 1 THEN 'Onaylandı'
          WHEN ApproveStatus = 0 THEN 'Onay Bekliyor'
          ELSE 'Belirsiz'
      END as 'Onay Durumu',
      CreatedUserName as 'Denetmen', 
      ISNULL(descriptions,'') as 'Açıklama', 
      Notes as 'Notlar',
      BranchManagers as 'Şube Yetkilileri' 
    FROM dbo.webBranchAuditRecords 
    ORDER BY auditdate DESC
  `

  try {
    const result = await executeQuery(sql)
    return { success: true, data: result.data }
  } catch (error: any) {
    return { success: false, message: error.message }
  }
}

export async function getRecentInspectionsOld(): Promise<{ success: boolean, data?: RecentInspection[], error?: string }> {
  try {
    const config = parseConnectionString(process.env.DATABASE_URL!);
    const pool = await sql.connect(config);
    const result = await pool.request()
      .query(`
        
 SELECT TOP 20 
          FormName as 'Form',
          AuditDate as 'Tarih',
          BranchName as 'Şube', 
          CreatedUserName as 'Denetmen', 
          ISNULL(descriptions,'') as 'Açıklama', 
          Notes as 'Notlar',
          BranchManagers as 'Şube Yetkilileri' 
        FROM dbo.webBranchAuditRecords 
        ORDER BY auditdate DESC
      `);
    await pool.close();
    
    return { 
      success: true, 
      data: result.recordset
    };
  } catch (error: any) {
    console.error('Error fetching recent inspections:', error);
    return { 
      success: false, 
      error: error.message || 'Son denetimler alınırken bir hata oluştu'
    };
  }
}

export async function getTotalInspectionCount(): Promise<{ success: boolean, count: number, message?: string }> {
  try {
    const result = await executeQuery(
      'SELECT COUNT(AuditID) as count FROM dbo.webBranchAuditRecords'
    );
    
    if (!result.success) {
      throw new Error(result.message);
    }
    
    return { 
      success: true, 
      count: result.data?.[0].count || 0
    };
  } catch (error: any) {
    console.error('Error getting total inspection count:', error);
    return { 
      success: false, 
      count: 0,
      message: `Toplam denetim sayısı alınırken hata oluştu: ${error.message}`
    };
  }
}

export async function getCurrentMonthInspectionCount(): Promise<{ success: boolean, count: number, message?: string }> {
  try {
    const result = await executeQuery(`
        SELECT COUNT(AuditID) as count 
      FROM dbo.webBranchAuditRecords 
      WHERE MONTH(AuditDate) = MONTH(GETDATE()) 
      AND YEAR(AuditDate) = YEAR(GETDATE())
    `);
    
    if (!result.success) {
      throw new Error(result.message);
    }
    
    return { 
      success: true, 
      count: result.data?.[0].count || 0
    };
  } catch (error: any) {
    console.error('Error getting current month inspection count:', error);
    return { 
      success: false, 
      count: 0,
      message: `Bu ayki denetim sayısı alınırken hata oluştu: ${error.message}`
    };
  }
}

export async function getCurrentWeekInspectionCount(): Promise<{ success: boolean, count: number, message?: string }> {
  try {
    const config = parseConnectionString(process.env.DATABASE_URL!);
    const pool = await sql.connect(config);
    const result = await pool.request()
      .query(`
        SELECT COUNT(AuditID) as count 
        FROM dbo.webBranchAuditRecords 
        WHERE AuditDate >= DATEADD(WEEK, DATEDIFF(WEEK, 0, GETDATE()), 0)
      `);
    await pool.close();
    
    return { 
      success: true, 
      count: result.recordset[0].count
    };
  } catch (error: any) {
    console.error('Error getting current week inspection count:', error);
    return { 
      success: false, 
      message: `Bu haftaki denetim sayısı alınırken hata oluştu: ${error.message}`,
      count: 0
    };
  }
}

export interface Notification {
  id: number;
  user: string;
  formName: string;
  location: string;
  date: string;
  time: string;
  rawDate: Date;
}

export async function getNotifications(): Promise<{ success: boolean, data?: Notification[], error?: string }> {
  try {
    const config = parseConnectionString(process.env.DATABASE_URL!);
    const pool = await sql.connect(config);
    const result = await pool.request()
      .query(`
        SELECT TOP 8
          AuditID as 'id',
          CreatedUserName as 'user',
          FormName as formName,
          BranchName as location,
          CONVERT(varchar, AuditDate, 103) as date,
          CONVERT(varchar, AuditDate, 108) as time,
          AuditDate as rawDate
        FROM dbo.webBranchAuditRecords 
        ORDER BY AuditDate DESC
      `);
    await pool.close();
  
    return { 
      success: true, 
      data: result.recordset
    };
  } catch (error: any) {
    console.error('Error fetching notifications:', error);
    return { 
      success: false, 
      error: error.message || 'Bildirimler alınırken bir hata oluştu'
    };
  }
}


export async function getMonthlyInspectionCounts(): Promise<{ success: boolean, data?: any[], error?: string }> {
  try {
    const config = parseConnectionString(process.env.DATABASE_URL!);
    const pool = await sql.connect(config);
    const result = await pool.request()
      .query(`
        SET LANGUAGE English;
        SELECT 
          DATENAME(MONTH, AuditDate) as Month,
          COUNT(AuditID) as DenetimSayisi
        FROM dbo.webBranchAuditRecords
        WHERE YEAR(AuditDate) = YEAR(GETDATE())
        GROUP BY MONTH(AuditDate), DATENAME(MONTH, AuditDate)
        ORDER BY MONTH(AuditDate)
      `);
    await pool.close();
    
    // Convert English month names to Turkish
    const monthMap: { [key: string]: string } = {
      'January': 'Ocak',
      'February': 'Şubat',
      'March': 'Mart',
      'April': 'Nisan',
      'May': 'Mayıs',
      'June': 'Haziran',
      'July': 'Temmuz',
      'August': 'Ağustos',
      'September': 'Eylül',
      'October': 'Ekim',
      'November': 'Kasım',
      'December': 'Aralık'
    };

    const data = result.recordset.map(record => ({
      Ay: monthMap[record.Month],
      DenetimSayisi: Number(record.DenetimSayisi)
    }));
    
    console.log('Monthly inspection data:', data);
    
    return { 
      success: true, 
      data
    };
  } catch (error: any) {
    console.error('Error fetching monthly inspection counts:', error);
    return { 
      success: false, 
      error: error.message || 'Aylık denetim sayıları alınırken bir hata oluştu'
    };
  }
}

export async function getFormDistribution(): Promise<{ success: boolean, data?: any[], error?: string }> {
  try {
    const config = parseConnectionString(process.env.DATABASE_URL!);
    const pool = await sql.connect(config);
    const result = await pool.request()
      .query(`
        SELECT COUNT(formID) as count,
        FormName 
        FROM webBranchAuditRecords 
        WHERE YEAR(AuditDate) = YEAR(GETDATE()) 
        GROUP BY FormName
      `);
    await pool.close();
    
    const data = result.recordset.map(record => ({
      form: record.FormName,
      count: Number(record.count)
    }));
    
    console.log('Form distribution data:', data);
    
    return { 
      success: true, 
      data
    };
  } catch (error: any) {
    console.error('Error fetching form distribution:', error);
    return { 
      success: false, 
      error: error.message || 'Form dağılımı alınırken bir hata oluştu'
    };
  }
}

export type InspectionHeader = {
  No: number
  Tarih: string
  Şube: string
  Form: string
  'Şube Sınıfı': string
  'Şube Tipi': string
  'Şube Kategorisi': string
  'Bölge Müdürü': string
  'Resim Linki': string
  'Onay Durumu': string
  Denetmen: string
  Açıklama: string
  Notlar: string
  'Şube Yetkilileri': string
}

export async function getInspectionHeader(auditId: number): Promise<{ success: boolean, data?: InspectionHeader, error?: string }> {
  try {
    const query = `
            SELECT TOP 1
      AuditId as No,
      AuditDate as 'Tarih',
      BranchName as 'Şube', 
      FormName as 'Form',
      BranchClass as 'Şube Sınıfı',
      BranchType as 'Şube Tipi',
      BranchKind as 'Şube Kategorisi',
      RegionalManager as 'Bölge Müdürü',
      ImageUrl as 'Resim Linki',
      CASE 
          WHEN ApproveStatus = 1 THEN 'Onaylandı'
          WHEN ApproveStatus = 0 THEN 'Onay Bekliyor'
          ELSE 'Belirsiz'
      END as 'Onay Durumu',
      CreatedUserName as 'Denetmen', 
      ISNULL(descriptions,'') as 'Açıklama', 
      Notes as 'Notlar',
      BranchManagers as 'Şube Yetkilileri' 
    FROM dbo.webBranchAuditRecords 

	where AuditID=@auditId
    ORDER BY auditdate DESC`

    const result = await executeQuery(query.replace('@auditId', auditId.toString()))
    
    if (!result.success || !result.data || result.data.length === 0) {
      return { success: false, error: "Denetim başlık bilgisi bulunamadı" }
    }

    return { success: true, data: result.data[0] as InspectionHeader }
  } catch (error) {
    console.error('Error fetching inspection header:', error)
    return { success: false, error: "Denetim başlık bilgisi getirilirken hata oluştu" }
  }
}

export async function getInspectionDetails(auditId: number) {
  try {
    const query = `
      select 
        AuditID as 'Denetim No',
        GroupName as "Soru Grubu",
        Question as Soru,
        OptionName As Yanıt,
        Score as Puan,
        Comments as Yorum,
        ImageUrl1 as Resim1,
        ImageUrl2 as Resim2,
        ImageUrl3 as Resim3,
        ImageUrl4 as Resim4
      from webBranchAuditRecordDetails 
      where AuditID = ${auditId}
      Order by groupdisplayIndex, questiondisplayIndex asc
    `
    const result = await executeQuery(query)
    
    if (!result.success) {
      throw new Error(result.error)
    }

    return { success: true, data: result.data }
  } catch (error: any) {
    console.error("Error fetching inspection details:", error)
    return { 
      success: false, 
      error: error.message || "Denetim detayları alınırken bir hata oluştu" 
    }
  }
}

export async function getAllInspectionIds(): Promise<{ success: boolean, data?: number[], error?: string }> {
  try {
    const query = `
      SELECT DISTINCT AuditId 
      FROM dbo.webBranchAuditRecords 
      ORDER BY AuditId DESC`

    const result = await executeQuery(query)
    
    if (!result.success || !result.data) {
      return { success: false, error: result.message || "Denetim numaraları bulunamadı" }
    }

    const ids = result.data.map(record => record.AuditId)
    return { success: true, data: ids }
  } catch (error) {
    console.error('Error fetching inspection IDs:', error)
    return { success: false, error: "Denetim numaraları getirilirken hata oluştu" }
  }
}
