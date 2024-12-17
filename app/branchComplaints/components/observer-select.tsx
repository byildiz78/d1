'use client'

import { X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

// Örnek veri - gerçek uygulamada API'den gelecek
const observers = [
  { id: 'user1', name: 'Ali Yılmaz' },
  { id: 'user2', name: 'Ayşe Demir' },
  { id: 'user3', name: 'Mehmet Kaya' },
  { id: 'user4', name: 'Zeynep Şahin' },
  { id: 'user5', name: 'Can Öztürk' },
]

interface ObserverSelectProps {
  value: string[]
  onChange: (value: string[]) => void
}

export function ObserverSelect({ value = [], onChange }: ObserverSelectProps) {
  const selectedObservers = observers.filter((observer) =>
    value.includes(observer.id)
  )

  const availableObservers = observers.filter(
    (observer) => !value.includes(observer.id)
  )

  return (
    <div className="space-y-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-9 w-full justify-start text-left font-normal"
          >
            <span>Gözlemci ekle</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" side="bottom" align="start">
          <Command>
            <CommandInput placeholder="Gözlemci ara..." />
            <CommandEmpty>Gözlemci bulunamadı.</CommandEmpty>
            <CommandGroup>
              {availableObservers.map((observer) => (
                <CommandItem
                  key={observer.id}
                  onSelect={() => {
                    onChange([...value, observer.id])
                  }}
                >
                  {observer.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      <div className="flex flex-wrap gap-2">
        {selectedObservers.map((observer) => (
          <Badge
            key={observer.id}
            variant="secondary"
            className="flex items-center gap-1"
          >
            {observer.name}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-4 w-4 p-0 hover:bg-transparent"
              onClick={() => {
                onChange(value.filter((id) => id !== observer.id))
              }}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
      </div>
    </div>
  )
}
