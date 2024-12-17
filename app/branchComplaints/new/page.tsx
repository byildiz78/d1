'use client'

import Link from 'next/link'
import { ArrowLeft, User, MessageCircle } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FileUpload } from '../components/file-upload'
import { ManagerSelect } from '../components/manager-select'
import { ObserverSelect } from '../components/observer-select'

const formSchema = z.object({
  branchName: z.string().min(1, 'Şube adı gereklidir'),
  title: z.string().min(1, 'Başlık gereklidir'),
  description: z.string().min(1, 'Açıklama gereklidir'),
  source: z.string().min(1, 'Kaynak seçimi gereklidir'),
  priority: z.string().min(1, 'Öncelik seçimi gereklidir'),
  status: z.string().min(1, 'Durum seçimi gereklidir'),
  assignedTo: z.string().optional(),
  observers: z.array(z.string()).default([]),
  files: z.array(z.string()).default([]),
})

export default function NewBranchComplaintPage() {
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
            <Link href="/branchComplaints">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
              Yeni Bayi Şikayeti
            </h2>
          </div>
          <p className="text-muted-foreground">
            Yeni bir bayi şikayeti veya talebi oluşturun
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid gap-8 md:grid-cols-[2fr,1fr]">
            <div className="space-y-6">
              {/* Bayi Bilgileri */}
              <Card className="p-6 border-2 border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50/50 to-pink-50/30 dark:from-purple-900/20 dark:to-pink-900/10 shadow-xl shadow-purple-500/10 dark:shadow-purple-500/5">
                <div className="space-y-6">
                  <div className="flex items-center gap-2">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/30 dark:shadow-purple-500/20">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                      Bayi Bilgileri
                    </h3>
                  </div>
                  <Separator className="bg-purple-200/50 dark:bg-purple-800/50" />

                  <FormField
                    control={form.control}
                    name="branchName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bayi/Şube Adı</FormLabel>
                        <FormControl>
                          <Input placeholder="Bayi/Şube adı" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                      Şikayet/Talep Detayları
                    </h3>
                  </div>
                  <Separator className="bg-blue-200/50 dark:bg-blue-800/50" />
                  
                  <div className="grid gap-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Başlık</FormLabel>
                          <FormControl>
                            <Input placeholder="Şikayet/Talep başlığı" {...field} />
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
                              placeholder="Şikayet/Talep detaylarını yazın"
                              className="min-h-[100px]"
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
                                <SelectItem value="center">Merkez</SelectItem>
                                <SelectItem value="supplier">Tedarikçi</SelectItem>
                                <SelectItem value="other">Diğer</SelectItem>
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
                </div>
              </Card>
            </div>

            {/* Sağ Panel */}
            <div className="space-y-6">
              <Card className="p-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Şikayet Durumu</h4>
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
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
              </Card>

              <Card className="p-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Atamalar</h4>
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
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </Card>

              <Card className="p-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Dosyalar</h4>
                  <FormField
                    control={form.control}
                    name="files"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <FileUpload
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </Card>

              <Button type="submit" className="w-full">
                Şikayeti Oluştur
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}
