"use client"

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
import { Eye, Edit2, Trash2, Plus, FileText, MoreHorizontal, ClipboardList } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import formsData from "@/jsons/forms.json"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function FormsPage() {
  return (
    <div className="flex-1 space-y-6 p-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
            Denetim Formları
          </h2>
          <p className="text-[0.925rem] text-muted-foreground">
            Tüm denetim formlarını buradan yönetebilirsiniz
          </p>
        </div>
        <Button 
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25 dark:shadow-blue-500/15"
        >
          <Plus className="mr-2 h-4 w-4" />
          Yeni Form Oluştur
        </Button>
      </div>

      {/* Table Card */}
      <Card className="border-0 shadow-xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <div className="rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100/50 dark:from-gray-800 dark:to-gray-900/50 hover:from-gray-100 hover:to-gray-50 dark:hover:from-gray-800 dark:hover:to-gray-900 border-b border-gray-100 dark:border-gray-800">
                <TableHead className="font-semibold text-gray-900 dark:text-gray-100">Form Adı</TableHead>
                <TableHead className="font-semibold text-gray-900 dark:text-gray-100">Açıklama</TableHead>
                <TableHead className="font-semibold text-gray-900 dark:text-gray-100">Durum</TableHead>
                <TableHead className="text-right font-semibold text-gray-900 dark:text-gray-100">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {formsData.map((form, index) => (
                <TableRow 
                  key={form.FormID}
                  className={cn(
                    "transition-all duration-200",
                    index % 2 === 0 
                      ? "bg-white dark:bg-gray-900" 
                      : "bg-gray-50/50 dark:bg-gray-800/50",
                    "hover:bg-blue-50/50 dark:hover:bg-blue-900/20",
                    "group",
                    index === formsData.length - 1 && "last:border-b-0"
                  )}
                >
                  <TableCell>
                    <div className="flex items-center gap-4">
                      <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50 group-hover:scale-110 transition-transform duration-300">
                        <ClipboardList className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="space-y-1">
                        <span className="font-medium text-gray-900 dark:text-gray-100">{form.FormName}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 block">Form #{form.FormID}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-300">
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-gray-400" />
                      <p className="line-clamp-1">{form.Description || "Açıklama bulunmuyor"}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline"
                      className={cn(
                        "rounded-full font-medium border-2 shadow-sm transition-colors duration-200",
                        form.IsActive 
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-800/50 dark:bg-emerald-900/20 dark:text-emerald-400" 
                          : "border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100 dark:border-gray-700/50 dark:bg-gray-800/20 dark:text-gray-400"
                      )}
                    >
                      <div className="flex items-center gap-1.5 px-1">
                        <div className={cn(
                          "w-2 h-2 rounded-full shadow-sm animate-pulse",
                          form.IsActive 
                            ? "bg-emerald-500 shadow-emerald-500/50" 
                            : "bg-gray-400 shadow-gray-400/50"
                        )} />
                        {form.IsActive ? "Aktif" : "Pasif"}
                      </div>
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end items-center gap-2">
                      <Link href={`/forms/${form.FormID}`}>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-9 w-9 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/50 dark:hover:text-blue-400 transition-colors duration-200"
                        >
                          <Eye className="h-5 w-5" />
                        </Button>
                      </Link>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem className="hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-900/50 dark:hover:text-amber-400 cursor-pointer transition-colors duration-200">
                            <Edit2 className="mr-2 h-4 w-4" />
                            <span>Düzenle</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/50 dark:hover:text-red-400 cursor-pointer transition-colors duration-200">
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Sil</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  )
}