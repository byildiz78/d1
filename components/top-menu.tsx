"use client"

import { UserCircle, Plus, ClipboardList, Settings, Home, Menu } from "lucide-react"
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
import Image from "next/image"

export function TopMenu() {
  return (
    <div className="border-b bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 dark:from-blue-500/5 dark:via-purple-500/5 dark:to-pink-500/5">
      <div className="flex h-16 items-center px-4 shadow-sm">
        <Link href="/" className="flex items-center">
          <Image
            src="/robotpos-logo.svg"
            alt="robotPOS Logo"
            width={120}
            height={40}
            className="dark:invert hidden sm:block"
          />
          <Image
            src="/robotpos-logo.svg"
            alt="robotPOS Logo"
            width={40}
            height={40}
            className="dark:invert sm:hidden"
          />
          <span className="ml-2 text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400 hidden sm:block">denetmen</span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="ml-8 hidden md:flex items-center space-x-4">
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
        
        {/* Mobile Navigation */}
        <div className="ml-4 md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuItem asChild>
                <Link href="/" className="flex items-center">
                  <Home className="mr-2 h-4 w-4" />
                  Ana Sayfa
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/forms" className="flex items-center">
                  <ClipboardList className="mr-2 h-4 w-4" />
                  Formlar
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings" className="flex items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  Ayarlar
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="ml-auto flex items-center space-x-4">
          <Button asChild>
            <Link href="/forms/new">
              <Plus className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Yeni Form</span>
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