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
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ComplaintSourceBadge } from "./components/complaint-source"
import { Edit2, Plus, Search, Filter, Calendar, Clock, Building2, User, MessageCircle, Tag, AlertCircle, FileText } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

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
        <Button asChild className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white w-full sm:w-auto">
          <Link href="/complaints/new">
            <Plus className="mr-2 h-4 w-4" />
            Yeni Şikayet
          </Link>
        </Button>
      </div>

      {/* Filters Section */}
      <Card className="p-4">
        <div className="flex flex-col gap-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Şikayet ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-full"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <AlertCircle className="mr-2 h-4 w-4" />
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
              <SelectTrigger>
                <Tag className="mr-2 h-4 w-4" />
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
              <SelectTrigger>
                <MessageCircle className="mr-2 h-4 w-4" />
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
      <Card className="border-0 shadow-xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100/50 dark:from-gray-800 dark:to-gray-900/50 hover:from-gray-100 hover:to-gray-50 dark:hover:from-gray-800 dark:hover:to-gray-900">
                <TableHead>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                      <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="font-semibold">Başlık</span>
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
                      <Building2 className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <span className="font-semibold">Şube</span>
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                      <User className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="font-semibold">Müşteri</span>
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
                      <MessageCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    </div>
                    <span className="font-semibold">Kaynak</span>
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-900/50 flex items-center justify-center">
                      <AlertCircle className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                    </div>
                    <span className="font-semibold">Durum</span>
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-cyan-100 dark:bg-cyan-900/50 flex items-center justify-center">
                      <Tag className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                    </div>
                    <span className="font-semibold">Öncelik</span>
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                      <Calendar className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <span className="font-semibold">Oluşturulma</span>
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                      <Clock className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <span className="font-semibold">Son İşlem</span>
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center">
                      <User className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                    </div>
                    <span className="font-semibold">Atanan</span>
                  </div>
                </TableHead>
                <TableHead className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center">
                      <Edit2 className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                    </div>
                    <span className="font-semibold">İşlemler</span>
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredComplaints.map((complaint, index) => {
                const createdDateTime = formatDateTime(complaint.createdAt)
                const lastActionDateTime = formatDateTime(complaint.lastActionAt)

                return (
                  <TableRow
                    key={complaint.id}
                    className={cn(
                      "transition-all duration-200",
                      index % 2 === 0 
                        ? "bg-white dark:bg-gray-900" 
                        : "bg-gray-50/50 dark:bg-gray-800/50",
                      "hover:bg-blue-50/50 dark:hover:bg-blue-900/20",
                      "group"
                    )}
                  >
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
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{lastActionDateTime.date}</span>
                        <Clock className="h-4 w-4 ml-2 text-muted-foreground" />
                        <span>{lastActionDateTime.time}</span>
                      </div>
                    </TableCell>
                    <TableCell>{complaint.assignedTo}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        asChild
                        className="hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/50 dark:hover:text-blue-400"
                      >
                        <Link href={`/complaints/${complaint.id}/edit`}>
                          <Edit2 className="h-4 w-4" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
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