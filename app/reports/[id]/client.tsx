'use client'

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
import { ImageIcon } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { InspectionDetail } from "@/types/inspection"
import { cn } from "@/lib/utils"

interface ClientReportDetailProps {
  initialData: InspectionDetail[]
  id: string
}

export default function ClientReportDetail({ initialData, id }: ClientReportDetailProps) {
  const [details] = useState<InspectionDetail[]>(initialData)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  // Filter details based on search term
  const filteredDetails = details.filter(detail =>
    Object.values(detail).some(value =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  )

  // Calculate pagination
  const totalPages = Math.ceil(filteredDetails.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedDetails = filteredDetails.slice(startIndex, startIndex + itemsPerPage)

  return (
    <div className="flex-1 space-y-6 p-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
            Denetim Detayı #{id}
          </h2>
          <p className="text-[0.925rem] text-muted-foreground">
            Denetim kayıtlarının detaylı görünümü
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

      {/* Table Card */}
      <Card className="border-0 shadow-xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <div className="rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100/50 dark:from-gray-800 dark:to-gray-900/50 hover:from-gray-100 hover:to-gray-50 dark:hover:from-gray-800 dark:hover:to-gray-900 border-b border-gray-100 dark:border-gray-800">
                  <TableHead className="font-semibold text-gray-900 dark:text-gray-100">Soru Grubu</TableHead>
                  <TableHead className="font-semibold text-gray-900 dark:text-gray-100">Soru</TableHead>
                  <TableHead className="font-semibold text-gray-900 dark:text-gray-100">Yanıt</TableHead>
                  <TableHead className="font-semibold text-gray-900 dark:text-gray-100">Puan</TableHead>
                  <TableHead className="font-semibold text-gray-900 dark:text-gray-100">Yorum</TableHead>
                  <TableHead className="font-semibold text-gray-900 dark:text-gray-100">Resimler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedDetails.map((detail, index) => (
                  <TableRow
                    key={`${detail["Denetim No"]}-${index}`}
                    className={cn(
                      "transition-all duration-200",
                      index % 2 === 0
                        ? "bg-white dark:bg-gray-900"
                        : "bg-gray-50/50 dark:bg-gray-800/50",
                      "hover:bg-blue-50/50 dark:hover:bg-blue-900/20",
                      "group"
                    )}
                  >
                    <TableCell>{detail["Soru Grubu"]}</TableCell>
                    <TableCell>{detail["Soru"]}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          "rounded-full font-medium border-2 shadow-sm transition-colors duration-200",
                          detail["Yanıt"].toLowerCase().includes("evet")
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800/50 dark:bg-emerald-900/20 dark:text-emerald-400"
                            : detail["Yanıt"].toLowerCase().includes("hayır")
                            ? "border-red-200 bg-red-50 text-red-700 dark:border-red-800/50 dark:bg-red-900/20 dark:text-red-400"
                            : "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800/50 dark:bg-amber-900/20 dark:text-amber-400"
                        )}
                      >
                        {detail["Yanıt"]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          "rounded-full font-medium border-2 shadow-sm transition-colors duration-200",
                          detail["Puan"] >= 8
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800/50 dark:bg-emerald-900/20 dark:text-emerald-400"
                            : detail["Puan"] >= 5
                            ? "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800/50 dark:bg-amber-900/20 dark:text-amber-400"
                            : "border-red-200 bg-red-50 text-red-700 dark:border-red-800/50 dark:bg-red-900/20 dark:text-red-400"
                        )}
                      >
                        {detail["Puan"]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="max-w-[200px] truncate">
                              {detail["Yorum"]}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-sm">
                            <p>{detail["Yorum"]}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {[detail["Resim1"], detail["Resim2"], detail["Resim3"], detail["Resim4"]].map((url, idx) => (
                          url && (
                            <TooltipProvider key={idx}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <a
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40 transition-colors duration-200"
                                  >
                                    <ImageIcon className="w-4 h-4" />
                                  </a>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Resmi görüntüle</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </Card>

      {/* Results Summary */}
      <div className="text-sm text-muted-foreground">
        Toplam {filteredDetails.length} kayıttan {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredDetails.length)} arası gösteriliyor
      </div>
    </div>
  )
}
