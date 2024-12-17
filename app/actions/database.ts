'use server'

import { executeQuery as apiExecuteQuery } from '@/lib/api-client';

// Tip tanımlamaları
type ApiResponse = {
  success: boolean;
  data?: any;
  message?: string;
  rowsAffected?: number[];
};

type QueryResult = {
  success: boolean;
  data?: any;
  error?: string;
  message?: string;
  rowsAffected?: number[];
};

export async function testDatabaseConnection(connection: string): Promise<{ success: boolean, message: string }> {
  try {
    const result = await apiExecuteQuery('SELECT 1 as test', { connectionString: connection });
    
    return { 
      success: true, 
      message: "Bağlantı başarılı" 
    };
  } catch (error: any) {
    console.error('Error testing database connection:', error);
    return { 
      success: false, 
      message: `Bağlantı hatası: ${error.message}` 
    };
  }
}

export async function saveConnection(connectionString: string): Promise<{ success: boolean, message: string }> {
  try {
    // First test the connection
    const result = await testDatabaseConnection(connectionString)
    if (!result.success) {
      return { success: false, message: result.message }
    }

    // If connection is successful, save to .env.local
    const envContent = `DATABASE_URL="${connectionString}"\n`
    // await fs.writeFile('.env.local', envContent)

    return { success: true, message: 'Bağlantı bilgileri başarıyla kaydedildi.' }
  } catch (error) {
    console.error('Error saving connection:', error)
    return { success: false, message: 'Bağlantı bilgileri kaydedilirken hata oluştu.' }
  }
}

export async function showConnection(): Promise<{ success: boolean, connection?: string, error?: string }> {
  try {
    // const envPath = path.join(process.cwd(), ".env.local")
    let connection = ""

    // try {
    //   const envContent = await fs.readFile(envPath, 'utf8')
    //   const match = envContent.match(/DATABASE_URL=(.+)/)
    //   if (match) {
    //     connection = match[1]
    //   }
    // } catch (error) {
    //   // File doesn't exist or can't be read
    //   console.error("Error reading .env.local:", error)
    // }

    // if (!connection) {
    //   return { success: false, error: "Kayıtlı bağlantı bilgisi bulunamadı" }
    // }

    return { success: true, connection }
  } catch (error: any) {
    console.error("Error showing connection:", error)
    return { success: false, error: "Bağlantı bilgileri okunamadı: " + error.message }
  }
}

async function executeQuery(query: string, params?: any): Promise<QueryResult> {
  const result = await apiExecuteQuery(query, params) as ApiResponse;
  return {
    success: result.success,
    data: result.data,
    error: result.message,
    rowsAffected: result.rowsAffected
  };
}

export async function getActiveBranchCount(): Promise<{ success: boolean, count: number, message?: string }> {
  try {
    const result = await executeQuery(
      'select count(branchID) as count from efr_branchs where IsActive=1'
    );
    
    if (!result.success) {
      throw new Error(result.error);
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

interface RecentInspection {
  No: number;
  Tarih: string;
  Şube: string;
  Form: string;
  'Şube Sınıfı': string;
  'Şube Tipi': string;
  'Şube Kategorisi': string;
  'Bölge Müdürü': string;
  'Resim Linki': string;
  'Onay Durumu': string;
  Denetmen: string;
  Açıklama: string;
  Notlar: string;
  'Şube Yetkilileri': string;
}

export async function getRecentInspections(): Promise<{ success: boolean, data?: RecentInspection[], message?: string }> {
  const sql = `
    SELECT TOP 20
      AuditId as No,
      CreationDate as 'Tarih',
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
    ORDER BY CreationDate DESC
  `

  try {
    const result = await executeQuery(sql);
    
    if (!result.success) {
      throw new Error(result.error);
    }
    
    return { 
      success: true, 
      data: result.data as RecentInspection[] 
    };
  } catch (error: any) {
    console.error('Error getting recent inspections:', error);
    return { 
      success: false, 
      message: `Son denetimler alınırken hata oluştu: ${error.message}`
    };
  }
}

export async function getTotalInspectionCount(): Promise<{ success: boolean, count: number, message?: string }> {
  try {
    const result = await executeQuery(
      'SELECT COUNT(AuditID) as count FROM dbo.webBranchAuditRecords'
    );
    
    if (!result.success) {
      throw new Error(result.error);
    }
    
    return { 
      success: true, 
      count: result.data?.[0]?.count ?? 0
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
      WHERE MONTH(CreationDate) = MONTH(GETDATE()) 
      AND YEAR(CreationDate) = YEAR(GETDATE())
    `);
    
    if (!result.success) {
      throw new Error(result.error);
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
    const result = await executeQuery(`
      SELECT COUNT(AuditID) as count 
      FROM dbo.webBranchAuditRecords 
      WHERE CreationDate >= DATEADD(WEEK, DATEDIFF(WEEK, 0, GETDATE()), 0)
    `);
    
    if (!result.success) {
      throw new Error(result.error);
    }
    
    return { 
      success: true, 
      count: result.data?.[0].count || 0
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
    const result = await executeQuery(`
      SELECT TOP 8
        AuditID as 'id',
        CreatedUserName as 'user',
        FormName as formName,
        BranchName as location,
        CONVERT(varchar, CreationDate, 103) as date,
        CONVERT(varchar, CreationDate, 108) as time,
        CreationDate as rawDate
      FROM dbo.webBranchAuditRecords 
      ORDER BY CreationDate DESC
    `);

    if (!result.success) {
      throw new Error(result.error);
    }
  
    return { 
      success: true, 
      data: result.data as Notification[]
    };
  } catch (error: any) {
    console.error('Error fetching notifications:', error);
    return { 
      success: false, 
      error: error.message || 'Bildirimler alınırken bir hata oluştu'
    };
  }
}

interface MonthlyInspection {
  Ay: string;
  DenetimSayisi: number;
}

export async function getMonthlyInspectionCounts(): Promise<{ success: boolean, data?: MonthlyInspection[], error?: string }> {
  try {
    const query = `
      SELECT 
        FORMAT(CreationDate, 'MMMM yyyy', 'tr-TR') as Ay,
        COUNT(*) as DenetimSayisi
      FROM webBranchAuditRecords
      WHERE YEAR(CreationDate) = 2024
      GROUP BY FORMAT(CreationDate, 'MMMM yyyy', 'tr-TR'), YEAR(CreationDate), MONTH(CreationDate)
      ORDER BY YEAR(CreationDate) DESC, MONTH(CreationDate) DESC
    `;

    const result = await executeQuery(query);
    
    if (!result.success || !result.data) {
      return { 
        success: false, 
        error: result.error || "Aylık denetim sayıları bulunamadı" 
      };
    }

    const data = result.data.map((record: { Ay: string; DenetimSayisi: number }) => ({
      Ay: record.Ay,
      DenetimSayisi: Number(record.DenetimSayisi)
    }));
    
    return { success: true, data };
  } catch (error: any) {
    console.error('Error fetching monthly inspection counts:', error);
    return { 
      success: false, 
      error: error.message || "Aylık denetim sayıları alınırken hata oluştu" 
    };
  }
}

interface FormDistribution {
  form: string;
  count: number;
}

export async function getFormDistribution(): Promise<{ success: boolean, data?: FormDistribution[], error?: string }> {
  try {
    const query = `
      SELECT COUNT(formID) as count,
      FormName 
      FROM webBranchAuditRecords 
      WHERE YEAR(CreationDate) = YEAR(GETDATE()) 
      GROUP BY FormName
    `;

    const result = await executeQuery(query);
    
    if (!result.success || !result.data) {
      return { 
        success: false, 
        error: result.error || "Form dağılımı bulunamadı" 
      };
    }

    const data = result.data.map((record: { FormName: string; count: number }) => ({
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
      error: error.message || "Form dağılımı alınırken bir hata oluştu" 
    };
  }
}

interface InspectionHeader {
  No: number;
  Tarih: string;
  Şube: string;
  Form: string;
  'Şube Sınıfı': string;
  'Şube Tipi': string;
  'Şube Kategorisi': string;
  'Bölge Müdürü': string;
  'Resim Linki': string;
  'Onay Durumu': 'Onaylandı' | 'Onay Bekliyor' | 'Belirsiz';
  Denetmen: string;
  Açıklama: string;
  Notlar: string;
  'Şube Yetkilileri': string;
}

export async function getInspectionHeader(auditId: number): Promise<{ success: boolean, data?: InspectionHeader, error?: string }> {
  try {
    const query = `
      SELECT TOP 1
        AuditId as No,
        CreationDate as 'Tarih',
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
      WHERE AuditID = ${auditId}
      ORDER BY CreationDate DESC
    `;

    const result = await executeQuery(query);
    
    if (!result.success || !result.data || result.data.length === 0) {
      return { success: false, error: "Denetim başlık bilgisi bulunamadı" };
    }

    return { success: true, data: result.data[0] as InspectionHeader };
  } catch (error) {
    console.error('Error fetching inspection header:', error);
    return { success: false, error: "Denetim başlık bilgisi getirilirken hata oluştu" };
  }
}

interface InspectionDetail {
  'Denetim No': number;
  'Soru Grubu': string;
  'Soru': string;
  'Yanıt': string;
  'Puan': number;
  'Yorum': string;
  'Resim1': string | null;
  'Resim2': string | null;
  'Resim3': string | null;
  'Resim4': string | null;
}

export async function getInspectionDetails(auditId: number): Promise<{ success: boolean, data?: InspectionDetail[], error?: string }> {
  try {
    const query = `
      SELECT 
        AuditID as 'Denetim No',
        GroupName as 'Soru Grubu',
        Question as 'Soru',
        OptionName As 'Yanıt',
        Score as 'Puan',
        Comments as 'Yorum',
        ImageUrl1 as 'Resim1',
        ImageUrl2 as 'Resim2',
        ImageUrl3 as 'Resim3',
        ImageUrl4 as 'Resim4'
      FROM webBranchAuditRecordDetails 
      WHERE AuditID = ${auditId}
      ORDER BY groupdisplayIndex, questiondisplayIndex ASC
    `;

    const result = await executeQuery(query);
    
    if (!result.success || !result.data) {
      return { 
        success: false, 
        error: result.error || "Denetim detayları bulunamadı" 
      };
    }

    return { 
      success: true, 
      data: result.data as InspectionDetail[] 
    };
  } catch (error: any) {
    console.error("Error fetching inspection details:", error);
    return { 
      success: false, 
      error: error.message || "Denetim detayları alınırken bir hata oluştu" 
    };
  }
}

export async function getAllInspectionIds(): Promise<{ success: boolean, data?: number[], error?: string }> {
  try {
    const query = `
      SELECT DISTINCT AuditId 
      FROM dbo.webBranchAuditRecords 
      ORDER BY AuditId DESC
    `;

    const result = await executeQuery(query);
    
    if (!result.success || !result.data) {
      return { 
        success: false, 
        error: result.error || "Denetim numaraları bulunamadı" 
      };
    }

    const ids = result.data.map((record: { AuditId: number }) => record.AuditId);
    return { 
      success: true, 
      data: ids 
    };
  } catch (error: any) {
    console.error('Error fetching inspection IDs:', error);
    return { 
      success: false, 
      error: error.message || "Denetim numaraları getirilirken hata oluştu" 
    };
  }
}

interface InspectionReport {
  'Şube': string;
  'Bölge': string;
  'Şube Sınıfı': string;
  'Şube Tipi': string;
  'Şube Kategorisi': string;
  'Denetim Sayısı': number;
  'Ortalama Puan': number;
  'En Düşük Puan': number;
  'En Yüksek Puan': number;
  'Son Denetim Tarihi': string;
}

export async function getInspectionReport(): Promise<{ success: boolean, data?: InspectionReport[], error?: string }> {
  try {
    const query = `
      WITH InspectionScores AS (
        SELECT 
          BranchName,
          RegionalManager,
          BranchClass,
          BranchType,
          BranchKind,
          CreationDate,
          CAST(AVG(CAST(Score AS FLOAT)) AS DECIMAL(10,2)) as Score
        FROM webBranchAuditRecords
        GROUP BY AuditID, BranchName, RegionalManager, BranchClass, BranchType, BranchKind, CreationDate
      )
      SELECT 
        BranchName as 'Şube',
        RegionalManager as 'Bölge',
        BranchClass as 'Şube Sınıfı',
        BranchType as 'Şube Tipi',
        BranchKind as 'Şube Kategorisi',
        COUNT(*) as 'Denetim Sayısı',
        CAST(AVG(Score) AS DECIMAL(10,2)) as 'Ortalama Puan',
        CAST(MIN(Score) AS DECIMAL(10,2)) as 'En Düşük Puan',
        CAST(MAX(Score) AS DECIMAL(10,2)) as 'En Yüksek Puan',
        MAX(CreationDate) as 'Son Denetim Tarihi'
      FROM InspectionScores
      GROUP BY BranchName, RegionalManager, BranchClass, BranchType, BranchKind
      ORDER BY BranchName
    `;

    const result = await executeQuery(query);
    
    if (!result.success || !result.data) {
      return { 
        success: false, 
        error: result.error || "Denetim raporu bulunamadı" 
      };
    }

    return { 
      success: true, 
      data: result.data as InspectionReport[] 
    };
  } catch (error: any) {
    console.error('Error generating inspection report:', error);
    return { 
      success: false, 
      error: error.message || "Denetim raporu oluşturulurken hata oluştu" 
    };
  }
}

export async function testApiConnection(apiUrl: string, apiToken: string): Promise<{ success: boolean, message: string }> {
  try {
    const response = await fetch(`${apiUrl}/api/3/query`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        query: 'SELECT 1 as test'
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || `API error: ${response.status}`);
    }

    return { 
      success: true, 
      message: "API bağlantısı başarılı" 
    };
  } catch (error: any) {
    console.error('Error testing API connection:', error);
    return { 
      success: false, 
      message: `API bağlantı hatası: ${error.message}` 
    };
  }
}
