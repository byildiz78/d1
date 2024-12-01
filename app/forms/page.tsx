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
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between space-x-2">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
            Denetim Formları
          </h2>
          <p className="text-[0.925rem] text-muted-foreground">
            Tüm denetim formlarını buradan yönetebilirsiniz
          </p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-indigo-500/20">
          <Plus className="mr-2 h-4 w-4" />
          Yeni Form Oluştur
        </Button>
      </div>

      <Card className="border-0 shadow-lg bg-white/50 backdrop-blur-sm">
        <div className="rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/80 hover:bg-gray-50/80 dark:bg-gray-900/50 dark:hover:bg-gray-900/50 border-b border-gray-100 dark:border-gray-800">
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
                    "transition-colors",
                    index % 2 === 0 
                      ? "bg-white dark:bg-gray-950" 
                      : "bg-gray-50/50 dark:bg-gray-900/50",
                    "hover:bg-blue-50/50 dark:hover:bg-blue-950/20",
                    index === formsData.length - 1 && "last:border-b-0"
                  )}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/50">
                        <ClipboardList className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="font-medium text-gray-900 dark:text-gray-100">{form.FormName}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Form #{form.FormID}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-300 max-w-md">
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-gray-400" />
                      <p className="truncate">{form.Description || "Açıklama bulunmuyor"}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={form.IsActive ? "default" : "secondary"}
                      className={cn(
                        "rounded-full font-medium shadow-sm",
                        form.IsActive 
                          ? "bg-green-50 text-green-700 hover:bg-green-100 border-green-200/50 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20" 
                          : "bg-gray-50 text-gray-600 hover:bg-gray-100 border-gray-200/50 dark:bg-gray-500/10 dark:text-gray-400 dark:border-gray-500/20"
                      )}
                    >
                      <div className="flex items-center gap-1.5 px-1">
                        <div className={cn(
                          "w-2 h-2 rounded-full shadow-sm",
                          form.IsActive 
                            ? "bg-green-500 shadow-green-500/50" 
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
                          className="h-9 w-9 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/50 dark:hover:text-blue-400"
                        >
                          <Eye className="h-5 w-5" />
                        </Button>
                      </Link>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-gray-100 dark:hover:bg-gray-800"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem className="hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-950/50 dark:hover:text-amber-400 cursor-pointer">
                            <Edit2 className="mr-2 h-4 w-4" />
                            <span>Düzenle</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/50 dark:hover:text-red-400 cursor-pointer">
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