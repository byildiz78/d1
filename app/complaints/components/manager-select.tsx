"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Manager } from "../types"

// Mock manager data
const managers: Manager[] = [
  { id: "1", name: "Ahmet Yılmaz", role: "Şube Müdürü" },
  { id: "2", name: "Mehmet Demir", role: "Operasyon Müdürü" },
  { id: "3", name: "Ayşe Kaya", role: "Bölge Müdürü" },
  { id: "4", name: "Fatma Şahin", role: "Kalite Müdürü" },
  { id: "5", name: "Ali Öztürk", role: "Müşteri İlişkileri Müdürü" }
]

interface ManagerSelectProps {
  value?: string
  onChange: (value: string) => void
}

export function ManagerSelect({ value, onChange }: ManagerSelectProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="border-2">
        <SelectValue placeholder="Yönetici seçin" />
      </SelectTrigger>
      <SelectContent>
        {managers.map((manager) => (
          <SelectItem 
            key={manager.id} 
            value={manager.id}
            className="cursor-pointer"
          >
            <div className="flex flex-col py-1">
              <span className="font-medium">{manager.name}</span>
              <span className="text-xs text-muted-foreground">{manager.role}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}