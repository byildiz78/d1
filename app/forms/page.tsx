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
import { Eye, Edit2, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const forms = [
  { id: 1, name: "İhtar Formu", description: "Markayı Koruma Prosüdürleri", status: "active" },
  { id: 2, name: "O.D.Z", description: "Operasyonel Destek Ziyaret Formu", status: "active" },
  { id: 3, name: "M.O.D.Z", description: "Merkezi Operasyonel Destek Ziyaret Formu", status: "active" },
  { id: 4, name: "Ş.İ.P.D.Z.", description: "Şeften İste Operasyonel Destek Ziyaret Formu", status: "inactive" },
  { id: 5, name: "HDZ", description: "Sıcak Spot Destek Ziyareti", status: "active" },
  { id: 6, name: "KDZ", description: "Bayi Kalite Destek Ziyareti", status: "active" },
  { id: 7, name: "S.D.Z.F", description: "SAHA DESTEK ZİYAFET FORMU", status: "inactive" },
  { id: 8, name: "İDK Form", description: "İletişim Destek Konferansları", status: "active" },
  { id: 9, name: "O.D.Z Yeni", description: "Operasyonel Destek Ziyaret Formu Yeni", status: "active" },
  { id: 10, name: "SHİFFT", description: "SHİFFT", status: "active" },
  { id: 11, name: "SAHA ZİYARET FORMU YENİ", description: "SAHA ZİYARET FORMU YENİ", status: "active" },
]

export default function FormsPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Denetim Formları</h2>
      </div>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Form Adı</TableHead>
              <TableHead>Açıklama</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead className="text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {forms.map((form) => (
              <TableRow key={form.id}>
                <TableCell className="font-medium">{form.name}</TableCell>
                <TableCell>{form.description}</TableCell>
                <TableCell>
                  <Badge variant={form.status === "active" ? "default" : "secondary"}>
                    {form.status === "active" ? "Aktif" : "Pasif"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}