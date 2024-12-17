'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Plus, 
  Search, 
  AlertCircle, 
  Tag, 
  MessageCircle,
  Calendar,
  User,
  Building2,
  ArrowUpRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'

// Örnek veri, gerçek uygulamada API'den gelecek
const branchComplaints = [
  {
    id: '1',
    title: 'Tedarikçi teslimat gecikmesi',
    branchName: 'Kadıköy Şubesi',
    description: 'Son üç siparişte teslimat gecikmesi yaşandı',
    status: 'open',
    priority: 'high',
    source: 'supplier',
    assignedTo: 'Ali Yılmaz',
    createdAt: '2024-01-15T10:00:00',
    updatedAt: '2024-01-15T10:00:00',
    comments: 3,
  },
  {
    id: '2',
    title: 'Merkez iletişim sorunu',
    branchName: 'Beşiktaş Şubesi',
    description: 'Merkez ile iletişimde yaşanan gecikmeler operasyonu etkiliyor',
    status: 'in_progress',
    priority: 'medium',
    source: 'center',
    assignedTo: 'Ayşe Demir',
    createdAt: '2024-01-14T15:30:00',
    updatedAt: '2024-01-15T09:20:00',
    comments: 5,
  },
]

const statusOptions = [
  { value: 'all', label: 'Tüm Durumlar' },
  { value: 'open', label: 'Açık' },
  { value: 'in_progress', label: 'İşlemde' },
  { value: 'pending', label: 'Beklemede' },
  { value: 'resolved', label: 'Çözümlendi' },
]

const priorityOptions = [
  { value: 'all', label: 'Tüm Öncelikler' },
  { value: 'high', label: 'Yüksek' },
  { value: 'medium', label: 'Orta' },
  { value: 'low', label: 'Düşük' },
]

const sourceOptions = [
  { value: 'all', label: 'Tüm Kaynaklar' },
  { value: 'center', label: 'Merkez' },
  { value: 'supplier', label: 'Tedarikçi' },
  { value: 'other', label: 'Diğer' },
]

export default function BranchComplaintsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [sourceFilter, setSourceFilter] = useState("all")

  // Filter complaints based on all criteria
  const filteredComplaints = branchComplaints.filter(complaint => {
    const matchesSearch = 
      complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.branchName.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
            Bayi Şikayetleri
          </h2>
          <p className="text-[0.925rem] text-muted-foreground">
            Bayi ve tedarikçi şikayetlerini yönetin ve takip edin
          </p>
        </div>
        <Button asChild className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white w-full sm:w-auto">
          <Link href="/branchComplaints/new">
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

      {/* DataTable */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Şikayet</TableHead>
              <TableHead>Şube</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead>Öncelik</TableHead>
              <TableHead>Kaynak</TableHead>
              <TableHead>Sorumlu</TableHead>
              <TableHead>Tarih</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredComplaints.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                  Şikayet bulunamadı
                </TableCell>
              </TableRow>
            ) : (
              filteredComplaints.map((complaint) => (
                <TableRow key={complaint.id}>
                  <TableCell>
                    <Link 
                      href={`/branchComplaints/${complaint.id}/edit`}
                      className="block space-y-1.5 py-2 cursor-pointer hover:underline"
                    >
                      <div className="font-medium">{complaint.title}</div>
                      <div className="text-sm text-muted-foreground line-clamp-1">
                        {complaint.description}
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span>{complaint.branchName}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(complaint.status)}>
                      {getStatusLabel(complaint.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={complaint.priority === "high" ? "destructive" : complaint.priority === "medium" ? "warning" : "default"}>
                      {complaint.priority === "high" ? "Yüksek" : complaint.priority === "medium" ? "Orta" : "Düşük"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {complaint.source === "supplier" ? (
                        <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span>
                        {complaint.source === "supplier" ? "Tedarikçi" : 
                         complaint.source === "center" ? "Merkez" : "Diğer"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{complaint.assignedTo}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{formatDateTime(complaint.createdAt).date}</span>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
