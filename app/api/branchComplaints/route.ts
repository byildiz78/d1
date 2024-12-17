import { NextResponse } from 'next/server'

// Örnek veri - gerçek uygulamada veritabanından gelecek
const branchComplaints = {
  complaints: [
    {
      id: '1',
      title: 'Tedarikçi teslimat gecikmesi',
      description: 'Son üç siparişte teslimat gecikmesi yaşandı',
      branchId: '1',
      branchName: 'Kadıköy Şubesi',
      source: 'supplier',
      priority: 'high',
      status: 'open',
      assignedTo: 'user1',
      observers: ['user2', 'user3'],
      files: [],
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z',
    }
  ],
  statuses: [
    { id: 1, name: 'open', label: 'Açık' },
    { id: 2, name: 'in_progress', label: 'İşlemde' },
    { id: 3, name: 'pending', label: 'Beklemede' },
    { id: 4, name: 'resolved', label: 'Çözümlendi' },
  ]
}

export async function GET() {
  return NextResponse.json(branchComplaints)
}

// Yeni şikayet oluştur
export async function POST(request: Request) {
  try {
    const complaint = await request.json()
    // Veritabanına kaydet
    return NextResponse.json(complaint)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// Şikayet durumunu güncelle
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, statusId } = body
    
    const complaint = branchComplaints.complaints.find(c => c.id === id)
    if (!complaint) {
      return NextResponse.json({ error: "Şikayet bulunamadı" }, { status: 404 })
    }
    
    const status = branchComplaints.statuses.find(s => s.id === statusId)
    if (!status) {
      return NextResponse.json({ error: "Durum bulunamadı" }, { status: 404 })
    }
    
    complaint.status = status.name
    complaint.updatedAt = new Date().toISOString()
    
    if (statusId === 4) { // Çözümlendi
      complaint.resolvedAt = new Date().toISOString()
    }
    
    return NextResponse.json(complaint)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
