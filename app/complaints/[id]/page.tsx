"use client"

import { use } from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { 
  MessageCircle, 
  Clock, 
  Calendar,
  Building2,
  User,
  CheckCircle2,
  AlertCircle,
  Send,
  ArrowLeft,
  History,
  Edit2,
  Trash2,
  Share2,
  Phone,
  Mail,
  Tag
} from "lucide-react"
import Link from "next/link"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

// Mock data - would normally come from an API
const complaint = {
  id: 1,
  title: "Sipariş Gecikmesi",
  description: "Siparişim 2 saat geçmesine rağmen hala teslim edilmedi. Müşteri hizmetlerini aradığımda net bir bilgi alamadım.",
  branch: "Kadıköy Şubesi",
  source: "website",
  status: "open",
  priority: "high",
  createdAt: "2024-03-20T10:30:00",
  resolvedAt: null,
  lastActionAt: "2024-03-21T15:45:00",
  assignedTo: "Ahmet Yılmaz",
  customerName: "Mehmet Demir",
  customerEmail: "mehmet.demir@email.com",
  customerPhone: "+90 532 123 4567",
  orderNumber: "ORD-2024-1234",
  timeline: [
    {
      id: 1,
      type: "comment",
      content: "Müşteriyle iletişime geçildi, özür dilendi ve durumla ilgili bilgi verildi.",
      user: "Ahmet Yılmaz",
      timestamp: "2024-03-20T11:00:00",
      userRole: "Müşteri Temsilcisi"
    },
    {
      id: 2,
      type: "status",
      content: "Şikayet durumu 'Açık' olarak güncellendi",
      user: "Sistem",
      timestamp: "2024-03-20T11:05:00"
    },
    {
      id: 3,
      type: "action",
      content: "Şubeye acil bildirim gönderildi",
      user: "Mehmet Demir",
      timestamp: "2024-03-20T11:10:00",
      userRole: "Şube Müdürü"
    },
    {
      id: 4,
      type: "comment",
      content: "Teslimat ekibi bilgilendirildi, sipariş en kısa sürede teslim edilecek.",
      user: "Zeynep Yıldız",
      timestamp: "2024-03-20T11:30:00",
      userRole: "Operasyon Sorumlusu"
    }
  ]
}

export default function ComplaintDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [newComment, setNewComment] = useState("")

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return {
      date: date.toLocaleDateString('tr-TR', { 
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      }),
      time: date.toLocaleTimeString('tr-TR', {
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }

  const getTimelineIcon = (type: string) => {
    switch (type) {
      case "comment":
        return <MessageCircle className="h-5 w-5" />
      case "status":
        return <History className="h-5 w-5" />
      case "action":
        return <AlertCircle className="h-5 w-5" />
      default:
        return <MessageCircle className="h-5 w-5" />
    }
  }

  const getTimelineColor = (type: string) => {
    switch (type) {
      case "comment":
        return "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400"
      case "status":
        return "bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-400"
      case "action":
        return "bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400"
      default:
        return "bg-gray-100 text-gray-600 dark:bg-gray-900/50 dark:text-gray-400"
    }
  }

  return (
    <div className="flex-1 space-y-6 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/complaints">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
              Şikayet #{resolvedParams.id}
            </h1>
            <p className="text-sm text-muted-foreground">
              {complaint.orderNumber} numaralı sipariş için oluşturulan şikayet
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Paylaş</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon">
                  <Edit2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Düzenle</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" className="text-red-600 hover:text-red-700">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Sil</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-[2fr,1fr]">
        <div className="space-y-6">
          {/* Main Content Card */}
          <Card className="p-6">
            <div className="space-y-6">
              {/* Title and Status */}
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h2 className="text-xl font-semibold">{complaint.title}</h2>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Oluşturulma: {formatDateTime(complaint.createdAt).date} {formatDateTime(complaint.createdAt).time}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={complaint.status === "open" ? "destructive" : "success"}>
                    {complaint.status === "open" ? "Açık" : "Çözümlendi"}
                  </Badge>
                  <Badge variant={
                    complaint.priority === "high" ? "destructive" : 
                    complaint.priority === "medium" ? "warning" : 
                    "default"
                  }>
                    {complaint.priority === "high" ? "Yüksek" : 
                     complaint.priority === "medium" ? "Orta" : 
                     "Düşük"} Öncelik
                  </Badge>
                </div>
              </div>

              {/* Description */}
              <div className="prose dark:prose-invert max-w-none">
                <p>{complaint.description}</p>
              </div>

              {/* Source and Branch */}
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800">
                  <Building2 className="mr-1 h-3 w-3" />
                  {complaint.branch}
                </Badge>
              </div>
            </div>
          </Card>

          {/* Timeline Card */}
          <Card className="p-6">
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Zaman Çizelgesi</h3>
              
              <div className="space-y-4">
                {complaint.timeline.map((item) => (
                  <div
                    key={item.id}
                    className={cn(
                      "flex gap-4 p-4 rounded-lg",
                      item.type === "comment"
                        ? "bg-blue-50/50 dark:bg-blue-950/30"
                        : item.type === "status"
                        ? "bg-purple-50/50 dark:bg-purple-950/30"
                        : "bg-amber-50/50 dark:bg-amber-950/30"
                    )}
                  >
                    <div className={cn(
                      "p-2 rounded-lg h-fit",
                      getTimelineColor(item.type)
                    )}>
                      {getTimelineIcon(item.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{item.user}</span>
                            {item.userRole && (
                              <Badge variant="outline" className="text-xs">
                                {item.userRole}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {formatDateTime(item.timestamp).date} {formatDateTime(item.timestamp).time}
                          </p>
                        </div>
                      </div>
                      <p className="mt-2 text-sm">{item.content}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* New Comment */}
              <div className="space-y-4">
                <Textarea
                  placeholder="Yorum ekleyin..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[100px]"
                />
                <Button className="w-full sm:w-auto">
                  <Send className="mr-2 h-4 w-4" />
                  Gönder
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Info Card */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Müşteri Bilgileri</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50">
                  <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium">{complaint.customerName}</p>
                  <p className="text-xs text-muted-foreground">Müşteri</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/50">
                  <Mail className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-medium">{complaint.customerEmail}</p>
                  <p className="text-xs text-muted-foreground">E-posta</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/50">
                  <Phone className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-medium">{complaint.customerPhone}</p>
                  <p className="text-xs text-muted-foreground">Telefon</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/50">
                  <Tag className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-sm font-medium">{complaint.orderNumber}</p>
                  <p className="text-xs text-muted-foreground">Sipariş No</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Assignment Card */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Atama Bilgileri</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/50">
                  <User className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <p className="text-sm font-medium">{complaint.assignedTo}</p>
                  <p className="text-xs text-muted-foreground">Atanan Kişi</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-rose-100 dark:bg-rose-900/50">
                  <Building2 className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                </div>
                <div>
                  <p className="text-sm font-medium">{complaint.branch}</p>
                  <p className="text-xs text-muted-foreground">İlgili Şube</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}