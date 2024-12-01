"use client"

import { Card } from "@/components/ui/card"
import { MonthlyTrendChart } from "@/components/monthly-trend-chart"

interface ChartCardProps {
  data: {
    Ay: string;
    DenetimSayisi: number;
  }[];
}

export function ChartCard({ data }: ChartCardProps) {
  return (
    <Card className="hidden md:block p-6">
      <h3 className="text-xl font-semibold mb-4">Denetim Trendi</h3>
      <div className="h-[400px]">
        <MonthlyTrendChart initialData={data} />
      </div>
    </Card>
  )
}