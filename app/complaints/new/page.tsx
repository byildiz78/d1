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
import { AlertCircle, Building2, MessageCircle, User, ArrowLeft } from "lucide-react"
import Link from "next/link"

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
})

export default function NewComplaintPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      observers: [],
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  return (
    <div className="flex-1 space-y-4 p-8">
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Şikayet Detayları */}
          <Card className="p-6">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                  <MessageCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold">Şikayet Detayları</h3>
              </div>
              <Separator />
              
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </Card>

          {/* Müşteri Bilgileri */}
          <Card className="p-6">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900">
                  <User className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold">Müşteri Bilgileri</h3>
              </div>
              <Separator />

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

          {/* Atama Bilgileri */}
          <Card className="p-6">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900">
                  <Building2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-semibold">Atama Bilgileri</h3>
              </div>
              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button variant="outline" asChild>
              <Link href="/complaints">İptal</Link>
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <AlertCircle className="mr-2 h-4 w-4" />
              Şikayet Oluştur
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}