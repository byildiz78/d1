"use client"

import { useState, useRef } from "react"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { InspectionDetail, InspectionHeader } from "@/types/inspection"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  CalendarIcon, 
  BuildingIcon, 
  UserIcon, 
  ClipboardIcon,
  ImageIcon,
  CheckCircleIcon,
  XCircleIcon,
  MinusCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FolderIcon,
  MessageCircleIcon,
  FileIcon
} from "lucide-react"
import { cn } from "@/lib/utils"
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

const ITEMS_PER_PAGE = 10

export default function ReportDetailClient({ 
  headerData,
  detailData 
}: { 
  headerData: InspectionHeader
  detailData: InspectionDetail[]
}) {
  const [searchTerm, setSearchTerm] = useState("")
  const contentRef = useRef<HTMLDivElement>(null)

  // Filter data
  const filteredData = detailData.filter(item =>
    Object.values(item).some(value =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  )

  // Group data by question group
  const groupedData = filteredData.reduce((acc, item) => {
    const group = item['Soru Grubu']
    if (!acc[group]) {
      acc[group] = []
    }
    acc[group].push(item)
    return acc
  }, {} as Record<string, InspectionDetail[]>)

  // Get unique question groups
  const questionGroups = Object.keys(groupedData)

  // Helper function to get score variant
  const getScoreVariant = (score: number) => {
    if (score === 1) return 'success'
    if (score === 0) return 'warning'
    if (score === -1) return 'destructive'
    return score >= 8 ? 'success' : score >= 5 ? 'warning' : 'destructive'
  }

  // Helper function to get score background
  const getScoreBackground = (score: number) => {
    if (score === 1) return 'bg-green-50 dark:bg-green-950'
    if (score === 0) return 'bg-yellow-50 dark:bg-yellow-950'
    if (score === -1) return 'bg-red-50 dark:bg-red-950'
    return ''
  }

  // Function to export PDF
  const exportToPDF = async () => {
    if (!contentRef.current) return

    try {
      // Create loading state or notification here if needed
      
      const canvas = await html2canvas(contentRef.current, {
        scale: 1.5,
        logging: false,
        useCORS: true,
        backgroundColor: '#ffffff'
      })
      
      const imgData = canvas.toDataURL('image/jpeg', 0.7)
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      })
      
      // A4 dimensions
      const pageWidth = 210
      const pageHeight = 297
      
      // Calculate dimensions
      const imgWidth = pageWidth
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      
      // Calculate total pages needed
      const totalPages = Math.ceil(imgHeight / pageHeight)
      
      // Add each page
      for (let page = 0; page < totalPages; page++) {
        // Add new page if not first page
        if (page > 0) {
          pdf.addPage()
        }
        
        // Calculate position for current page
        const position = -(pageHeight * page)
        
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight)
      }
      
      pdf.save(`Denetim_${headerData.No}_${new Date().toLocaleDateString('tr-TR')}.pdf`)
      
    } catch (error) {
      console.error('PDF export failed:', error)
      // Show error notification here if needed
    }
  }

  return (
    <div className="flex-1 space-y-8 p-8" ref={contentRef}>
      {/* Export Button */}
      <div className="flex justify-end">
        <Button
          variant="outline"
          onClick={exportToPDF}
          className="flex items-center gap-2 text-primary hover:text-primary/80 border-primary hover:border-primary/80"
        >
          <FileIcon className="h-5 w-5" />
          <span>PDF'e Aktar</span>
        </Button>
      </div>

      {/* Header Card */}
      <Card className="border-2">
        <CardHeader className="border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-3xl font-bold text-primary">Denetim #{headerData.No}</CardTitle>
              <CardDescription className="mt-2 flex items-center gap-2 text-base">
                <CalendarIcon className="h-5 w-5" />
                {new Date(headerData.Tarih).toLocaleDateString('tr-TR')}
              </CardDescription>
            </div>
            <Badge 
              variant={headerData['Onay Durumu'] === 'Onaylandı' ? 'success' : 'warning'}
              className="text-base px-4 py-1"
            >
              {headerData['Onay Durumu']}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Denetim Bilgileri */}
            <Card className="border-2 border-primary/20">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-primary">
                  <ClipboardIcon className="h-5 w-5" />
                  Denetim Bilgileri
                </CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-3">
                  <div className="flex items-center gap-2">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Form:</dt>
                    <dd className="text-sm font-semibold text-gray-900 dark:text-gray-100">{headerData.Form}</dd>
                  </div>
                  <div className="flex items-center gap-2">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Denetmen:</dt>
                    <dd className="text-sm font-semibold text-gray-900 dark:text-gray-100">{headerData.Denetmen}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            {/* Şube Bilgileri */}
            <Card className="border-2 border-primary/20">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-primary">
                  <BuildingIcon className="h-5 w-5" />
                  Şube Bilgileri
                </CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-3">
                  <div className="flex items-center gap-2">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Şube:</dt>
                    <dd className="text-sm font-semibold text-gray-900 dark:text-gray-100">{headerData.Şube}</dd>
                  </div>
                  <div className="flex items-center gap-2">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Sınıf:</dt>
                    <dd className="text-sm font-semibold text-gray-900 dark:text-gray-100">{headerData['Şube Sınıfı']}</dd>
                  </div>
                  <div className="flex items-center gap-2">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Tip:</dt>
                    <dd className="text-sm font-semibold text-gray-900 dark:text-gray-100">{headerData['Şube Tipi']}</dd>
                  </div>
                  <div className="flex items-center gap-2">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Kategori:</dt>
                    <dd className="text-sm font-semibold text-gray-900 dark:text-gray-100">{headerData['Şube Kategorisi']}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            {/* Diğer Bilgiler */}
            <Card className="border-2 border-primary/20">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-primary">
                  <UserIcon className="h-5 w-5" />
                  Diğer Bilgiler
                </CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-3">
                  <div className="flex items-center gap-2">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Bölge Müdürü:</dt>
                    <dd className="text-sm font-semibold text-gray-900 dark:text-gray-100">{headerData['Bölge Müdürü']}</dd>
                  </div>
                  {headerData['Şube Yetkilileri'] && (
                    <div className="flex items-center gap-2">
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Şube Yetkilileri:</dt>
                      <dd className="text-sm font-semibold text-gray-900 dark:text-gray-100">{headerData['Şube Yetkilileri']}</dd>
                    </div>
                  )}
                </dl>
              </CardContent>
            </Card>
          </div>

          {/* Açıklama ve Notlar */}
          {(headerData.Açıklama || headerData.Notlar) && (
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {headerData.Açıklama && (
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border-2 border-primary/20">
                    <h4 className="text-sm font-medium text-primary mb-2">Açıklama</h4>
                    <p className="text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                      {headerData.Açıklama}
                    </p>
                  </div>
                )}
                {headerData.Notlar && (
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border-2 border-primary/20">
                    <h4 className="text-sm font-medium text-primary mb-2">Notlar</h4>
                    <p className="text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                      {headerData.Notlar}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Details Section */}
      <Card className="border-2">
        <CardHeader className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <CardTitle>Denetim Detayları</CardTitle>
            <Input
              placeholder="Ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {questionGroups.map((group, groupIndex) => (
              <div key={groupIndex}>
                {/* Group Header */}
                <div className="sticky top-0 z-10 bg-white dark:bg-gray-950 p-4 border-b border-gray-200 dark:border-gray-700 shadow-sm">
                  <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
                    <FolderIcon className="h-5 w-5" />
                    {group}
                  </h3>
                </div>

                {/* Questions */}
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {groupedData[group].map((item, index) => (
                    <div 
                      key={index} 
                      className={cn(
                        "p-4 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors",
                        getScoreBackground(item.Puan)
                      )}
                    >
                      <div className="flex flex-col gap-4">
                        {/* Question Row */}
                        <div className="flex flex-col md:flex-row gap-4">
                          {/* Question */}
                          <div className="flex-grow">
                            <div className="font-medium text-gray-900 dark:text-gray-100">
                              {item.Soru}
                            </div>
                          </div>

                          {/* Answer and Score */}
                          <div className="flex items-center gap-6 min-w-[200px]">
                            {/* Answer */}
                            <div className="flex items-center gap-2 min-w-[100px]">
                              {item.Yanıt === 'EVET' ? (
                                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300">
                                  <CheckCircleIcon className="h-4 w-4" />
                                  <span className="text-sm font-medium">Evet</span>
                                </div>
                              ) : item.Yanıt === 'HAYIR' ? (
                                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300">
                                  <XCircleIcon className="h-4 w-4" />
                                  <span className="text-sm font-medium">Hayır</span>
                                </div>
                              ) : item.Yanıt === 'BELIRSIZ' ? (
                                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300">
                                  <MinusCircleIcon className="h-4 w-4" />
                                  <span className="text-sm font-medium">Belirsiz</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-900/50 text-gray-700 dark:text-gray-300">
                                  <MinusCircleIcon className="h-4 w-4" />
                                  <span className="text-sm font-medium">{item.Yanıt || 'Belirsiz'}</span>
                                </div>
                              )}
                            </div>

                            {/* Score */}
                            <div className="min-w-[80px] flex justify-center">
                              <Badge 
                                variant={getScoreVariant(item.Puan)}
                                className="min-w-[60px] justify-center"
                              >
                                {item.Puan} Puan
                              </Badge>
                            </div>
                          </div>
                        </div>

                        {/* Comment and Images Row */}
                        {(item.Yorum || [item.Resim1, item.Resim2, item.Resim3, item.Resim4].some(url => url)) && (
                          <div className="flex flex-wrap items-start gap-4 pl-0 md:pl-4">
                            {/* Comment */}
                            {item.Yorum && (
                              <div className="flex-grow">
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
                                  <MessageCircleIcon className="h-4 w-4" />
                                  <span>{item.Yorum}</span>
                                </div>
                              </div>
                            )}

                            {/* Images */}
                            {([item.Resim1, item.Resim2, item.Resim3, item.Resim4].some(url => url)) && (
                              <div className="flex gap-1 items-start">
                                {[item.Resim1, item.Resim2, item.Resim3, item.Resim4]
                                  .filter(url => url)
                                  .map((url, i) => (
                                    <a
                                      key={i}
                                      href={url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="relative group inline-flex items-center justify-center w-6 h-6 rounded bg-primary/10 hover:bg-primary/20 transition-colors"
                                    >
                                      <ImageIcon className="h-3 w-3 text-primary" />
                                      <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                        Resim {i + 1}
                                      </div>
                                    </a>
                                  ))
                                }
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
