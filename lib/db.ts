import sql from 'mssql'

function parseConnectionString(connectionString: string) {
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
    if (pool) {
      try {
        await pool.close()
        console.log("Connection closed")
      } catch (error) {
        console.error("Error closing connection:", error)
      }
    }
  }
}
