"use client"

import { Avatar } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const notifications = [
  {
    id: 1,
    user: "Ahmet Uslu",
    action: "KDZ formunu doldurdu",
    location: "Muğla Şube",
    date: "24.10.2024",
    time: "15:30",
    avatar: "AU",
    color: "bg-blue-500"
  },
  {
    id: 2,
    user: "Ayşe Yılmaz",
    action: "S.D.Z.F formunu doldurdu",
    location: "Antalya Şube",
    date: "25.10.2024",
    time: "10:45",
    avatar: "AY",
    color: "bg-green-500"
  },
  {
    id: 3,
    user: "Mehmet Demir",
    action: "O.D.Z formunu doldurdu",
    location: "İzmir Şube",
    date: "25.10.2024",
    time: "09:15",
    avatar: "MD",
    color: "bg-purple-500"
  },
  {
    id: 4,
    user: "Zeynep Kaya",
    action: "M.O.D.Z formunu doldurdu",
    location: "Ankara Şube",
    date: "24.10.2024",
    time: "16:20",
    avatar: "ZK",
    color: "bg-yellow-500"
  },
  {
    id: 5,
    user: "Ali Yıldız",
    action: "HDZ formunu doldurdu",
    location: "Bursa Şube",
    date: "24.10.2024",
    time: "14:50",
    avatar: "AY",
    color: "bg-pink-500"
  }
]

export function NotificationFeed() {
  return (
    <ScrollArea className="h-[600px] pr-4">
      <div className="space-y-4">
        {notifications.map((notification) => (
          <Card
            key={notification.id}
            className={cn(
              "p-4 transition-all hover:scale-[1.02] cursor-pointer group border-2",
              "border-l-4",
              `border-l-[${notification.color.replace('bg-', '')}]`
            )}
          >
            <div className="flex items-start gap-4">
              <Avatar className={cn(
                "w-10 h-10 text-sm ring-2 ring-offset-2 transition-transform duration-200 group-hover:scale-110",
                notification.color,
                "text-white"
              )}>
                <span>{notification.avatar}</span>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">
                    {notification.user}
                  </p>
                  <time className="text-xs text-muted-foreground">
                    {notification.time}
                  </time>
                </div>
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">
                    {notification.location}
                  </span>{" "}
                  {notification.action}
                </p>
                <p className="text-xs text-muted-foreground">
                  {notification.date}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </ScrollArea>
  )
}