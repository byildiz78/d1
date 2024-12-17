'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// Örnek veri - gerçek uygulamada API'den gelecek
const managers = [
  { id: 'user1', name: 'Ali Yılmaz' },
  { id: 'user2', name: 'Ayşe Demir' },
  { id: 'user3', name: 'Mehmet Kaya' },
]

interface ManagerSelectProps {
  value?: string
  onChange: (value: string) => void
}

export function ManagerSelect({ value, onChange }: ManagerSelectProps) {
  return (
    <Select onValueChange={onChange} value={value}>
      <SelectTrigger>
        <SelectValue placeholder="Yönetici seçin" />
      </SelectTrigger>
      <SelectContent>
        {managers.map((manager) => (
          <SelectItem key={manager.id} value={manager.id}>
            {manager.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
