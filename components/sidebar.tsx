import { HomeIcon, ClipboardList, Settings } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Sidebar() {
  return (
    <div className="pb-12 min-h-screen w-64 border-r bg-card shadow-lg">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold">Denetim Sistemi</h2>
          <div className="space-y-1">
            <Link href="/">
              <Button variant="ghost" className="w-full justify-start">
                <HomeIcon className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <Link href="/forms">
              <Button variant="ghost" className="w-full justify-start">
                <ClipboardList className="mr-2 h-4 w-4" />
                Denetim Formları
              </Button>
            </Link>
            <Link href="/settings">
              <Button variant="ghost" className="w-full justify-start">
                <Settings className="mr-2 h-4 w-4" />
                Ayarlar
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}