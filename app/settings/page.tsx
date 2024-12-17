'use client'

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { cn } from "@/lib/utils"
import { CheckCircle2, XCircle, TestTube, Loader2 } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { testApiConnection } from "@/app/actions/database"
import QuerySection from '../components/QuerySection'

const settingsSchema = z.object({
  companyName: z.string().min(2, {
    message: "Şirket adı en az 2 karakter olmalıdır.",
  }),
  email: z.string().email({
    message: "Geçerli bir e-posta adresi giriniz.",
  }),
  notifications: z.boolean(),
  autoSave: z.boolean(),
  apiUrl: z.string().url({
    message: "Geçerli bir API URL'si giriniz.",
  }),
  apiToken: z.string().min(1, {
    message: "API Token'ı boş olamaz.",
  }),
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
      apiUrl: "",
      apiToken: "",
    },
  })

  useEffect(() => {
    // Mevcut API ayarlarını yükle
    async function loadApiSettings() {
      try {
        const response = await fetch('/api/settings');
        const data = await response.json();
        if (data.success) {
          form.setValue("apiUrl", data.apiUrl || "");
          form.setValue("apiToken", data.apiToken || "");
        }
      } catch (error) {
        console.error("Error loading API settings:", error);
      }
    }

    loadApiSettings();
  }, [form]);

  function onSubmit(values: z.infer<typeof settingsSchema>) {
    console.log(values)
  }

  async function handleTestApiConnection() {
    const apiUrl = form.getValues("apiUrl")
    const apiToken = form.getValues("apiToken")

    if (!apiUrl || !apiToken) {
      toast.error("Lütfen API URL ve Token bilgilerini giriniz")
      return
    }

    setIsLoading(true)
    setTestResult(null)
    
    try {
      const result = await testApiConnection(apiUrl, apiToken)
      
      if (result.success) {
        setTestResult({ success: true, message: result.message })
        toast.success(result.message)
      } else {
        setTestResult({ success: false, message: result.message })
        toast.error(result.message)
      }
    } catch (error: any) {
      console.error("Error testing API connection:", error)
      const message = `API bağlantı testi sırasında bir hata oluştu: ${error.message}`
      setTestResult({ success: false, message })
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-2xl font-bold mb-4">Ayarlar</h1>

      <div className="space-y-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid gap-6">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">API Ayarları</h3>
                  <p className="text-sm text-muted-foreground">
                    API bağlantı ayarlarını yapılandırın.
                  </p>
                </div>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <FormField
                      control={form.control}
                      name="apiUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>API URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://api.example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid gap-2">
                    <FormField
                      control={form.control}
                      name="apiToken"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>API Token</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={handleTestApiConnection}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Test Ediliyor
                        </>
                      ) : (
                        <>
                          <TestTube className="mr-2 h-4 w-4" />
                          Bağlantıyı Test Et
                        </>
                      )}
                    </Button>
                    {testResult && (
                      <div className="flex items-center gap-2">
                        {testResult.success ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                        <span
                          className={cn(
                            "text-sm",
                            testResult.success ? "text-green-500" : "text-red-500"
                          )}
                        >
                          {testResult.message}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Genel Ayarlar</h3>
                  <p className="text-sm text-muted-foreground">
                    Genel uygulama ayarlarını yapılandırın.
                  </p>
                </div>
                <div className="grid gap-4">
                  <div className="grid gap-2">
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
                  </div>
                  <div className="grid gap-2">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>E-posta</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid gap-2">
                    <FormField
                      control={form.control}
                      name="notifications"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                          <div className="space-y-0.5">
                            <FormLabel>Bildirimler</FormLabel>
                            <FormDescription>
                              Bildirim almak istediğinizde size e-posta gönderilir.
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
                  <div className="grid gap-2">
                    <FormField
                      control={form.control}
                      name="autoSave"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                          <div className="space-y-0.5">
                            <FormLabel>Otomatik Kaydetme</FormLabel>
                            <FormDescription>
                              Değişiklikleri otomatik olarak kaydet.
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
                </div>
              </div>
            </div>
            <Button type="submit">Kaydet</Button>
          </form>
        </Form>
      </div>
    </div>
  )
}