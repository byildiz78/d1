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
import { ComplaintSourceBadge } from "./components/complaint-source"
import { Eye, Plus, Search } from "lucide-react"
import Link from "next/link"

// Mock data
const complaints = [
  {
    id: 1,
    title: "Sipariş Gecikmesi",
    branch: "Kadıköy Şubesi",
    source: "website",
    status: "open",
    priority: "high",
    createdAt: "2024-03-20",
    resolvedAt: null,
    lastActionAt: "2024-03-21",
    assignedTo: "Ahmet Yılmaz"
  },
  {
    id: 2,
    title: "Yanlış Ürün Teslimi",
    branch: "Beşiktaş Şubesi",
    source: "call_center",
    status: "resolved",
    priority: "medium",
    createdAt: "2024-03-19",
    resolvedAt: "2024-03-20",
    lastActionAt: "2024-03-20",
    assignedTo: "Mehmet Demir"
  },
  // Add more mock data as needed
]

export default function ComplaintsPage() {
  const [searchTerm, setSearchTerm] = useState("")

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
        <Button asChild>
          <Link href="/complaints/new">
            <Plus className="mr-2 h-4 w-4" />
            Yeni Şikayet
          </Link>
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Şikayet ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Complaints Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Başlık</TableHead>
              <TableHead>Şube</TableHead>
              <TableHead>Kaynak</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead>Öncelik</TableHead>
              <TableHead>Oluşturulma</TableHead>
              <TableHead>Çözümlenme</TableHead>
              <TableHead>Son Aksiyon</TableHead>
              <TableHead>Atanan</TableHead>
              <TableHead className="text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {complaints.map((complaint) => (
              <TableRow key={complaint.id}>
                <TableCell className="font-medium">{complaint.title}</TableCell>
                <TableCell>{complaint.branch}</TableCell>
                <TableCell>
                  <ComplaintSourceBadge source={complaint.source as any} />
                </TableCell>
                <TableCell>
                  <Badge
                    variant={complaint.status === "open" ? "destructive" : "success"}
                  >
                    {complaint.status === "open" ? "Açık" : "Çözümlendi"}
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
                <TableCell>{new Date(complaint.createdAt).toLocaleDateString('tr-TR')}</TableCell>
                <TableCell>
                  {complaint.resolvedAt
                    ? new Date(complaint.resolvedAt).toLocaleDateString('tr-TR')
                    : "-"}
                </TableCell>
                <TableCell>{new Date(complaint.lastActionAt).toLocaleDateString('tr-TR')}</TableCell>
                <TableCell>{complaint.assignedTo}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/complaints/${complaint.id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}