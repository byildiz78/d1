import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import dotenv from 'dotenv'

export async function GET() {
  try {
    const envPath = path.join(process.cwd(), '.env.local')
    const envContent = await fs.readFile(envPath, 'utf-8')
    const env = dotenv.parse(envContent)
    
    return NextResponse.json({
      success: true,
      apiUrl: env.API_URL,
      apiToken: env.API_TOKEN,
    })
  } catch (error: any) {
    console.error('Error loading API settings:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const { apiUrl, apiToken } = await req.json()
    const envContent = `API_URL=${apiUrl}\nAPI_TOKEN=${apiToken}`
    const envPath = path.join(process.cwd(), '.env.local')
    
    await fs.writeFile(envPath, envContent)
    
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error saving API settings:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
