"use client"

import { Card } from "@/components/ui/card"
import { Overview } from "@/components/overview"

export function ChartCard() {
  return (
    <Card className="border-2">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold">Denetim Trendi</h3>
          <select className="text-sm border-2 rounded-lg p-2 bg-background hover:bg-accent transition-colors">
            <option>Son 6 Ay</option>
            <option>Son 1 Yıl</option>
          </select>
        </div>
        <div className="h-[350px]">
          <Overview />
        </div>
      </div>
    </Card>
  )
}