"use client"

import { Card } from "@/components/ui/card"
import { FormDistributionChart } from "./form-distribution-chart"

interface FormDistributionCardProps {
  data: {
    form: string;
    count: number;
  }[];
}

export function FormDistributionCard({ data }: FormDistributionCardProps) {
  return (
    <Card className="p-6"> 
      <h3 className="text-xl font-semibold mb-4">Form Dağılımı</h3>
      <div className="h-[400px]"> 
        <FormDistributionChart data={data} />
      </div>
    </Card>
  )
}