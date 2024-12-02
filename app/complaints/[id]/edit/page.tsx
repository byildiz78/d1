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
  Mail,
  CheckCircle2,
  XCircle,
  HelpCircle
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
  newComment: z.string().optional(),
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
      newComment: "",
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

  const getTimelineIcon = (type: string) => {
    switch (type) {
      case "edit":
        return <AlertCircle className="h-5 w-5" />
      case "comment":
        return <MessageCircle className="h-5 w-5" />
      default:
        return <History className="h-5 w-5" />
    }
  }

  const getTimelineColor = (type: string) => {
    switch (type) {
      case "edit":
        return "bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400"
      case "comment":
        return "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400"
      default:
        return "bg-gray-100 text-gray-600 dark:bg-gray-900/50 dark:text-gray-400"
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
            {/* New Comment Section */}
            <Card className="p-6 border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50/50 to-indigo-50/30 dark:from-blue-900/20 dark:to-indigo-900/10 shadow-xl shadow-blue-500/10 dark:shadow-blue-500/5">
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 shadow-lg shadow-blue-500/30 dark:shadow-blue-500/20">
                    <MessageCircle className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                    Yeni Yorum Ekle
                  </h3>
                </div>
                <Separator className="bg-blue-200/50 dark:bg-blue-800/50" />
                
                <FormField
                  control={form.control}
                  name="newComment"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="Yorumunuzu buraya yazın..."
                          className="min-h-[120px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </Card>

            {/* Şikayet Detayları */}
            <Card className="p-6 border-2 border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50/50 to-pink-50/30 dark:from-purple-900/20 dark:to-pink-900/10 shadow-xl shadow-purple-500/10 dark:shadow-purple-500/5">
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/30 dark:shadow-purple-500/20">
                    <AlertCircle className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                    Şikayet Detayları
                  </h3>
                </div>
                <Separator className="bg-purple-200/50 dark:bg-purple-800/50" />
                
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
            <Card className="p-6 border-2 border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50/50 to-emerald-50/30 dark:from-green-900/20 dark:to-emerald-900/10 shadow-xl shadow-green-500/10 dark:shadow-green-500/5">
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 shadow-lg shadow-green-500/30 dark:shadow-green-500/20">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
                    Müşteri Bilgileri
                  </h3>
                </div>
                <Separator className="bg-green-200/50 dark:bg-green-800/50" />

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
            <Card className="p-6 border-2 border-amber-200 dark:border-amber-800 bg-gradient-to-br from-amber-50/50 to-orange-50/30 dark:from-amber-900/20 dark:to-orange-900/10 shadow-xl shadow-amber-500/10 dark:shadow-amber-500/5">
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg shadow-amber-500/30 dark:shadow-amber-500/20">
                    <Building2 className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400 bg-clip-text text-transparent">
                    Atama Bilgileri
                  </h3>
                </div>
                <Separator className="bg-amber-200/50 dark:bg-amber-800/50" />

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
          <Card className="p-6 border-2 border-rose-200 dark:border-rose-800 bg-gradient-to-br from-rose-50/50 to-pink-50/30 dark:from-rose-900/20 dark:to-pink-900/10 shadow-xl shadow-rose-500/10 dark:shadow-rose-500/5">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <div className="p-3 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 shadow-lg shadow-rose-500/30 dark:shadow-rose-500/20">
                  <History className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold bg-gradient-to-r from-rose-600 to-pink-600 dark:from-rose-400 dark:to-pink-400 bg-clip-text text-transparent">
                  Değişiklik Geçmişi
                </h3>
              </div>
              <Separator className="bg-rose-200/50 dark:bg-rose-800/50" />

              <div className="relative space-y-6">
                {/* Timeline Line */}
                <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-rose-200 to-pink-200 dark:from-rose-800 dark:to-pink-800" />

                {existingComplaint.history.map((item, index) => (
                  <div
                    key={item.id}
                    className={cn(
                      "relative pl-12",
                      "before:absolute before:left-5 before:top-6 before:w-2 before:h-2 before:bg-white dark:before:bg-gray-900 before:rounded-full before:z-10",
                      "after:absolute after:left-4 after:top-5 after:w-4 after:h-4 after:rounded-full",
                      item.type === "edit" 
                        ? "after:bg-amber-200 dark:after:bg-amber-800" 
                        : "after:bg-blue-200 dark:after:bg-blue-800"
                    )}
                  >
                    <div className={cn(
                      "p-4 rounded-lg",
                      item.type === "edit"
                        ? "bg-amber-50/50 dark:bg-amber-900/20 border-2 border-amber-200/50 dark:border-amber-800/50"
                        : "bg-blue-50/50 dark:bg-blue-900/20 border-2 border-blue-200/50 dark:border-blue-800/50"
                    )}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{item.user}</span>
                          <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800">
                            {item.type === "edit" ? "Düzenleme" : "Yorum"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDateTime(item.timestamp).date}</span>
                          <Clock className="h-4 w-4" />
                          <span>{formatDateTime(item.timestamp).time}</span>
                        </div>
                      </div>
                      {item.type === "edit" ? (
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-medium">{item.field}</span>
                          <span className="text-muted-foreground">alanı</span>
                          <span className="px-2 py-0.5 rounded bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">
                            {item.oldValue}
                          </span>
                          <span className="text-muted-foreground">değerinden</span>
                          <span className="px-2 py-0.5 rounded bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                            {item.newValue}
                          </span>
                          <span className="text-muted-foreground">değerine güncellendi</span>
                        </div>
                      ) : (
                        <p className="text-sm">{item.content}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}