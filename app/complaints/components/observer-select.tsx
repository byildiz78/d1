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

// Örnek gözlemci listesi
const observers: Observer[] = [
  { id: "1", name: "Ali Yılmaz", role: "Kalite Kontrol" },
  { id: "2", name: "Zeynep Demir", role: "Müşteri İlişkileri" },
  { id: "3", name: "Can Kaya", role: "Operasyon Sorumlusu" },
  { id: "4", name: "Elif Şahin", role: "Bölge Sorumlusu" },
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
            className="w-full justify-between"
          >
            Gözlemci seçin
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Gözlemci ara..." />
            <CommandEmpty>Gözlemci bulunamadı.</CommandEmpty>
            <CommandGroup>
              {observers.map((observer) => (
                <CommandItem
                  key={observer.id}
                  onSelect={() => toggleObserver(observer.id)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value.includes(observer.id) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col">
                    <span>{observer.name}</span>
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
            className="flex items-center gap-1"
          >
            {observer.name}
            <button
              className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  removeObserver(observer.id)
                }
              }}
              onMouseDown={(e) => {
                e.preventDefault()
                e.stopPropagation()
              }}
              onClick={() => removeObserver(observer.id)}
            >
              <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  )
}