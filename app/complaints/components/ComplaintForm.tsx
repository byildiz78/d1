"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
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
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ComplaintInput } from "@/lib/complaint-api"

const complaintSchema = z.object({
  title: z.string().min(1, "Başlık zorunludur").max(200, "Başlık en fazla 200 karakter olabilir"),
  description: z.string().min(1, "Açıklama zorunludur"),
  branchId: z.coerce.number().min(1, "Şube seçimi zorunludur"),
  source: z.string().min(1, "Kaynak seçimi zorunludur"),
  status: z.string().min(1, "Durum seçimi zorunludur"),
  priority: z.string().min(1, "Öncelik seçimi zorunludur"),
  assignedTo: z.coerce.number().min(1, "Atanan kişi seçimi zorunludur"),
  observers: z.string(),
  customerName: z.string().min(1, "Müşteri adı zorunludur"),
  customerContact: z.string().min(1, "Müşteri iletişim bilgisi zorunludur"),
})

interface ComplaintFormProps {
  initialData?: ComplaintInput
  onSubmit: (data: ComplaintInput) => Promise<void>
  isSubmitting?: boolean
  branches: Array<{ id: number; name: string }>
  users: Array<{ id: number; name: string }>
}

export function ComplaintForm({
  initialData,
  onSubmit,
  isSubmitting = false,
  branches,
  users,
}: ComplaintFormProps) {
  const form = useForm<ComplaintInput>({
    resolver: zodResolver(complaintSchema),
    defaultValues: initialData || {
      title: "",
      description: "",
      branchId: 0,
      source: "",
      status: "open",
      priority: "medium",
      assignedTo: 0,
      observers: "",
      customerName: "",
      customerContact: "",
    },
  })

  const handleSubmit = async (data: ComplaintInput) => {
    try {
      await onSubmit(data)
    } catch (error) {
      // Form submission error will be handled by the parent component
      throw error
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Başlık</FormLabel>
              <FormControl>
                <Input {...field} />
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
                <Textarea {...field} className="min-h-[100px]" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="branchId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Şube</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(parseInt(value))}
                  defaultValue={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Şube seçin" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {branches.map((branch) => (
                      <SelectItem key={branch.id} value={branch.id.toString()}>
                        {branch.name}
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
                    <SelectItem value="website">Website</SelectItem>
                    <SelectItem value="email">E-posta</SelectItem>
                    <SelectItem value="sikayetvar">Şikayetvar</SelectItem>
                    <SelectItem value="call_center">Çağrı Merkezi</SelectItem>
                    <SelectItem value="twitter">Twitter</SelectItem>
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="instagram">Instagram</SelectItem>
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
                    <SelectItem value="resolved">Çözüldü</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="assignedTo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Atanan Kişi</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(parseInt(value))}
                  defaultValue={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Kişi seçin" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id.toString()}>
                        {user.name}
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
            name="observers"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gözlemciler</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Virgülle ayırarak girin" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="customerName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Müşteri Adı</FormLabel>
                <FormControl>
                  <Input {...field} />
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
                <FormLabel>Müşteri İletişim</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="E-posta veya telefon" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Kaydediliyor..." : "Kaydet"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
