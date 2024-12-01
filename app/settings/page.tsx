'use client'

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2, XCircle } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useState } from "react"
import { toast } from "sonner"
import { testDatabaseConnection, saveConnection, showConnection } from "@/app/actions/database"
import QuerySection from '../components/QuerySection'

const settingsSchema = z.object({
  companyName: z.string().min(2, {
    message: "Şirket adı en az 2 karakter olmalıdır.",
  }),
  email: z.string().email({
    message: "Geçerli bir e-posta adresi giriniz.",
  }),
  notifications: z.boolean().default(true),
  autoSave: z.boolean().default(true),
  dbConnection: z.string().optional(),
})

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null)
  
  const form = useForm<z.infer<typeof settingsSchema>>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      companyName: "RobotPOS",
      email: "info@robotpos.com",
      notifications: true,
      autoSave: true,
    },
  })

  function onSubmit(values: z.infer<typeof settingsSchema>) {
    console.log(values)
  }

  async function handleTestConnection(connection: string) {
    if (!connection) {
      toast.error("Lütfen bağlantı bilgilerini giriniz")
      return
    }

    console.log("Testing connection...")
    setIsLoading(true)
    setTestResult(null)
    
    try {
      const result = await testDatabaseConnection(connection)
      console.log("Test result:", result)

      if (result.success) {
        setTestResult({ success: true, message: result.message })
        toast.success(result.message)
      } else {
        setTestResult({ success: false, message: result.error })
        toast.error(result.error)
      }
    } catch (error: any) {
      console.error("Error testing connection:", error)
      const message = `Bağlantı testi sırasında bir hata oluştu: ${error.message}`
      setTestResult({ success: false, message })
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSaveConnection(connection: string) {
    if (!connection) {
      toast.error("Lütfen bağlantı bilgilerini giriniz")
      return
    }

    setIsLoading(true)
    try {
      const result = await saveConnection(connection)
      if (result.success) {
        toast.success(result.message)
      } else {
        toast.error(result.error)
      }
    } catch (error: any) {
      toast.error(`Bağlantı kaydedilirken hata oluştu: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleShowConnection() {
    setIsLoading(true)
    try {
      const result = await showConnection()
      if (result.success) {
        form.setValue("dbConnection", result.connection)
        toast.success("Bağlantı bilgileri yüklendi")
      } else {
        toast.error(result.error)
      }
    } catch (error: any) {
      toast.error(`Bağlantı bilgileri yüklenirken hata oluştu: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-2xl font-bold mb-4">Ayarlar</h1>
      
      <div className="space-y-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Genel Ayarlar</h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Şirket Adı</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-posta Adresi</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <h3 className="text-lg font-medium pt-4">Bildirim Ayarları</h3>
                <Separator />

                <FormField
                  control={form.control}
                  name="notifications"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Bildirimler
                        </FormLabel>
                        <FormDescription>
                          Yeni denetimler ve güncellemeler hakkında bildirim alın
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="autoSave"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Otomatik Kaydetme
                        </FormLabel>
                        <FormDescription>
                          Denetim formlarını otomatik olarak kaydet
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit">Değişiklikleri Kaydet</Button>
            </form>
          </Form>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Veritabanı Bağlantısı</h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="dbConnection"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Veritabanı Bağlantısı</FormLabel>
                      <FormControl>
                        <div className="space-y-4">
                          <Input {...field} type="text" placeholder="mssql+pyodbc://username:password@hostname,port/database" />
                          {testResult && (
                            <Alert variant={testResult.success ? "default" : "destructive"}>
                              {testResult.success ? (
                                <CheckCircle2 className="h-4 w-4" />
                              ) : (
                                <XCircle className="h-4 w-4" />
                              )}
                              <AlertTitle>
                                {testResult.success ? "Bağlantı Başarılı" : "Bağlantı Hatası"}
                              </AlertTitle>
                              <AlertDescription>
                                {testResult.message}
                              </AlertDescription>
                            </Alert>
                          )}
                          <div className="flex space-x-2">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => handleTestConnection(field.value)}
                              disabled={isLoading}
                            >
                              {isLoading ? "İşleniyor..." : "Test Et"}
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => handleSaveConnection(field.value)}
                              disabled={isLoading}
                            >
                              {isLoading ? "İşleniyor..." : "Kaydet"}
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={handleShowConnection}
                              disabled={isLoading}
                            >
                              {isLoading ? "İşleniyor..." : "Göster"}
                            </Button>
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit">Değişiklikleri Kaydet</Button>
            </form>
          </Form>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <QuerySection />
        </div>
      </div>
    </div>
  )
}