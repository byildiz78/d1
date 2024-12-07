import { getInspectionDetails } from "@/app/actions/database"
import { NextResponse } from "next/server"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const result = await getInspectionDetails(parseInt(params.id))
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 404 }
      )
    }

    return NextResponse.json({ data: result.data })
  } catch (error) {
    console.error('Error in details API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
