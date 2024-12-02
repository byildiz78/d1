import sql from 'mssql'

// Configuration type
interface DatabaseConfig {
  user: string
  password: string
  server: string
  port: number
  database: string
  options: {
    encrypt: boolean
    trustServerCertificate: boolean
    enableArithAbort: boolean
  }
}

// Singleton connection pool
let globalPool: sql.ConnectionPool | null = null

async function getConnectionPool(config: DatabaseConfig): Promise<sql.ConnectionPool> {
  if (globalPool) {
    return globalPool
  }

  try {
    globalPool = await new sql.ConnectionPool(config).connect()
    return globalPool
  } catch (error) {
    console.error('Failed to create connection pool:', error)
    throw error
  }
}

function parseConnectionString(connectionString: string): DatabaseConfig {
  try {
    // Parse mssql+pyodbc://username:password@server\instance,port/database?params format
    const match = connectionString.match(/mssql\+pyodbc:\/\/(.*?):(.*?)@(.*?),(.*?)\/(.*?)\?/)
    if (!match) {
      throw new Error("Geçersiz bağlantı dizesi formatı")
    }

    const [, username, password, server, port, database] = match
    
    // Remove any trailing parameters
    const cleanServer = server.split('?')[0]

    return {
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
  } catch (error: any) {
    throw new Error(`Bağlantı dizesi ayrıştırma hatası: ${error.message}`)
  }
}

export async function testDatabaseConnection(connectionString: string) {
  let pool: sql.ConnectionPool | null = null
  
  try {
    console.log("Parsing connection string...")
    const config = parseConnectionString(connectionString)
    console.log("Parsed config:", {
      ...config,
      password: '***'
    })

    console.log("Creating connection pool...")
    pool = await new sql.ConnectionPool(config).connect()
    console.log("Connection successful")
    
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
    if (pool && pool !== globalPool) {
      try {
        await pool.close()
        console.log("Connection closed")
      } catch (error) {
        console.error("Error closing connection:", error)
      }
    }
  }
}

export async function executeQuery<T = any>(query: string): Promise<{ 
  success: boolean
  data?: T[]
  error?: string
  rowsAffected?: number
}> {
  if (!process.env.DATABASE_URL) {
    return { 
      success: false, 
      error: "Veritabanı bağlantı bilgileri bulunamadı" 
    }
  }

  try {
    const config = parseConnectionString(process.env.DATABASE_URL)
    const pool = await getConnectionPool(config)
    const result = await pool.request().query(query)
    
    return { 
      success: true, 
      data: result.recordset,
      rowsAffected: result.rowsAffected[0]
    }
  } catch (error: any) {
    console.error('Query execution error:', error)
    return { 
      success: false, 
      error: `Sorgu çalıştırılırken hata oluştu: ${error.message}` 
    }
  }
}

// Cleanup function to close the global pool
export async function closeConnection() {
  if (globalPool) {
    try {
      await globalPool.close()
      globalPool = null
    } catch (error) {
      console.error('Error closing global connection pool:', error)
    }
  }
}

// Process cleanup
if (typeof process !== 'undefined') {
  process.on('SIGTERM', closeConnection)
  process.on('SIGINT', closeConnection)
}