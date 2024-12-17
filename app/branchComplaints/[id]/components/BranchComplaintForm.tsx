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
import { FileUpload } from "../../components/file-upload"
import { MessageCircle, Building2, User, Save, ArrowLeft, FileUp, History as HistoryIcon } from "lucide-react"
import Link from "next/link"

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Başlık en az 2 karakter olmalıdır.",
  }),
  description: z.string().min(10, {
    message: "Açıklama en az 10 karakter olmalıdır.",
  }),
  branchName: z.string().min(2, {
    message: "Lütfen bir şube/bayi seçin.",
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
  files: z.array(z.instanceof(File)).optional(),
  newComment: z.string().optional(),
})

interface BranchComplaintFormProps {
  id: string
  initialData: any
}

export function BranchComplaintForm({ id, initialData }: BranchComplaintFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData.title,
      description: initialData.description,
      branchName: initialData.branchName,
      source: initialData.source,
      priority: initialData.priority,
      status: initialData.status,
      assignedTo: initialData.assignedTo,
      observers: initialData.observers,
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
            {/* Şube/Bayi Bilgileri */}
            <Card className="p-6 border-2 border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50/50 to-emerald-50/30 dark:from-green-900/20 dark:to-emerald-900/10 shadow-xl shadow-green-500/10 dark:shadow-green-500/5">
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 shadow-lg shadow-green-500/30 dark:shadow-green-500/20">
                    <Building2 className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
                    Şube/Bayi Bilgileri
                  </h3>
                </div>
                <Separator className="bg-green-200/50 dark:bg-green-800/50" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="branchName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Şube/Bayi Adı</FormLabel>
                        <FormControl>
                          <Input placeholder="Şube/bayi adı" {...field} />
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
                            <SelectItem value="supplier">Tedarikçi</SelectItem>
                            <SelectItem value="center">Merkez</SelectItem>
                            <SelectItem value="other">Diğer</SelectItem>
                          </SelectContent>
                        </Select>
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
                
                <div className="grid grid-cols-1 gap-6">
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
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Açıklama</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Şikayet detaylarını yazın..."
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              </div>
            </Card>

            {/* Dosya Yükleme */}
            <Card className="p-6 border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50/50 to-indigo-50/30 dark:from-blue-900/20 dark:to-indigo-900/10 shadow-xl shadow-blue-500/10 dark:shadow-blue-500/5">
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 shadow-lg shadow-blue-500/30 dark:shadow-blue-500/20">
                    <FileUp className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                    Dosya Yükleme
                  </h3>
                </div>
                <Separator className="bg-blue-200/50 dark:bg-blue-800/50" />

                <FormField
                  control={form.control}
                  name="files"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          value={field.value}
                          onChange={field.onChange}
                          onRemove={(fileToRemove) => {
                            field.onChange(
                              field.value?.filter((file) => file !== fileToRemove)
                            )
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Yönetici Atama */}
            <Card className="p-6 border-2 border-amber-200 dark:border-amber-800 bg-gradient-to-br from-amber-50/50 to-yellow-50/30 dark:from-amber-900/20 dark:to-yellow-900/10 shadow-xl shadow-amber-500/10 dark:shadow-amber-500/5">
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-500 shadow-lg shadow-amber-500/30 dark:shadow-amber-500/20">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold bg-gradient-to-r from-amber-600 to-yellow-600 dark:from-amber-400 dark:to-yellow-400 bg-clip-text text-transparent">
                    Yönetici Atama
                  </h3>
                </div>
                <Separator className="bg-amber-200/50 dark:bg-amber-800/50" />

                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="assignedTo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sorumlu Yönetici</FormLabel>
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

            {/* Geçmiş */}
            <Card className="p-6 border-2 border-gray-200 dark:border-gray-800">
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <HistoryIcon className="h-5 w-5 text-muted-foreground" />
                  <h3 className="text-lg font-semibold">Geçmiş</h3>
                </div>
                <Separator />
                <div className="space-y-4">
                  {initialData.timeline?.map((item: any) => (
                    <div key={item.id} className="flex items-start gap-3">
                      <div className="mt-1">
                        <MessageCircle className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm">{item.content}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{item.author}</span>
                          <span>•</span>
                          <span>{new Date(item.createdAt).toLocaleDateString('tr-TR')}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Button variant="outline" asChild>
            <Link href="/branchComplaints">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Geri Dön
            </Link>
          </Button>
          <Button type="submit">
            <Save className="mr-2 h-4 w-4" />
            Kaydet
          </Button>
        </div>
      </form>
    </Form>
  )
}
