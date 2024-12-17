"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { tr } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { 
  History,
  MessageCircle, 
  AlertCircle,
  RefreshCcw,
  UserPlus,
  FileUp,
  Tag,
  CheckCircle2,
  Clock,
  AlertTriangle,
  PauseCircle
} from "lucide-react"
import { getComplaintHistory } from "@/lib/complaint-api"

interface ComplaintHistoryProps {
  complaintId: number
  className?: string
}

type HistoryEntry = {
  id: number
  action_type: string
  action_description: string
  created_at: string
  created_by: number
  user_name: string
  user_role?: string
}

const actionIcons: Record<string, any> = {
  comment: MessageCircle,
  status_change: RefreshCcw,
  assignment_change: UserPlus,
  file_upload: FileUp,
  priority_change: Tag,
}

const statusIcons: Record<string, any> = {
  open: AlertCircle,
  in_progress: Clock,
  resolved: CheckCircle2,
  pending: PauseCircle,
}

const statusColors: Record<string, { icon: string; bg: string; text: string }> = {
  open: {
    icon: "text-red-500",
    bg: "bg-red-50 dark:bg-red-950",
    text: "text-red-700 dark:text-red-300",
  },
  in_progress: {
    icon: "text-blue-500",
    bg: "bg-blue-50 dark:bg-blue-950",
    text: "text-blue-700 dark:text-blue-300",
  },
  resolved: {
    icon: "text-green-500",
    bg: "bg-green-50 dark:bg-green-950",
    text: "text-green-700 dark:text-green-300",
  },
  pending: {
    icon: "text-yellow-500",
    bg: "bg-yellow-50 dark:bg-yellow-950",
    text: "text-yellow-700 dark:text-yellow-300",
  },
}

export function ComplaintHistory({ complaintId, className }: ComplaintHistoryProps) {
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchHistory = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await getComplaintHistory(complaintId)
      setHistory(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Tarihçe yüklenirken bir hata oluştu')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [complaintId])

  const getActionIcon = (actionType: string, newStatus?: string) => {
    if (actionType === 'status_change' && newStatus) {
      return statusIcons[newStatus] || RefreshCcw
    }
    return actionIcons[actionType] || AlertTriangle
  }

  const getStatusStyles = (status: string) => {
    return statusColors[status] || {
      icon: "text-gray-500",
      bg: "bg-gray-50 dark:bg-gray-950",
      text: "text-gray-700 dark:text-gray-300",
    }
  }

  if (error) {
    return (
      <div className={cn("rounded-lg border p-4", className)}>
        <div className="flex flex-col items-center justify-center space-y-4 py-8">
          <AlertCircle className="h-12 w-12 text-red-500" />
          <div className="text-lg font-semibold text-red-500">{error}</div>
          <Button onClick={fetchHistory} variant="outline">
            Tekrar Dene
          </Button>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className={cn("rounded-lg border p-4", className)}>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("rounded-lg border", className)}>
      <div className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950">
            <History className="h-5 w-5 text-blue-500" />
          </div>
          <h3 className="text-lg font-semibold">
            Şikayet Tarihçesi
          </h3>
        </div>

        <Separator className="mb-6" />

        <div className="space-y-6">
          {history.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              Henüz tarihçe kaydı bulunmuyor
            </div>
          ) : (
            history.map((entry) => {
              const ActionIcon = getActionIcon(
                entry.action_type,
                entry.action_type === 'status_change' 
                  ? entry.action_description.match(/['"]([^'"]*)['"]/)?.[1] 
                  : undefined
              )

              const statusMatch = entry.action_type === 'status_change' 
                ? entry.action_description.match(/['"]([^'"]*)['"]/)?.[1]
                : null

              const styles = statusMatch 
                ? getStatusStyles(statusMatch)
                : {
                    icon: "text-blue-500",
                    bg: "bg-blue-50 dark:bg-blue-950",
                    text: "text-blue-700 dark:text-blue-300",
                  }

              return (
                <div key={entry.id} className="relative pl-6 pb-6 last:pb-0">
                  {/* Timeline line */}
                  <div className="absolute left-[11px] top-[26px] bottom-0 w-[2px] bg-gray-200 dark:bg-gray-800 last:hidden" />
                  
                  <div className="flex gap-4">
                    {/* Action icon */}
                    <div className={cn(
                      "relative z-10 rounded-full p-2 shadow-md",
                      styles.bg
                    )}>
                      <ActionIcon className={cn("h-4 w-4", styles.icon)} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">
                          {entry.user_name}
                          {entry.user_role && (
                            <span className="text-muted-foreground font-normal">
                              {" "}• {entry.user_role}
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {format(new Date(entry.created_at), "d MMMM yyyy HH:mm", { locale: tr })}
                        </div>
                      </div>
                      <div className={cn(
                        "text-sm rounded-lg p-3",
                        entry.action_type === 'status_change' ? styles.bg : "bg-gray-50 dark:bg-gray-950"
                      )}>
                        {entry.action_description}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
