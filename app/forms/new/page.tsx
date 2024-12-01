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
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const formSchema = z.object({
  formType: z.string({
    required_error: "Lütfen bir form tipi seçin.",
  }),
  restaurant: z.string().min(2, {
    message: "Lütfen bir restoran seçin.",
  }),
  notes: z.string().min(10, {
    message: "Notlar en az 10 karakter olmalıdır.",
  }),
})

export default function NewFormPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Yeni Denetim Formu</h2>
      </div>
      <Card className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="formType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Form Tipi</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Form tipi seçin" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ihtar">İhtar Formu</SelectItem>
                      <SelectItem value="odz">O.D.Z</SelectItem>
                      <SelectItem value="modz">M.O.D.Z</SelectItem>
                      <SelectItem value="sipdz">Ş.İ.P.D.Z.</SelectItem>
                      <SelectItem value="hdz">HDZ</SelectItem>
                      <SelectItem value="kdz">KDZ</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="restaurant"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Restoran</FormLabel>
                  <FormControl>
                    <Input placeholder="Restoran adı" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notlar</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Denetim ile ilgili notlarınızı buraya yazın"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Formu Oluştur</Button>
          </form>
        </Form>
      </Card>
    </div>
  )
}