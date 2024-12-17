"use client"

import { useEffect, useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar } from "@/components/ui/avatar"
import { CalendarDays, Clock, MapPin, ClipboardCheck } from "lucide-react"
import { cn } from "@/lib/utils"
import { getNotifications } from "@/app/actions/database"

interface Props {
  data: {
    id: number
    user: string
    formName: string
    location: string
    date: string
    time: string
    rawDate: string
    isNew?: boolean
  }[]
}

export function NotificationFeed({ initialData }: { initialData: Props["data"] }) {
  const [data, setData] = useState(initialData)

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const result = await getNotifications()
        if (result.success && result.data) {
          setData(result.data)
        }
      } catch (error) {
        console.error("Failed to fetch notifications:", error)
      }
    }

    // İlk yüklemeden sonra her 5 dakikada bir güncelle
    const interval = setInterval(fetchNotifications, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <ScrollArea className="h-[calc(100vh-11rem)] sm:h-[calc(100vh-12rem)] pr-2 sm:pr-4 -mr-1 sm:-mr-2">
      <div className="space-y-4">
        {data.map((notification, index) => {
          const gradients = {
            0: "from-blue-600 to-indigo-600",
            1: "from-indigo-600 to-purple-600",
            2: "from-purple-600 to-pink-600",
            3: "from-pink-600 to-rose-600",
            4: "from-rose-600 to-orange-600",
            5: "from-orange-600 to-amber-600",
          }

          const bgGradients = {
            0: "from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40",
            1: "from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40",
            2: "from-purple-50 to-pink-50 dark:from-purple-950/40 dark:to-pink-950/40",
            3: "from-pink-50 to-rose-50 dark:from-pink-950/40 dark:to-rose-950/40",
            4: "from-rose-50 to-orange-50 dark:from-rose-950/40 dark:to-orange-950/40",
            5: "from-orange-50 to-amber-50 dark:from-orange-950/40 dark:to-amber-950/40",
          }

          const gradientIndex = index % 6
          const gradient = gradients[gradientIndex as keyof typeof gradients]
          const bgGradient = bgGradients[gradientIndex as keyof typeof bgGradients]

          return (
            <Card
              key={notification.id}
              className={cn(
                "group relative overflow-hidden transition-all duration-300",
                "hover:shadow-lg hover:shadow-gray-200/40 dark:hover:shadow-gray-900/40",
                "hover:-translate-y-0.5",
                "bg-gradient-to-br",
                bgGradient,
                "border-0"
              )}
            >
              <div className="absolute top-2 sm:top-3 right-2 sm:right-3 z-10">
                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1 sm:gap-2">
                  {notification.isNew && (
                    <Badge 
                      className={cn(
                        "px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-medium",
                        "bg-gradient-to-r",
                        gradient,
                        "text-white border-0 shadow-md"
                      )}
                    >
                      Yeni
                    </Badge>
                  )}
                  <span className={cn(
                    "inline-flex items-center px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium",
                    "bg-gradient-to-r",
                    gradient,
                    "text-white shadow-sm"
                  )}>
                    {notification.formName}
                  </span>
                </div>
              </div>

              <div className="relative">
                <div className="absolute top-0 left-0 w-1 sm:w-1.5 h-full bg-gradient-to-b opacity-70"
                     style={{
                       backgroundImage: `linear-gradient(to bottom, var(--${gradient.split(' ')[0]}-color), var(--${gradient.split(' ')[2]}-color))`
                     }} />
                
                <div className="pl-4 sm:pl-6 pr-3 sm:pr-4 py-3 sm:py-4">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <Avatar className={cn(
                      "w-8 h-8 sm:w-10 sm:h-10 text-xs sm:text-sm relative transition-all duration-300",
                      "group-hover:scale-110",
                      "bg-gradient-to-br shadow-md",
                      gradient,
                      "text-white flex items-center justify-center"
                    )}>
                      <span className="font-medium">
                        {notification.user.split(' ').map(name => name[0]).join('')}
                      </span>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-0.5 sm:space-y-1 flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm sm:text-base text-gray-900 dark:text-gray-100 truncate">
                              {notification.user}
                            </span>
                          </div>
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-3 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                              <span>{notification.time}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <CalendarDays className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                              <span>{new Date(notification.rawDate).toLocaleDateString('tr-TR', { 
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                              })}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-2 sm:mt-3 flex flex-col gap-1.5 sm:gap-2">
                        <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-700 dark:text-gray-200">
                          <div className="flex items-center gap-1 sm:gap-1.5">
                            <ClipboardCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            <span className="font-medium">Form dolduruldu</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                          <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          <span className="truncate">{notification.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </ScrollArea>
  )
}