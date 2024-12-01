"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const recentInspections = [
  {
    id: 1,
    date: "2024-03-20",
    restaurant: "Şube Kadıköy",
    form: "O.D.Z",
    inspector: "Ahmet Yılmaz",
    score: 92,
  },
  {
    id: 2,
    date: "2024-03-19",
    restaurant: "Şube Beşiktaş",
    form: "KDZ",
    inspector: "Mehmet Demir",
    score: 88,
  },
  {
    id: 3,
    date: "2024-03-19",
    restaurant: "Şube Maltepe",
    form: "HDZ",
    inspector: "Ayşe Kaya",
    score: 95,
  },
  {
    id: 4,
    date: "2024-03-18",
    restaurant: "Şube Üsküdar",
    form: "M.O.D.Z",
    inspector: "Ali Yıldız",
    score: 90,
  },
]

export function RecentInspections() {
  const getScoreColor = (score: number) => {
    if (score >= 90) return "bg-green-500/10 text-green-500 hover:bg-green-500/20"
    if (score >= 80) return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"
    if (score >= 70) return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
    return "bg-red-500/10 text-red-500 hover:bg-red-500/20"
  }

  return (
    <div className="overflow-auto">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Tarih</TableHead>
            <TableHead>Şube</TableHead>
            <TableHead>Form</TableHead>
            <TableHead>Denetçi</TableHead>
            <TableHead>Puan</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recentInspections.map((inspection) => (
            <TableRow key={inspection.id} className="hover:bg-muted/50 group">
              <TableCell>{inspection.date}</TableCell>
              <TableCell className="font-medium group-hover:text-primary transition-colors">
                {inspection.restaurant}
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="group-hover:border-primary transition-colors">
                  {inspection.form}
                </Badge>
              </TableCell>
              <TableCell>{inspection.inspector}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-sm font-medium transition-colors ${getScoreColor(inspection.score)}`}>
                  {inspection.score}%
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}