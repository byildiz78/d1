"use client"

import { UserCircle, Plus, ClipboardList, Settings, Home } from "lucide-react"
import { ThemeSwitcher } from "@/components/theme-switcher"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function TopMenu() {
  return (
    <div className="border-b bg-card">
      <div className="flex h-16 items-center px-4 shadow-sm">
        <Link href="/" className="flex items-center">
          <h1 className="text-xl font-bold text-primary">RobotPOS Denetim</h1>
        </Link>
        
        <div className="ml-8 flex items-center space-x-4">
          <Button variant="ghost" asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Ana Sayfa
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/forms">
              <ClipboardList className="mr-2 h-4 w-4" />
              Formlar
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/settings">
              <Settings className="mr-2 h-4 w-4" />
              Ayarlar
            </Link>
          </Button>
        </div>
        
        <div className="ml-auto flex items-center space-x-4">
          <Button asChild>
            <Link href="/forms/new">
              <Plus className="mr-2 h-4 w-4" />
              Yeni Form
            </Link>
          </Button>
          
          <ThemeSwitcher />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <UserCircle className="h-8 w-8" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Ahmet Yılmaz</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    ahmet.yilmaz@robotpos.com
                  </p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <UserCircle className="mr-2 h-4 w-4" />
                <span>Profil</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                <span>Çıkış Yap</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}