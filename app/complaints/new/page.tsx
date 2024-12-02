"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ManagerSelect } from "../components/manager-select"
import { ObserverSelect } from "../components/observer-select"
import { ComplaintSource, complaintSourceMap } from "../types"
import { MessageCircle, Building2, User, Send, ArrowLeft, FileUp } from "lucide-react"
import Link from "next/link"
import { FileUpload } from "../components/file-upload"

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Başlık en az 2 karakter olmalıdır.",
  }),
  description: z.string().min(10, {
    message: "Açıklama en az 10 karakter olmalıdır.",
  }),
  branch: z.string().min(2, {
    message: "Lütfen bir şube seçin.",
  }),
  source: z.string({
    required_error: "Lütfen bir kaynak seçin.",
  }),
  priority: z.string({
    required_error: "Lütfen bir öncelik seçin.",
  }),
  assignedTo: z.string({
    required_error: "Lütfen bir yönetici seçin.",
  }),
  observers: z.array(z.string()).optional(),
  customerName: z.string().min(2, {
    message: "Müşteri adı en az 2 karakter olmalıdır.",
  }),
  customerContact: z.string().min(5, {
    message: "İletişim bilgisi en az 5 karakter olmalıdır.",
  }),
  files: z.array(z.instanceof(File)).optional(),
})

export default function NewComplaintPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      observers: [],
      files: [],
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  return (
    <div className="flex-1 space-y-8 p-8 bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-900 dark:to-gray-800/50">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link href="/complaints">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
              Yeni Şikayet Kaydı
            </h2>
          </div>
          <p className="text-muted-foreground">
            Yeni bir müşteri şikayeti oluşturun
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid gap-8 md:grid-cols-[2fr,1fr]">
            <div className="space-y-6">
              {/* Müşteri Bilgileri */}
              <Card className="p-6 border-2 border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50/50 to-pink-50/30 dark:from-purple-900/20 dark:to-pink-900/10 shadow-xl shadow-purple-500/10 dark:shadow-purple-500/5">
                <div className="space-y-6">
                  <div className="flex items-center gap-2">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/30 dark:shadow-purple-500/20">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                      Müşteri Bilgileri
                    </h3>
                  </div>
                  <Separator className="bg-purple-200/50 dark:bg-purple-800/50" />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="customerName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Müşteri Adı</FormLabel>
                          <FormControl>
                            <Input placeholder="Müşteri adı" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="customerContact"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>İletişim Bilgisi</FormLabel>
                          <FormControl>
                            <Input placeholder="Telefon veya e-posta" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </Card>

              {/* Şikayet Detayları */}
              <Card className="p-6 border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50/50 to-indigo-50/30 dark:from-blue-900/20 dark:to-indigo-900/10 shadow-xl shadow-blue-500/10 dark:shadow-blue-500/5">
                <div className="space-y-6">
                  <div className="flex items-center gap-2">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 shadow-lg shadow-blue-500/30 dark:shadow-blue-500/20">
                      <MessageCircle className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                      Şikayet Detayları
                    </h3>
                  </div>
                  <Separator className="bg-blue-200/50 dark:bg-blue-800/50" />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Başlık</FormLabel>
                          <FormControl>
                            <Input placeholder="Şikayet başlığı" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="branch"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Şube</FormLabel>
                          <FormControl>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Şube seçin" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="kadikoy">Kadıköy Şubesi</SelectItem>
                                <SelectItem value="besiktas">Beşiktaş Şubesi</SelectItem>
                                <SelectItem value="sisli">Şişli Şubesi</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel>Açıklama</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Şikayet detaylarını girin"
                              className="min-h-[120px] resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="source"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Kaynak</FormLabel>
                          <FormControl>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Kaynak seçin" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {Object.entries(complaintSourceMap).map(([key, value]) => (
                                  <SelectItem key={key} value={key}>
                                    {value}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="priority"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Öncelik</FormLabel>
                          <FormControl>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Öncelik seçin" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="high">Yüksek</SelectItem>
                                <SelectItem value="medium">Orta</SelectItem>
                                <SelectItem value="low">Düşük</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </Card>
            </div>

            <div className="space-y-6">
              {/* Dosyalar */}
              <Card className="p-6 border-2 border-indigo-200 dark:border-indigo-800 bg-gradient-to-br from-indigo-50/50 to-violet-50/30 dark:from-indigo-900/20 dark:to-violet-900/10 shadow-xl shadow-indigo-500/10 dark:shadow-indigo-500/5">
                <div className="space-y-6">
                  <div className="flex items-center gap-2">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 shadow-lg shadow-indigo-500/30 dark:shadow-indigo-500/20">
                      <FileUp className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent">
                      Dosyalar
                    </h3>
                  </div>
                  <Separator className="bg-indigo-200/50 dark:bg-indigo-800/50" />

                  <FormField
                    control={form.control}
                    name="files"
                    render={({ field: { value, onChange } }) => (
                      <FormItem>
                        <FormControl>
                          <FileUpload
                            value={value}
                            onChange={onChange}
                            onRemove={(file) => {
                              onChange(value?.filter((f) => f !== file))
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </Card>

              {/* Atama Bilgileri */}
              <Card className="p-6 border-2 border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50/50 to-emerald-50/30 dark:from-green-900/20 dark:to-emerald-900/10 shadow-xl shadow-green-500/10 dark:shadow-green-500/5">
                <div className="space-y-6">
                  <div className="flex items-center gap-2">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 shadow-lg shadow-green-500/30 dark:shadow-green-500/20">
                      <Building2 className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
                      Atama Bilgileri
                    </h3>
                  </div>
                  <Separator className="bg-green-200/50 dark:bg-green-800/50" />

                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="assignedTo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Atanan Yönetici</FormLabel>
                          <FormControl>
                            <ManagerSelect
                              value={field.value}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="observers"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gözlemciler</FormLabel>
                          <FormControl>
                            <ObserverSelect
                              value={field.value || []}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </Card>

              {/* Submit Buttons */}
              <div className="flex flex-col gap-3">
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 dark:shadow-blue-500/15"
                >
                  <Send className="mr-2 h-4 w-4" />
                  Şikayet Oluştur
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full border-2 hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-950" 
                  asChild
                >
                  <Link href="/complaints">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    İptal
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}