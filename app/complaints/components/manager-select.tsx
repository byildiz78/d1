"use client"

import { useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Manager } from "../types"

// Örnek yönetici listesi
const managers: Manager[] = [
  { id: "1", name: "Ahmet Yılmaz", role: "Şube Müdürü" },
  { id: "2", name: "Mehmet Demir", role: "Operasyon Müdürü" },
  { id: "3", name: "Ayşe Kaya", role: "Bölge Müdürü" },
]

interface ManagerSelectProps {
  value?: string
  onChange: (value: string) => void
}

export function ManagerSelect({ value, onChange }: ManagerSelectProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Yönetici seçin" />
      </SelectTrigger>
      <SelectContent>
        {managers.map((manager) => (
          <SelectItem key={manager.id} value={manager.id}>
            <div className="flex flex-col">
              <span>{manager.name}</span>
              <span className="text-xs text-muted-foreground">{manager.role}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}