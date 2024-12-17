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
import { ComplaintHistory } from "./ComplaintHistory"
import { MessageCircle, Building2, User, Save, ArrowLeft, FileUp, History as HistoryIcon } from "lucide-react"
import Link from "next/link"
import { FileUpload } from "../../components/file-upload"

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
  files: z.array(z.instanceof(File)).optional(),
  newComment: z.string().optional(),
})

interface ComplaintFormProps {
  id: string
  initialData: any
}

export function ComplaintForm({ id, initialData }: ComplaintFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData.title,
      description: initialData.description,
      branch: initialData.branch,
      source: initialData.source,
      priority: initialData.priority,
      status: initialData.status,
      assignedTo: initialData.assignedTo,
      observers: initialData.observers,
      customerName: initialData.customerName,
      customerContact: initialData.customerContact,
      files: initialData.files || [],
      newComment: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-8 md:grid-cols-[2fr,1fr]">
          <div className="space-y-6">
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

            {/* Şikayet Detayları */}
            <Card className="p-6 border-2 border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50/50 to-pink-50/30 dark:from-purple-900/20 dark:to-pink-900/10 shadow-xl shadow-purple-500/10 dark:shadow-purple-500/5">
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/30 dark:shadow-purple-500/20">
                    <MessageCircle className="h-5 w-5 text-white" />
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

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Durum</FormLabel>
                        <FormControl>
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
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </Card>

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
          </div>

          <div className="space-y-6">
            {/* Yeni Yorum Ekle */}
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
                <Link href="/complaints">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  İptal
                </Link>
              </Button>
            </div>

            {/* Değişiklik Geçmişi */}
            <Card className="p-6 border-2 border-violet-200 dark:border-violet-800 bg-gradient-to-br from-violet-50/50 to-purple-50/30 dark:from-violet-900/20 dark:to-purple-900/10 shadow-xl shadow-violet-500/10 dark:shadow-violet-500/5">
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 shadow-lg shadow-violet-500/30 dark:shadow-violet-500/20">
                    <HistoryIcon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold bg-gradient-to-r from-violet-600 to-purple-600 dark:from-violet-400 dark:to-purple-400 bg-clip-text text-transparent">
                    Değişiklik Geçmişi
                  </h3>
                </div>
                <Separator className="bg-violet-200/50 dark:bg-violet-800/50" />
                <ComplaintHistory history={initialData.history} />
              </div>
            </Card>
          </div>
        </div>
      </form>
    </Form>
  )
}