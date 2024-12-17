"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface BranchComplaintHeaderProps {
  id: string
}

export function BranchComplaintHeader({ id }: BranchComplaintHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Link href="/branchComplaints">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
            Şikayet #{id}
          </h1>
          <p className="text-sm text-muted-foreground">
            Şikayet detaylarını düzenleyin
          </p>
        </div>
      </div>
    </div>
  )
}
