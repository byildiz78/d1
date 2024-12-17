import { NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import { testDatabaseConnection } from "@/lib/db"

// Mark this route as dynamic
export const dynamic = "force-dynamic"
// Prevent static optimization
export const fetchCache = "force-no-store"

export async function POST(req: NextRequest) {
  console.log("=== Database API Request ===")
  console.log("Request headers:", Object.fromEntries(req.headers.entries()))
  console.log("Request method:", req.method)
  console.log("Request URL:", req.url)
  
  try {
    // Parse the request body
    let body
    try {
      const text = await req.text()
      console.log("Raw request body:", text)
      
      try {
        body = JSON.parse(text)
        console.log("Parsed request body:", {
          ...body,
          connection: body.connection ? body.connection.replace(/:(.*?)@/, ':***@') : undefined
        })
      } catch (jsonError) {
        console.error("JSON parse error:", jsonError)
        return new NextResponse(
          JSON.stringify({ error: "Invalid JSON in request body" }),
          { 
            status: 400,
            headers: { "Content-Type": "application/json" }
          }
        )
      }
    } catch (bodyError) {
      console.error("Body read error:", bodyError)
      return new NextResponse(
        JSON.stringify({ error: "Failed to read request body" }),
        { 
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      )
    }

    if (!body || typeof body !== "object") {
      console.error("Invalid body format:", body)
      return new NextResponse(
        JSON.stringify({ error: "Request body must be a JSON object" }),
        { 
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      )
    }

    const { action, connection } = body

    if (!action) {
      console.error("Missing action in request")
      return new NextResponse(
        JSON.stringify({ error: "Action is required" }),
        { 
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      )
    }

    console.log("Processing action:", action)

    try {
      switch (action) {
        case "test":
          if (!connection) {
            console.error("Missing connection string")
            return new NextResponse(
              JSON.stringify({ error: "Connection string is required" }),
              { 
                status: 400,
                headers: { "Content-Type": "application/json" }
              }
            )
          }
          const result = await testDatabaseConnection(connection)
          console.log("Test connection result:", result)
          
          if (result.success) {
            return new NextResponse(
              JSON.stringify({ message: result.message }),
              { 
                status: 200,
                headers: { "Content-Type": "application/json" }
              }
            )
          } else {
            return new NextResponse(
              JSON.stringify({ error: result.error }),
              { 
                status: 400,
                headers: { "Content-Type": "application/json" }
              }
            )
          }

        case "save":
          if (!connection) {
            return new NextResponse(
              JSON.stringify({ error: "Connection string is required" }),
              { 
                status: 400,
                headers: { "Content-Type": "application/json" }
              }
            )
          }
          return await saveConnection(connection)

        case "show":
          return await showConnection()

        default:
          console.error("Invalid action:", action)
          return new NextResponse(
            JSON.stringify({ error: "Invalid action: " + action }),
            { 
              status: 400,
              headers: { "Content-Type": "application/json" }
            }
          )
      }
    } catch (actionError: any) {
      console.error("Error processing action:", actionError)
      return new NextResponse(
        JSON.stringify({ error: "Error processing action: " + actionError.message }),
        { 
          status: 500,
          headers: { "Content-Type": "application/json" }
        }
      )
    }
  } catch (error: any) {
    console.error("Unexpected error in API route:", error)
    return new NextResponse(
      JSON.stringify({ error: "Sunucu hatası: " + error.message }),
      { 
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    )
  }
}

async function saveConnection(connection: string) {
  try {
    const envPath = path.join(process.cwd(), ".env.local")
    let envContent = ""
    
    try {
      envContent = await fs.readFile(envPath, "utf-8")
    } catch (error) {
      // File doesn't exist, start with empty content
    }

    // Parse existing content
    const envLines = envContent.split("\n").filter(line => !line.startsWith("DATABASE_URL="))
    
    // Add new connection
    envLines.push(`DATABASE_URL="${connection}"`)
    
    // Write back to file
    await fs.writeFile(envPath, envLines.join("\n") + "\n")

    return new NextResponse(
      JSON.stringify({ message: "Bağlantı bilgileri kaydedildi" }),
      { 
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    )
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({ error: "Kaydetme hatası: " + error.message }),
      { 
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    )
  }
}

async function showConnection() {
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
      return new NextResponse(
        JSON.stringify({ error: "Kayıtlı bağlantı bilgisi bulunamadı" }),
        { 
          status: 404,
          headers: { "Content-Type": "application/json" }
        }
      )
    }

    return new NextResponse(
      JSON.stringify({ connection }),
      { 
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    )
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({ error: "Bağlantı bilgileri okunamadı: " + error.message }),
      { 
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    )
  }
}
