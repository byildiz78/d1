import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from "@/components/theme-provider"
import { ConditionalTopMenu } from '@/components/conditional-top-menu'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Restoran Denetim Sistemi',
  description: 'Restoran zinciri denetim yönetim sistemi',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          themes={["light", "dark", "blue", "red"]}
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col">
            <ConditionalTopMenu />
            <main className="flex-1 overflow-y-auto bg-background">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}