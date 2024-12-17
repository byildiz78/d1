import { NextResponse } from 'next/server'
import { getNotifications } from '@/app/actions/database'

export async function GET() {
  try {
    const result = await getNotifications()
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error }, 
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      data: result.data 
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message }, 
      { status: 500 }
    )
  }
}
