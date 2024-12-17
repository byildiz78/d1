'use client'

import { Card } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { FileText, Eye, Image as ImageIcon, Calendar, Store, ClipboardList, User, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { InspectionRecord } from "@/types/inspection"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { getRecentInspections } from "@/app/actions/database"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function ReportsPage() {
  const [inspections, setInspections] = useState<InspectionRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await getRecentInspections()
        if (result.success) {
          setInspections(result.data)
        } else {
          setError(result.message)
        }
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Filter inspections based on search term
  const filteredInspections = inspections.filter(inspection =>
    Object.values(inspection).some(value =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  )

  // Calculate pagination
  const totalPages = Math.ceil(filteredInspections.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedInspections = filteredInspections.slice(startIndex, startIndex + itemsPerPage)

  if (loading) {
    return (
      <div className="flex-1 p-8">
        <div className="h-[400px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex-1 p-8">
        <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-700 dark:text-red-400">
            {error}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-6 p-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
            Denetim Raporları
          </h2>
          <p className="text-[0.925rem] text-muted-foreground">
            Son yapılan denetimlerin raporları
          </p>
        </div>
      </div>

      {/* Search and Pagination Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <Input
            placeholder="Ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-[300px]"
          />
        </div>
      </div>

      {/* Table Card */}
      <Card className="border-0 shadow-xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <div className="rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100/50 dark:from-gray-800 dark:to-gray-900/50 hover:from-gray-100 hover:to-gray-50 dark:hover:from-gray-800 dark:hover:to-gray-900 border-b border-gray-100 dark:border-gray-800">
                  <TableHead className="font-semibold">
                    <div className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                      <span className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                        <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </span>
                      No
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold">
                    <div className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                      <span className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
                        <Calendar className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      </span>
                      Tarih
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold">
                    <div className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                      <span className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                        <Store className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </span>
                      Şube
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold">
                    <div className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                      <span className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center">
                        <ClipboardList className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                      </span>
                      Form
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold">
                    <div className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                      <span className="w-8 h-8 rounded-lg bg-pink-100 dark:bg-pink-900/50 flex items-center justify-center">
                        <User className="h-4 w-4 text-pink-600 dark:text-pink-400" />
                      </span>
                      Denetmen
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold">
                    <div className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                      <span className="w-8 h-8 rounded-lg bg-yellow-100 dark:bg-yellow-900/50 flex items-center justify-center">
                        <Star className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                      </span>
                      Bölge Müdürü
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold">
                    <div className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                      <span className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center">
                        <Star className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                      </span>
                      Onay Durumu
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold">
                    <div className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                      <span className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-900/50 flex items-center justify-center">
                        <ImageIcon className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                      </span>
                      Resim
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold">
                    <div className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                      <span className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
                        <FileText className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                      </span>
                      Açıklama
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold">
                    <div className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                      <span className="w-8 h-8 rounded-lg bg-cyan-100 dark:bg-cyan-900/50 flex items-center justify-center">
                        <ClipboardList className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                      </span>
                      Notlar
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold text-right">
                    <div className="flex items-center justify-end gap-2 text-gray-900 dark:text-gray-100">
                      <span className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                        <Eye className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                      </span>
                      İşlemler
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedInspections.map((inspection, index) => (
                  <TableRow 
                    key={inspection.No}
                    className={cn(
                      "transition-all duration-200",
                      index % 2 === 0 
                        ? "bg-white dark:bg-gray-900" 
                        : "bg-gray-50/50 dark:bg-gray-800/50",
                      "hover:bg-blue-50/50 dark:hover:bg-blue-900/20",
                      "group"
                    )}
                  >
                    <TableCell className="font-medium">
                      <Link 
                        href={`/reports/${inspection.No}`}
                        className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:underline transition-colors duration-200"
                      >
                        #{inspection.No}
                      </Link>
                    </TableCell>
                    <TableCell>{new Date(inspection.Tarih).toLocaleDateString('tr-TR')}</TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <div className="font-medium">{inspection.Şube}</div>
                        <div className="flex flex-wrap gap-1.5">
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800">
                            {inspection["Şube Sınıfı"]}
                          </Badge>
                          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800">
                            {inspection["Şube Tipi"]}
                          </Badge>
                          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800">
                            {inspection["Şube Kategorisi"]}
                          </Badge>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{inspection.Form}</TableCell>
                    <TableCell>{inspection.Denetmen}</TableCell>
                    <TableCell>{inspection["Bölge Müdürü"]}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={cn(
                          inspection["Onay Durumu"] === "Onaylandı" 
                            ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                            : "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800"
                        )}
                      >
                        {inspection["Onay Durumu"]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {inspection["Resim Linki"] && (
                        <a 
                          href={inspection["Resim Linki"]} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-rose-100 hover:bg-rose-200 dark:bg-rose-900/50 dark:hover:bg-rose-800/50 transition-colors"
                        >
                          <ImageIcon className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                        </a>
                      )}
                    </TableCell>
                    <TableCell className="max-w-[200px]">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="truncate">
                              {inspection.Açıklama || "-"}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="max-w-sm">
                            <p className="text-sm">{inspection.Açıklama || "Açıklama bulunmuyor"}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell className="max-w-[200px]">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="truncate">
                              {inspection.Notlar || "-"}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="max-w-sm">
                            <p className="text-sm">{inspection.Notlar || "Not bulunmuyor"}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link 
                        href={`/reports/${inspection.No}`}
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                      >
                        <span>Detay</span>
                        <Eye className="h-5 w-5" />
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Footer with Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-4">
            <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Sayfa başına" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 satır</SelectItem>
                <SelectItem value="10">10 satır</SelectItem>
                <SelectItem value="20">20 satır</SelectItem>
                <SelectItem value="50">50 satır</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              Toplam {filteredInspections.length} kayıt
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Önceki
            </Button>
            <div className="flex items-center gap-1 text-sm">
              <span className="font-medium">{currentPage}</span>
              <span className="text-muted-foreground">/</span>
              <span className="text-muted-foreground">{totalPages || 1}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Sonraki
            </Button>
          </div>
        </div>
      </Card>

      {/* Results Summary */}
      <div className="text-sm text-muted-foreground">
        Toplam {filteredInspections.length} kayıttan {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredInspections.length)} arası gösteriliyor
      </div>
    </div>
  )
}
