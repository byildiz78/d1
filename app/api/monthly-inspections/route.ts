import { NextResponse } from 'next/server'
import { getMonthlyInspectionCounts } from '@/app/actions/database'

export const dynamic = 'force-dynamic'
export const revalidate = 300 // revalidate every 5 minutes

export async function GET() {
  try {
    const result = await getMonthlyInspectionCounts()
    
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
