"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface ComplaintHeaderProps {
  id: string
}

export function ComplaintHeader({ id }: ComplaintHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Link href="/complaints">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
            Şikayet Düzenle #{id}
          </h2>
        </div>
        <p className="text-muted-foreground">
          Şikayet detaylarını düzenleyin
        </p>
      </div>
    </div>
  )
}