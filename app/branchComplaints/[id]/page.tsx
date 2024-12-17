'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Share2,
  Edit2,
  Trash2,
  Calendar,
  MessageCircle,
  History,
  AlertCircle,
  Send,
  FileIcon,
  User,
  Users,
  ArrowDownToLine,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Separator } from '@/components/ui/separator'

// Örnek veri
const branchComplaint = {
  id: '1',
  title: 'Tedarikçi teslimat gecikmesi',
  description: 'Son üç siparişte teslimat gecikmesi yaşandı. Bu durum müşteri memnuniyetini olumsuz etkiliyor.',
  branchName: 'Kadıköy Şubesi',
  source: 'supplier',
  priority: 'high',
  status: 'open',
  createdAt: '2024-01-15T10:00:00Z',
  updatedAt: '2024-01-15T10:00:00Z',
  timeline: [
    {
      id: '1',
      type: 'status',
      content: 'Şikayet oluşturuldu',
      author: 'Sistem',
      createdAt: '2024-01-15T10:00:00Z',
    },
    {
      id: '2',
      type: 'comment',
      content: 'Tedarikçi ile görüşme yapıldı, teslimat süreçleri gözden geçirilecek.',
      author: 'Ali Yılmaz',
      createdAt: '2024-01-15T11:30:00Z',
    },
  ],
  files: [
    'https://example.com/file1.pdf',
    'https://example.com/file2.docx',
  ],
}

export default function BranchComplaintDetailPage({ params }: { params: Promise<{ id: string }> }) {
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
          <Link href="/branchComplaints">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
              Şikayet #{resolvedParams.id}
            </h1>
            <p className="text-sm text-muted-foreground">
              {branchComplaint.branchName} tarafından oluşturulan şikayet
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
                  <h2 className="text-xl font-semibold">{branchComplaint.title}</h2>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Oluşturulma: {formatDateTime(branchComplaint.createdAt).date} {formatDateTime(branchComplaint.createdAt).time}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={branchComplaint.status === "open" ? "destructive" : "success"}>
                    {branchComplaint.status === "open" ? "Açık" : "Çözümlendi"}
                  </Badge>
                  <Badge variant={
                    branchComplaint.priority === "high" ? "destructive" : 
                    branchComplaint.priority === "medium" ? "warning" : 
                    "default"
                  }>
                    {branchComplaint.priority === "high" ? "Yüksek" : 
                     branchComplaint.priority === "medium" ? "Orta" : 
                     "Düşük"} Öncelik
                  </Badge>
                </div>
              </div>

              {/* Description */}
              <div className="prose dark:prose-invert max-w-none">
                <p>{branchComplaint.description}</p>
              </div>

              <Separator />

              {/* Timeline */}
              <div className="space-y-4">
                <h3 className="font-semibold">Zaman Çizelgesi</h3>
                <div className="space-y-4">
                  {branchComplaint.timeline.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${getTimelineColor(item.type)}`}>
                        {getTimelineIcon(item.type)}
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <p className="text-sm font-medium">{item.content}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">{item.author}</span>
                          <span className="text-sm text-muted-foreground">•</span>
                          <span className="text-sm text-muted-foreground">
                            {formatDateTime(item.createdAt).date} {formatDateTime(item.createdAt).time}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* New Comment */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <Textarea
                    placeholder="Yorum yazın..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                </div>
                <Button className="shrink-0">
                  <Send className="h-4 w-4 mr-2" />
                  Gönder
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          <Card className="p-6">
            <div className="space-y-4">
              <h4 className="font-medium">Şikayet Bilgileri</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Kaynak</span>
                  <span className="font-medium">{branchComplaint.source === 'supplier' ? 'Tedarikçi' : branchComplaint.source === 'center' ? 'Merkez' : 'Diğer'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Son Güncelleme</span>
                  <span className="font-medium">{formatDateTime(branchComplaint.updatedAt).date}</span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="space-y-4">
              <h4 className="font-medium">Atamalar</h4>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-md bg-blue-100 dark:bg-blue-900/50">
                    <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Sorumlu Yönetici</p>
                    <p className="text-sm text-muted-foreground">Ali Yılmaz</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-md bg-purple-100 dark:bg-purple-900/50">
                    <Users className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Gözlemciler</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      <Badge variant="secondary">Ayşe Demir</Badge>
                      <Badge variant="secondary">Mehmet Kaya</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="space-y-4">
              <h4 className="font-medium">Dosyalar</h4>
              <div className="space-y-2">
                {branchComplaint.files?.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-2 rounded-md bg-muted/50"
                  >
                    <FileIcon className="h-4 w-4 text-blue-500" />
                    <span className="text-sm flex-1 truncate">
                      {file.split('/').pop()}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                    >
                      <ArrowDownToLine className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {(!branchComplaint.files || branchComplaint.files.length === 0) && (
                  <p className="text-sm text-muted-foreground">
                    Henüz dosya eklenmemiş
                  </p>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
