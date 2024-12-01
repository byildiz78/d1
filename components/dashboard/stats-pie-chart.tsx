"use client"

import { Card } from "@/components/ui/card"
import { InspectionStats } from "@/components/inspection-stats"

export function StatsPieChart() {
  return (
    <Card className="border-2">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold">Form Dağılımı</h3>
          <select className="text-sm border-2 rounded-lg p-2 bg-background hover:bg-accent transition-colors">
            <option>Bu Ay</option>
            <option>Bu Yıl</option>
          </select>
        </div>
        <div className="h-[350px]">
          <InspectionStats />
        </div>
      </div>
    </Card>
  )
}