"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ComplaintSourceBadge } from "./components/complaint-source"
import { Eye, Plus, Search, Filter, Calendar, Clock } from "lucide-react"
import Link from "next/link"

// Enhanced mock data
const complaints = [
  {
    id: 1,
    title: "Sipariş Gecikmesi",
    branch: "Kadıköy Şubesi",
    source: "website",
    status: "open",
    priority: "high",
    createdAt: "2024-03-20T10:30:00",
    resolvedAt: null,
    lastActionAt: "2024-03-21T15:45:00",
    assignedTo: "Ahmet Yılmaz",
    customerName: "Mehmet Demir",
    description: "Siparişim 2 saat geçmesine rağmen hala teslim edilmedi."
  },
  {
    id: 2,
    title: "Yanlış Ürün Teslimi",
    branch: "Beşiktaş Şubesi",
    source: "call_center",
    status: "resolved",
    priority: "medium",
    createdAt: "2024-03-19T14:20:00",
    resolvedAt: "2024-03-20T09:15:00",
    lastActionAt: "2024-03-20T09:15:00",
    assignedTo: "Mehmet Demir",
    customerName: "Ayşe Kaya",
    description: "Sipariş ettiğim üründen farklı bir ürün teslim edildi."
  },
  {
    id: 3,
    title: "Kalite Sorunu",
    branch: "Şişli Şubesi",
    source: "sikayetvar",
    status: "in_progress",
    priority: "high",
    createdAt: "2024-03-21T09:00:00",
    resolvedAt: null,
    lastActionAt: "2024-03-21T16:30:00",
    assignedTo: "Zeynep Yıldız",
    customerName: "Ali Öztürk",
    description: "Ürünün kalitesi beklentilerimi karşılamadı."
  },
  {
    id: 4,
    title: "Müşteri Hizmetleri İletişimi",
    branch: "Ümraniye Şubesi",
    source: "email",
    status: "pending",
    priority: "low",
    createdAt: "2024-03-18T11:45:00",
    resolvedAt: null,
    lastActionAt: "2024-03-19T10:20:00",
    assignedTo: "Can Kaya",
    customerName: "Fatma Şahin",
    description: "Müşteri hizmetlerine ulaşmakta zorluk yaşıyorum."
  },
  {
    id: 5,
    title: "Fiyatlandırma Hatası",
    branch: "Maltepe Şubesi",
    source: "website",
    status: "resolved",
    priority: "medium",
    createdAt: "2024-03-17T16:15:00",
    resolvedAt: "2024-03-18T14:30:00",
    lastActionAt: "2024-03-18T14:30:00",
    assignedTo: "Elif Demir",
    customerName: "Mustafa Yılmaz",
    description: "Web sitesinde gösterilen fiyat ile fatura tutarı farklı."
  },
  {
    id: 6,
    title: "Teslimat Adresi Sorunu",
    branch: "Bakırköy Şubesi",
    source: "call_center",
    status: "open",
    priority: "high",
    createdAt: "2024-03-21T13:20:00",
    resolvedAt: null,
    lastActionAt: "2024-03-21T14:45:00",
    assignedTo: "Burak Şahin",
    customerName: "Zehra Kaya",
    description: "Yanlış adrese teslimat yapıldı."
  },
  {
    id: 7,
    title: "Ürün İadesi",
    branch: "Mecidiyeköy Şubesi",
    source: "twitter",
    status: "in_progress",
    priority: "medium",
    createdAt: "2024-03-20T15:30:00",
    resolvedAt: null,
    lastActionAt: "2024-03-21T11:15:00",
    assignedTo: "Deniz Yıldırım",
    customerName: "Emre Çelik",
    description: "Ürün iadesi için 1 haftadır bekliyorum."
  },
  {
    id: 8,
    title: "Promosyon Kodu Sorunu",
    branch: "Levent Şubesi",
    source: "instagram",
    status: "resolved",
    priority: "low",
    createdAt: "2024-03-19T09:45:00",
    resolvedAt: "2024-03-19T16:20:00",
    lastActionAt: "2024-03-19T16:20:00",
    assignedTo: "Selin Arslan",
    customerName: "Oğuz Demir",
    description: "Promosyon kodu çalışmıyor."
  }
]

const statusOptions = [
  { value: "all", label: "Tüm Durumlar" },
  { value: "open", label: "Açık" },
  { value: "in_progress", label: "İşlemde" },
  { value: "pending", label: "Beklemede" },
  { value: "resolved", label: "Çözümlendi" }
]

const priorityOptions = [
  { value: "all", label: "Tüm Öncelikler" },
  { value: "high", label: "Yüksek" },
  { value: "medium", label: "Orta" },
  { value: "low", label: "Düşük" }
]

const sourceOptions = [
  { value: "all", label: "Tüm Kaynaklar" },
  { value: "website", label: "Web Sitesi" },
  { value: "call_center", label: "Çağrı Merkezi" },
  { value: "sikayetvar", label: "Şikayetvar" },
  { value: "email", label: "E-posta" },
  { value: "twitter", label: "Twitter" },
  { value: "instagram", label: "Instagram" }
]

export default function ComplaintsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [sourceFilter, setSourceFilter] = useState("all")

  // Filter complaints based on all criteria
  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = 
      complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.branch.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || complaint.status === statusFilter
    const matchesPriority = priorityFilter === "all" || complaint.priority === priorityFilter
    const matchesSource = sourceFilter === "all" || complaint.source === sourceFilter

    return matchesSearch && matchesStatus && matchesPriority && matchesSource
  })

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "open":
        return "destructive"
      case "in_progress":
        return "warning"
      case "pending":
        return "secondary"
      case "resolved":
        return "success"
      default:
        return "default"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "open":
        return "Açık"
      case "in_progress":
        return "İşlemde"
      case "pending":
        return "Beklemede"
      case "resolved":
        return "Çözümlendi"
      default:
        return status
    }
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return {
      date: date.toLocaleDateString('tr-TR', { 
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }),
      time: date.toLocaleTimeString('tr-TR', {
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }

  return (
    <div className="flex-1 space-y-6 p-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
            Şikayet Yönetimi
          </h2>
          <p className="text-[0.925rem] text-muted-foreground">
            Müşteri şikayetlerini yönetin ve takip edin
          </p>
        </div>
        <Button asChild className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <Link href="/complaints/new">
            <Plus className="mr-2 h-4 w-4" />
            Yeni Şikayet
          </Link>
        </Button>
      </div>

      {/* Filters Section */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Şikayet ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Durum" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[160px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Öncelik" />
              </SelectTrigger>
              <SelectContent>
                {priorityOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger className="w-[160px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Kaynak" />
              </SelectTrigger>
              <SelectContent>
                {sourceOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Complaints Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Başlık</TableHead>
              <TableHead>Şube</TableHead>
              <TableHead>Müşteri</TableHead>
              <TableHead>Kaynak</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead>Öncelik</TableHead>
              <TableHead>Oluşturulma</TableHead>
              <TableHead>Çözümlenme</TableHead>
              <TableHead>Son İşlem</TableHead>
              <TableHead>Atanan</TableHead>
              <TableHead className="text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredComplaints.map((complaint) => {
              const createdDateTime = formatDateTime(complaint.createdAt)
              const resolvedDateTime = complaint.resolvedAt ? formatDateTime(complaint.resolvedAt) : null
              const lastActionDateTime = formatDateTime(complaint.lastActionAt)

              return (
                <TableRow key={complaint.id} className="group hover:bg-muted/50">
                  <TableCell className="font-medium max-w-[200px]">
                    <div className="truncate" title={complaint.title}>
                      {complaint.title}
                    </div>
                    <div className="text-xs text-muted-foreground truncate" title={complaint.description}>
                      {complaint.description}
                    </div>
                  </TableCell>
                  <TableCell>{complaint.branch}</TableCell>
                  <TableCell>{complaint.customerName}</TableCell>
                  <TableCell>
                    <ComplaintSourceBadge source={complaint.source as any} />
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(complaint.status)}>
                      {getStatusLabel(complaint.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        complaint.priority === "high"
                          ? "destructive"
                          : complaint.priority === "medium"
                          ? "warning"
                          : "default"
                      }
                    >
                      {complaint.priority === "high"
                        ? "Yüksek"
                        : complaint.priority === "medium"
                        ? "Orta"
                        : "Düşük"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{createdDateTime.date}</span>
                      <Clock className="h-4 w-4 ml-2 text-muted-foreground" />
                      <span>{createdDateTime.time}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {resolvedDateTime ? (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{resolvedDateTime.date}</span>
                        <Clock className="h-4 w-4 ml-2 text-muted-foreground" />
                        <span>{resolvedDateTime.time}</span>
                      </div>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{lastActionDateTime.date}</span>
                      <Clock className="h-4 w-4 ml-2 text-muted-foreground" />
                      <span>{lastActionDateTime.time}</span>
                    </div>
                  </TableCell>
                  <TableCell>{complaint.assignedTo}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/complaints/${complaint.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </Card>

      {/* Results Summary */}
      <div className="text-sm text-muted-foreground">
        Toplam {filteredComplaints.length} şikayet gösteriliyor
        {(statusFilter !== "all" || priorityFilter !== "all" || sourceFilter !== "all" || searchTerm) && (
          <span> (filtrelendi)</span>
        )}
      </div>
    </div>
  )
}