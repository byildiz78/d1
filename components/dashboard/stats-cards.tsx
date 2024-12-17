"use client"

import { Card } from "@/components/ui/card"
import { Activity, AlertTriangle, CheckCircle2, Clock } from "lucide-react"

const stats = [
  {
    title: "Toplam Denetim",
    value: "2350",
    icon: Activity,
    color: "primary",
    trend: { value: 12.5, isPositive: true }
  },
  {
    title: "Bu Ay Yapılan",
    value: "127",
    icon: CheckCircle2,
    color: "blue-500",
    trend: { value: 8.3, isPositive: true }
  },
  {
    title: "Ortalama Puan",
    value: "85.2",
    icon: AlertTriangle,
    color: "green-500",
    trend: { value: 2.1, isPositive: true }
  },
  {
    title: "Bekleyen Denetim",
    value: "24",
    icon: Clock,
    color: "yellow-500",
    trend: { value: 5.4, isPositive: false }
  },
]

export function StatsCards() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card
          key={index}
          className={`relative overflow-hidden border-l-4 border-l-${stat.color} p-3 sm:p-4 hover:shadow-lg transition-all duration-200 group`}
        >
          <div className="flex items-center gap-2 sm:gap-3">
            <div className={`p-2 sm:p-2.5 rounded-xl bg-${stat.color}/10 transition-transform duration-200 group-hover:scale-110`}>
              <stat.icon className={`h-4 w-4 sm:h-5 sm:w-5 text-${stat.color}`} />
            </div>
            <div className="space-y-0.5 sm:space-y-1">
              <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                {stat.title}
              </p>
              <div className="flex items-baseline gap-1.5 sm:gap-2">
                <p className={`text-lg sm:text-xl font-bold text-${stat.color}`}>
                  {stat.title.includes("Puan") 
                    ? Number(stat.value).toLocaleString('tr-TR') + '%'
                    : Number(stat.value).toLocaleString('tr-TR')}
                </p>
                {stat.trend && (
                  <span className={`text-[10px] sm:text-xs font-medium px-1 sm:px-1.5 py-0.5 rounded-full ${
                    stat.trend.isPositive 
                      ? 'text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-900/30'
                      : 'text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-900/30'
                  }`}>
                    {stat.trend.isPositive ? '↑' : '↓'}{stat.trend.value}%
                  </span>
                )}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}