"use client"

import { Globe, Mail, Phone, MessageSquare, Twitter, Facebook, Instagram } from "lucide-react"
import { ComplaintSource } from "../types"
import { cn } from "@/lib/utils"

const sourceIcons = {
  website: Globe,
  email: Mail,
  sikayetvar: MessageSquare,
  call_center: Phone,
  twitter: Twitter,
  facebook: Facebook,
  instagram: Instagram,
}

interface ComplaintSourceBadgeProps {
  source: ComplaintSource
  className?: string
}

export function ComplaintSourceBadge({ source, className }: ComplaintSourceBadgeProps) {
  const Icon = sourceIcons[source]
  
  return (
    <div className={cn(
      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-medium",
      "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
      className
    )}>
      <Icon className="h-3.5 w-3.5" />
      <span>{source}</span>
    </div>
  )
}