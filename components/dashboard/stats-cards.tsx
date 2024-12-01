"use client"

import { Card } from "@/components/ui/card"
import { Activity, AlertTriangle, CheckCircle2, Clock } from "lucide-react"

const stats = [
  {
    title: "Toplam Denetim",
    value: "2,350",
    icon: Activity,
    color: "primary",
  },
  {
    title: "Bu Ay Yapılan",
    value: "127",
    icon: CheckCircle2,
    color: "blue-500",
  },
  {
    title: "Ortalama Puan",
    value: "85.2%",
    icon: AlertTriangle,
    color: "green-500",
  },
  {
    title: "Bekleyen Denetim",
    value: "24",
    icon: Clock,
    color: "yellow-500",
  },
]

export function StatsCards() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card
          key={index}
          className={`relative overflow-hidden border-2 p-6 hover:shadow-lg transition-all duration-200 group`}
        >
          <div className="flex items-center gap-4">
            <div className={`p-3 bg-${stat.color}/10 rounded-xl transition-transform duration-200 group-hover:scale-110`}>
              <stat.icon className={`h-6 w-6 text-${stat.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </p>
              <p className={`text-2xl font-bold text-${stat.color}`}>
                {stat.value}
              </p>
            </div>
          </div>
          <div className={`absolute inset-y-0 left-0 w-1 bg-${stat.color} opacity-0 transition-opacity duration-200 group-hover:opacity-100`} />
        </Card>
      ))}
    </div>
  )
}