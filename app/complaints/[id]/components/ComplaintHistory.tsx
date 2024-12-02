"use client"

import { Separator } from "@/components/ui/separator"
import { History, CheckCircle2, XCircle, Clock, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"

interface HistoryItem {
  id: number
  type: string
  field?: string
  oldValue?: string
  newValue?: string
  content?: string
  user: string
  timestamp: string
}

interface ComplaintHistoryProps {
  history: HistoryItem[]
}

export function ComplaintHistory({ history }: ComplaintHistoryProps) {
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return {
      date: date.toLocaleDateString('tr-TR', { 
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      }),
      time: date.toLocaleTimeString('tr-TR', {
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }

  return (
    <div className="relative space-y-6">
      {/* Timeline Line */}
      <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-rose-200 to-pink-200 dark:from-rose-800 dark:to-pink-800" />

      {history.map((item) => (
        <div
          key={item.id}
          className={cn(
            "relative pl-12",
            "before:absolute before:left-5 before:top-6 before:w-2 before:h-2 before:bg-white dark:before:bg-gray-900 before:rounded-full before:z-10",
            "after:absolute after:left-4 after:top-5 after:w-4 after:h-4 after:rounded-full",
            item.type === "edit" 
              ? "after:bg-amber-200 dark:after:bg-amber-800" 
              : "after:bg-blue-200 dark:after:bg-blue-800"
          )}
        >
          <div className={cn(
            "p-4 rounded-lg",
            item.type === "edit"
              ? "bg-amber-50/50 dark:bg-amber-900/20 border-2 border-amber-200/50 dark:border-amber-800/50"
              : "bg-blue-50/50 dark:bg-blue-900/20 border-2 border-blue-200/50 dark:border-blue-800/50"
          )}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-medium">{item.user}</span>
                <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800">
                  {item.type === "edit" ? "Düzenleme" : "Yorum"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{formatDateTime(item.timestamp).date}</span>
                <Clock className="h-4 w-4" />
                <span>{formatDateTime(item.timestamp).time}</span>
              </div>
            </div>
            {item.type === "edit" ? (
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">{item.field}</span>
                <span className="text-muted-foreground">alanı</span>
                <span className="px-2 py-0.5 rounded bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">
                  {item.oldValue}
                </span>
                <span className="text-muted-foreground">değerinden</span>
                <span className="px-2 py-0.5 rounded bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                  {item.newValue}
                </span>
                <span className="text-muted-foreground">değerine güncellendi</span>
              </div>
            ) : (
              <p className="text-sm">{item.content}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}