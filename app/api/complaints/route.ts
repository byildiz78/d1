import { NextResponse } from 'next/server'
import complaints from '@/jsons/complaints.json'

// Şikayet listesini getir
export async function GET() {
  try {
    return NextResponse.json(complaints.complaints)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// Yeni şikayet oluştur
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, description, branchId, customerId } = body
    
    const newComplaint = {
      id: complaints.complaints.length + 1,
      title,
      description,
      branchId,
      branchName: branchId === 1 ? "Kadıköy Şubesi" : "Beşiktaş Şubesi",
      customerId,
      customerName: "Yeni Müşteri",
      statusId: 1,
      statusName: "Yeni",
      createdAt: new Date().toISOString(),
      updatedAt: null,
      resolvedAt: null
    }
    
    complaints.complaints.push(newComplaint)
    
    return NextResponse.json(newComplaint)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// Şikayet durumunu güncelle
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, statusId } = body
    
    const complaint = complaints.complaints.find(c => c.id === id)
    if (!complaint) {
      return NextResponse.json({ error: "Şikayet bulunamadı" }, { status: 404 })
    }
    
    const status = complaints.statuses.find(s => s.id === statusId)
    if (!status) {
      return NextResponse.json({ error: "Durum bulunamadı" }, { status: 404 })
    }
    
    complaint.statusId = statusId
    complaint.statusName = status.name
    complaint.updatedAt = new Date().toISOString()
    
    if (statusId === 3) { // Çözümlendi
      complaint.resolvedAt = new Date().toISOString()
    }
    
    return NextResponse.json(complaint)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
