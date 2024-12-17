"use client"

import { UserCircle, Plus, ClipboardList, Settings, Home, Menu, FileText, MessageSquare, LogOut } from "lucide-react"
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
import { useRouter } from "next/navigation"

export function TopMenu() {
  const router = useRouter()

  const handleLogout = () => {
    document.cookie = "isAuthenticated=false; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    router.push("/login")
    router.refresh()
  }

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
          <span className="ml-2 text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-400 hidden sm:block">operation manager</span>
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
            <Link href="/complaints">
              <MessageSquare className="mr-2 h-4 w-4" />
              Şikayet Yönetimi
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/reports">
              <FileText className="mr-2 h-4 w-4" />
              Raporlar
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/settings">
              <Settings className="mr-2 h-4 w-4" />
              Ayarlar
            </Link>
          </Button>
        </div>

        <div className="flex items-center ml-auto space-x-4">
          <ThemeSwitcher />
          <Button variant="ghost" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Çıkış Yap
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
                <Link href="/complaints" className="flex items-center">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Şikayet Yönetimi
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/reports" className="flex items-center">
                  <FileText className="mr-2 h-4 w-4" />
                  Raporlar
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings" className="flex items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  Ayarlar
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Çıkış Yap
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}