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
import { ManagerSelect } from "../../components/manager-select"
import { ObserverSelect } from "../../components/observer-select"
import { ComplaintSource, complaintSourceMap } from "../../types"
import { 
  MessageCircle, 
  Building2, 
  User, 
  Save, 
  ArrowLeft,
  History,
  AlertCircle,
  Clock,
  Calendar,
  Tag,
  Phone,
  Mail
} from "lucide-react"
import Link from "next/link"

// Mock data for the existing complaint
const existingComplaint = {
  id: 1,
  title: "Sipariş Gecikmesi",
  description: "Siparişim 2 saat geçmesine rağmen hala teslim edilmedi.",
  branch: "kadikoy",
  source: "website",
  status: "open",
  priority: "high",
  assignedTo: "1", // Manager ID
  observers: ["1", "2"], // Observer IDs
  customerName: "Mehmet Demir",
  customerContact: "mehmet.demir@email.com",
  customerPhone: "+90 532 123 4567",
  orderNumber: "ORD-2024-1234",
  history: [
    {
      id: 1,
      type: "edit",
      field: "status",
      oldValue: "pending",
      newValue: "open",
      user: "Ahmet Yılmaz",
      timestamp: "2024-03-21T14:30:00"
    },
    {
      id: 2,
      type: "edit",
      field: "priority",
      oldValue: "medium",
      newValue: "high",
      user: "Mehmet Demir",
      timestamp: "2024-03-21T14:35:00"
    },
    {
      id: 3,
      type: "comment",
      content: "Müşteriyle iletişime geçildi",
      user: "Zeynep Kaya",
      timestamp: "2024-03-21T14:40:00"
    }
  ]
}

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
  status: z.string({
    required_error: "Lütfen bir durum seçin.",
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

export default function EditComplaintPage({ params }: { params: { id: string } }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: existingComplaint.title,
      description: existingComplaint.description,
      branch: existingComplaint.branch,
      source: existingComplaint.source,
      priority: existingComplaint.priority,
      status: existingComplaint.status,
      assignedTo: existingComplaint.assignedTo,
      observers: existingComplaint.observers,
      customerName: existingComplaint.customerName,
      customerContact: existingComplaint.customerContact,
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return {
      date: date.toLocaleDateString('tr-TR', { 
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      }),
      time: date.toLocaleTimeString('tr-TR', {
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }

  return (
    <div className="flex-1 space-y-8 p-8 bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-900 dark:to-gray-800/50">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link href={`/complaints/${params.id}`}>
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
              Şikayet Düzenle #{params.id}
            </h2>
          </div>
          <p className="text-muted-foreground">
            Şikayet detaylarını düzenleyin
          </p>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-[2fr,1fr]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Durum</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Durum seçin" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="open">Açık</SelectItem>
                            <SelectItem value="in_progress">İşlemde</SelectItem>
                            <SelectItem value="pending">Beklemede</SelectItem>
                            <SelectItem value="resolved">Çözümlendi</SelectItem>
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
                <Save className="mr-2 h-4 w-4" />
                Değişiklikleri Kaydet
              </Button>
              <Button 
                variant="outline" 
                className="w-full border-2 hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-950" 
                asChild
              >
                <Link href={`/complaints/${params.id}`}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  İptal
                </Link>
              </Button>
            </div>
          </form>
        </Form>

        <div className="space-y-6">
          {/* Değişiklik Geçmişi */}
          <Card className="p-6 border-2 border-amber-200 dark:border-amber-800 bg-gradient-to-br from-amber-50/50 to-orange-50/30 dark:from-amber-900/20 dark:to-orange-900/10 shadow-xl shadow-amber-500/10 dark:shadow-amber-500/5">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg shadow-amber-500/30 dark:shadow-amber-500/20">
                  <History className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400 bg-clip-text text-transparent">
                  Değişiklik Geçmişi
                </h3>
              </div>
              <Separator className="bg-amber-200/50 dark:bg-amber-800/50" />

              <div className="space-y-4">
                {existingComplaint.history.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-4 rounded-lg bg-gradient-to-br from-amber-50/30 to-orange-50/20 dark:from-amber-900/20 dark:to-orange-900/10"
                  >
                    <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/50">
                      {item.type === 'edit' ? (
                        <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                      ) : (
                        <MessageCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">{item.user}</span>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDateTime(item.timestamp).date}</span>
                          <Clock className="h-3 w-3 ml-2" />
                          <span>{formatDateTime(item.timestamp).time}</span>
                        </div>
                      </div>
                      <p className="mt-1 text-sm">
                        {item.type === 'edit' ? (
                          <>
                            <span className="font-medium">{item.field}</span> alanı{' '}
                            <span className="text-red-500 dark:text-red-400">{item.oldValue}</span>{' '}
                            değerinden{' '}
                            <span className="text-green-500 dark:text-green-400">{item.newValue}</span>{' '}
                            değerine güncellendi
                          </>
                        ) : (
                          item.content
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Sipariş Bilgileri */}
          <Card className="p-6 border-2 border-rose-200 dark:border-rose-800 bg-gradient-to-br from-rose-50/50 to-pink-50/30 dark:from-rose-900/20 dark:to-pink-900/10 shadow-xl shadow-rose-500/10 dark:shadow-rose-500/5">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <div className="p-3 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 shadow-lg shadow-rose-500/30 dark:shadow-rose-500/20">
                  <Tag className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold bg-gradient-to-r from-rose-600 to-pink-600 dark:from-rose-400 dark:to-pink-400 bg-clip-text text-transparent">
                  Sipariş Bilgileri
                </h3>
              </div>
              <Separator className="bg-rose-200/50 dark:bg-rose-800/50" />

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-rose-100 dark:bg-rose-900/50">
                    <Tag className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{existingComplaint.orderNumber}</p>
                    <p className="text-xs text-muted-foreground">Sipariş No</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-rose-100 dark:bg-rose-900/50">
                    <Phone className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{existingComplaint.customerPhone}</p>
                    <p className="text-xs text-muted-foreground">Telefon</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-rose-100 dark:bg-rose-900/50">
                    <Mail className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{existingComplaint.customerContact}</p>
                    <p className="text-xs text-muted-foreground">E-posta</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}