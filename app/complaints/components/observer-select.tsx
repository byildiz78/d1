"use client"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, ChevronsUpDown, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Observer } from "../types"
import { useState } from "react"

// Mock observer data
const observers: Observer[] = [
  { id: "1", name: "Ali Yılmaz", role: "Kalite Kontrol Uzmanı" },
  { id: "2", name: "Zeynep Demir", role: "Müşteri İlişkileri Yöneticisi" },
  { id: "3", name: "Can Kaya", role: "Operasyon Sorumlusu" },
  { id: "4", name: "Elif Şahin", role: "Bölge Sorumlusu" },
  { id: "5", name: "Murat Öz", role: "Şube Denetçisi" },
  { id: "6", name: "Ayşe Yıldız", role: "Kalite Güvence Uzmanı" },
  { id: "7", name: "Emre Çelik", role: "Müşteri Deneyimi Sorumlusu" },
  { id: "8", name: "Selin Arslan", role: "Operasyon Yöneticisi" }
]

interface ObserverSelectProps {
  value: string[]
  onChange: (value: string[]) => void
}

export function ObserverSelect({ value, onChange }: ObserverSelectProps) {
  const [open, setOpen] = useState(false)

  const selectedObservers = observers.filter(observer => 
    value.includes(observer.id)
  )

  const toggleObserver = (observerId: string) => {
    const newValue = value.includes(observerId)
      ? value.filter(id => id !== observerId)
      : [...value, observerId]
    onChange(newValue)
  }

  const removeObserver = (observerId: string) => {
    onChange(value.filter(id => id !== observerId))
  }

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between border-2"
          >
            <span className="truncate">
              {value.length === 0 
                ? "Gözlemci seçin" 
                : `${value.length} gözlemci seçildi`}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder="Gözlemci ara..." className="h-9" />
            <CommandEmpty>Gözlemci bulunamadı.</CommandEmpty>
            <CommandGroup className="max-h-[200px] overflow-auto">
              {observers.map((observer) => (
                <CommandItem
                  key={observer.id}
                  value={observer.name}
                  onSelect={() => toggleObserver(observer.id)}
                  className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-accent"
                >
                  <div className={cn(
                    "flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                    value.includes(observer.id) ? "bg-primary text-primary-foreground" : "opacity-50"
                  )}>
                    <Check className={cn(
                      "h-3 w-3",
                      value.includes(observer.id) ? "opacity-100" : "opacity-0"
                    )} />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium">{observer.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {observer.role}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      <div className="flex flex-wrap gap-2">
        {selectedObservers.map(observer => (
          <Badge
            key={observer.id}
            variant="secondary"
            className="flex items-center gap-1 px-2 py-1"
          >
            <span className="text-sm">{observer.name}</span>
            <button
              type="button"
              onClick={() => removeObserver(observer.id)}
              className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <X className="h-3 w-3 text-muted-foreground hover:text-foreground transition-colors" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  )
}