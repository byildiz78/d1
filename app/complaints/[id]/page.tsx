"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { ComplaintSourceBadge } from "../components/complaint-source"
import { 
  MessageCircle, 
  Clock, 
  Calendar,
  Building2,
  User,
  CheckCircle2,
  AlertCircle,
  Send
} from "lucide-react"
import { cn } from "@/lib/utils"

// Mock data
const complaint = {
  id: 1,
  title: "Sipariş Gecikmesi",
  description: "Siparişim 2 saat geçmesine rağmen hala teslim edilmedi.",
  branch: "Kadıköy Şubesi",
  source: "website",
  status: "open",
  priority: "high",
  createdAt: "2024-03-20T10:30:00",
  resolvedAt: null,
  lastActionAt: "2024-03-21T15:45:00",
  assignedTo: "Ahmet Yılmaz",
  timeline: [
    {
      id: 1,
      type: "comment",
      content: "Müşteriyle iletişime geçildi, özür dilendi.",
      user: "Ahmet Yılmaz",
      timestamp: "2024-03-20T11:00:00"
    },
    {
      id: 2,
      type: "action",
      content: "Şubeye bildirim gönderildi.",
      user: "Sistem",
      timestamp: "2024-03-20T11:05:00"
    },
    {
      id: 3,
      type: "comment",
      content: "Şube durumu inceliyor.",
      user: "Mehmet Demir",
      timestamp: "2024-03-20T11:30:00"
    }
  ]
}

export default function ComplaintDetailPage({ params }: { params: { id: string } }) {
  const [newComment, setNewComment] = useState("")

  return (
    <div className="flex-1 space-y-6 p-8">
      {/* Header Card */}
      <Card className="p-6">
        <div className="flex flex-col gap-6">
          {/* Title and Status */}
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold">#{params.id} - {complaint.title}</h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Oluşturulma: {new Date(complaint.createdAt).toLocaleString('tr-TR')}</span>
                <Clock className="h-4 w-4 ml-2" />
                <span>Son Güncelleme: {new Date(complaint.lastActionAt).toLocaleString('tr-TR')}</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge
                variant={complaint.status === "open" ? "destructive" : "success"}
                className="px-4 py-1"
              >
                {complaint.status === "open" ? "Açık" : "Çözümlendi"}
              </Badge>
              <Badge
                variant={
                  complaint.priority === "high"
                    ? "destructive"
                    : complaint.priority === "medium"
                    ? "warning"
                    : "default"
                }
                className="px-4 py-1"
              >
                {complaint.priority === "high"
                  ? "Yüksek"
                  : complaint.priority === "medium"
                  ? "Orta"
                  : "Düşük"}
              </Badge>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-4 bg-blue-50/50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                  <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Şube</p>
                  <p className="text-sm">{complaint.branch}</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-purple-50/50 dark:bg-purple-950/50 border-purple-200 dark:border-purple-800">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900">
                  <MessageCircle className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Kaynak</p>
                  <ComplaintSourceBadge source={complaint.source as any} />
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-green-50/50 dark:bg-green-950/50 border-green-200 dark:border-green-800">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900">
                  <User className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">Atanan</p>
                  <p className="text-sm">{complaint.assignedTo}</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-amber-50/50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900">
                  {complaint.status === "open" ? (
                    <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  ) : (
                    <CheckCircle2 className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-amber-600 dark:text-amber-400">Durum</p>
                  <p className="text-sm">
                    {complaint.status === "open" ? "Açık" : "Çözümlendi"}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Description */}
          <Card className="p-4 bg-gray-50/50 dark:bg-gray-900/50">
            <p className="text-sm whitespace-pre-wrap">{complaint.description}</p>
          </Card>
        </div>
      </Card>

      {/* Timeline */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Zaman Çizelgesi</h3>
        <div className="space-y-4">
          {complaint.timeline.map((item) => (
            <div
              key={item.id}
              className={cn(
                "flex gap-4 p-4 rounded-lg",
                item.type === "comment"
                  ? "bg-blue-50/50 dark:bg-blue-950/50"
                  : "bg-gray-50/50 dark:bg-gray-900/50"
              )}
            >
              <div className={cn(
                "p-2 rounded-lg h-fit",
                item.type === "comment"
                  ? "bg-blue-100 dark:bg-blue-900"
                  : "bg-gray-100 dark:bg-gray-800"
              )}>
                {item.type === "comment" ? (
                  <MessageCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                ) : (
                  <Clock className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{item.user}</p>
                  <time className="text-sm text-muted-foreground">
                    {new Date(item.timestamp).toLocaleString('tr-TR')}
                  </time>
                </div>
                <p className="mt-1 text-sm">{item.content}</p>
              </div>
            </div>
          ))}
        </div>

        {/* New Comment */}
        <div className="mt-6">
          <Textarea
            placeholder="Yorum ekleyin..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="mb-2"
          />
          <Button className="w-full sm:w-auto">
            <Send className="mr-2 h-4 w-4" />
            Gönder
          </Button>
        </div>
      </Card>
    </div>
  )
}