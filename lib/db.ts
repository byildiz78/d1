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
let isConnecting = false
let connectionPromise: Promise<sql.ConnectionPool> | null = null
let lastConnectionError: Error | null = null
let lastErrorTime: number = 0
const ERROR_THRESHOLD = 5000 // 5 seconds

async function getConnectionPool(config: DatabaseConfig): Promise<sql.ConnectionPool> {
  const now = Date.now()

  // If there was a recent error, throw it instead of trying again too quickly
  if (lastConnectionError && (now - lastErrorTime) < ERROR_THRESHOLD) {
    throw lastConnectionError
  }

  // If we already have a pool and it's connected, return it
  if (globalPool?.connected) {
    return globalPool
  }

  // If we're in the process of connecting, wait for it
  if (isConnecting && connectionPromise) {
    return connectionPromise
  }

  // Reset error state since we're trying a new connection
  lastConnectionError = null
  lastErrorTime = 0

  try {
    isConnecting = true
    connectionPromise = new sql.ConnectionPool(config)
      .connect()
      .then(pool => {
        console.log('New database connection pool created')
        
        // Handle pool errors
        pool.on('error', err => {
          console.error('Database pool error:', err)
          lastConnectionError = err
          lastErrorTime = Date.now()
          globalPool = null
        })

        // Set max listeners to prevent memory leak warning
        pool.setMaxListeners(15)
        
        return pool
      })

    globalPool = await connectionPromise
    return globalPool
  } catch (error: any) {
    console.error('Failed to create connection pool:', error)
    lastConnectionError = error
    lastErrorTime = Date.now()
    throw error
  } finally {
    isConnecting = false
    connectionPromise = null
  }
}

// Helper function to get a connection with retry logic
async function getConnection(retries = 3, delay = 1000): Promise<sql.ConnectionPool> {
  if (!process.env.DATABASE_URL) {
    throw new Error("Database connection string not found")
  }

  const config = parseConnectionString(process.env.DATABASE_URL)
  
  for (let i = 0; i < retries; i++) {
    try {
      return await getConnectionPool(config)
    } catch (error) {
      if (i === retries - 1) throw error
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }

  throw new Error("Failed to establish database connection after retries")
}

// Helper function to safely execute queries with connection management
async function executeQuerySafe<T>(queryFn: (pool: sql.ConnectionPool) => Promise<T>): Promise<T> {
  const pool = await getConnection()
  try {
    return await queryFn(pool)
  } catch (error) {
    if (globalPool) {
      try {
        await globalPool.close()
      } catch (closeError) {
        console.error('Error closing pool after error:', closeError)
      }
      globalPool = null
    }
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
  return executeQuerySafe(async pool => {
    const result = await pool.request().query(query)
    
    return { 
      success: true, 
      data: result.recordset,
      rowsAffected: result.rowsAffected[0]
    }
  })
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