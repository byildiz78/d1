"use client"

import { use } from "react"
import { cn } from "@/lib/utils"
import { ComplaintHeader } from "../components/ComplaintHeader"
import { ComplaintForm } from "../components/ComplaintForm"

// Mock data for the existing complaint
const existingComplaint = {
  id: 1,
  title: "Sipariş Gecikmesi",
  description: "Siparişim 2 saat geçmesine rağmen hala teslim edilmedi.",
  branch: "kadikoy",
  source: "website",
  status: "open",
  priority: "high",
  assignedTo: "1", // Manager ID
  observers: ["1", "2"], // Observer IDs
  customerName: "Mehmet Demir",
  customerContact: "mehmet.demir@email.com",
  customerPhone: "+90 532 123 4567",
  orderNumber: "ORD-2024-1234",
  history: [
    {
      id: 1,
      type: "edit",
      field: "status",
      oldValue: "pending",
      newValue: "open",
      user: "Ahmet Yılmaz",
      timestamp: "2024-03-21T14:30:00"
    },
    {
      id: 2,
      type: "edit",
      field: "priority",
      oldValue: "medium",
      newValue: "high",
      user: "Mehmet Demir",
      timestamp: "2024-03-21T14:35:00"
    },
    {
      id: 3,
      type: "comment",
      content: "Müşteriyle iletişime geçildi",
      user: "Zeynep Kaya",
      timestamp: "2024-03-21T14:40:00"
    }
  ]
}

export default function EditComplaintPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)

  return (
    <div className="flex-1 space-y-8 p-8 bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-900 dark:to-gray-800/50">
      <ComplaintHeader id={resolvedParams.id} />
      <ComplaintForm id={resolvedParams.id} initialData={existingComplaint} />
    </div>
  )
}