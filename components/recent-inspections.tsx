"use client"

import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Calendar, 
  Store, 
  FileText, 
  UserCircle, 
  ClipboardList,
  Users,
  MessageSquare,
  ArrowUpDown,
  Loader2
} from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table"
import { RecentInspection } from "@/app/actions/database"
import { cn } from "@/lib/utils"

interface RecentInspectionsProps {
  inspections: RecentInspection[]
}

function TruncatedCell({ content, maxWidth = "200px" }: { content: string, maxWidth?: string }) {
  if (!content) return null
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="max-w-[200px] md:max-w-[300px] truncate">
            {content}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-xs whitespace-pre-wrap">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

const formColors: { [key: string]: string } = {
  'O.D.Z': 'bg-blue-500',
  'KDZ': 'bg-green-500',
  'HDZ': 'bg-purple-500',
  'M.O.D.Z': 'bg-orange-500',
  'default': 'bg-gray-500'
}

export function RecentInspections({ inspections }: RecentInspectionsProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [loading, setLoading] = useState(true)

  // Yükleme animasyonunu simüle etmek için
  useState(() => {
    const timer = setTimeout(() => setLoading(false), 1000)
    return () => clearTimeout(timer)
  })

  const columns: ColumnDef<RecentInspection>[] = [
    {
      accessorKey: "Tarih",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="-ml-4"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Tarih
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="font-medium whitespace-nowrap">
          {new Date(row.getValue("Tarih")).toLocaleDateString('tr-TR')}
        </div>
      ),
    },
    {
      accessorKey: "Şube",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="-ml-4"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <Store className="h-4 w-4 mr-2" />
            Şube
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="whitespace-nowrap">{row.getValue("Şube")}</div>,
    },
    {
      accessorKey: "Form",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="-ml-4"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <FileText className="h-4 w-4 mr-2" />
            Form
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const form = row.getValue("Form") as string
        const color = formColors[form] || formColors.default
        return (
          <Badge 
            variant="outline" 
            className={cn(
              "whitespace-nowrap text-white border-0",
              color
            )}
          >
            {form}
          </Badge>
        )
      },
    },
    {
      accessorKey: "Denetmen",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="-ml-4"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <UserCircle className="h-4 w-4 mr-2" />
            Denetmen
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="whitespace-nowrap">{row.getValue("Denetmen")}</div>,
    },
    {
      accessorKey: "Açıklama",
      header: () => (
        <div className="flex items-center gap-2">
          <ClipboardList className="h-4 w-4" />
          <span>Açıklama</span>
        </div>
      ),
      cell: ({ row }) => <TruncatedCell content={row.getValue("Açıklama")} maxWidth="200px" />,
    },
    {
      accessorKey: "Notlar",
      header: () => (
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          <span>Notlar</span>
        </div>
      ),
      cell: ({ row }) => <TruncatedCell content={row.getValue("Notlar")} maxWidth="200px" />,
    },
  ]

  const table = useReactTable({
    data: inspections,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  })

  if (loading) {
    return (
      <div className="h-[400px] flex items-center justify-center border rounded-lg bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-900/50 shadow-xl shadow-gray-200/40 dark:shadow-gray-900/40 border-gray-200/60 dark:border-gray-800/60">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Veriler yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="hidden md:block">
      <div className="h-[400px] rounded-lg border bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-900/50 shadow-xl shadow-gray-200/40 dark:shadow-gray-900/40 border-gray-200/60 dark:border-gray-800/60 overflow-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="whitespace-nowrap">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  Kayıt bulunamadı
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2">
        <div className="text-sm text-muted-foreground">
          Sayfa {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="h-8 px-3 text-xs"
          >
            Önceki
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="h-8 px-3 text-xs"
          >
            Sonraki
          </Button>
        </div>
      </div>
    </div>
  )
}