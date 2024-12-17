"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, RocketIcon, Loader2 } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500))

    if (username === "robotpos" && password === "123") {
      document.cookie = "isAuthenticated=true; path=/"
      router.push("/")
      router.refresh()
    } else {
      setError("Kullanıcı adı veya parola hatalı!")
      setIsLoading(false)
    }
  }

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault()
    // Bu fonksiyon şimdilik sadece bir alert gösterecek
    alert("Şifre sıfırlama özelliği yakında eklenecek!")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-4">
      <Card className="w-[400px] shadow-2xl border border-white/20 backdrop-blur-sm bg-white/90 transition-all duration-300 hover:shadow-3xl">
        <CardHeader className="space-y-1 text-center pb-2">
          <div className="w-full flex justify-center mb-4">
            <div className="p-3 rounded-full bg-blue-500 text-white">
              <RocketIcon className="h-8 w-8" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            robotPOS Operation Manager&apos;a Hoşgeldiniz
          </CardTitle>
          <p className="text-sm text-gray-600">Lütfen hesabınıza giriş yapın</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <Alert variant="destructive" className="animate-shake">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="username" className="text-gray-700 font-medium">Kullanıcı Adı</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={isLoading}
                placeholder="Kullanıcı adınızı girin"
                className="w-full transition-all duration-300 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="text-gray-700 font-medium">Parola</Label>
                <button
                  onClick={handleForgotPassword}
                  className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Parolamı unuttum
                </button>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                placeholder="••••••••"
                className="w-full transition-all duration-300 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Giriş yapılıyor...
                </>
              ) : (
                "Giriş Yap"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 pt-0">
          <div className="relative w-full">
            <Separator className="my-4" />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-sm text-gray-500">
              veya
            </div>
          </div>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => alert("Demo hesabı özelliği yakında eklenecek!")}
          >
            Demo Hesabı ile Giriş Yap
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
