"use client"

import { use } from "react"
import { BranchComplaintForm } from "../components/BranchComplaintForm"
import { BranchComplaintHeader } from "../components/BranchComplaintHeader"

// Örnek veri
const existingComplaint = {
  id: "1",
  title: "Tedarikçi teslimat gecikmesi",
  description: "Son üç siparişte teslimat gecikmesi yaşandı. Bu durum müşteri memnuniyetini olumsuz etkiliyor.",
  branchName: "Kadıköy Şubesi",
  source: "supplier",
  priority: "high",
  status: "open",
  assignedTo: "1", // Manager ID
  observers: ["2", "3"], // Observer IDs
  createdAt: "2024-01-15T10:00:00Z",
  updatedAt: "2024-01-15T10:00:00Z",
  timeline: [
    {
      id: "1",
      type: "status",
      content: "Şikayet oluşturuldu",
      author: "Sistem",
      createdAt: "2024-01-15T10:00:00Z",
    },
    {
      id: "2",
      type: "comment",
      content: "Tedarikçi ile görüşme yapıldı, teslimat süreçleri gözden geçirilecek.",
      author: "Ali Yılmaz",
      createdAt: "2024-01-15T11:30:00Z",
    },
  ],
  files: [],
}

export default function EditBranchComplaintPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)

  return (
    <div className="flex-1 space-y-8 p-8 bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-900 dark:to-gray-800/50">
      <BranchComplaintHeader id={resolvedParams.id} />
      <BranchComplaintForm id={resolvedParams.id} initialData={existingComplaint} />
    </div>
  )
}
