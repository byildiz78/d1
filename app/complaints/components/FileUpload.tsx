"use client"

import { useState } from "react"
import { Upload, X, FileIcon, Download, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { uploadComplaintFile, deleteComplaintFile, downloadComplaintFile } from "@/lib/complaint-api"

interface FileUploadProps {
  complaintId: number
  files: Array<{
    id: number
    name: string
    size: number
    uploadedAt: string
    uploadedBy: string
  }>
  onFileUploaded: () => void
  onFileDeleted: () => void
}

export function FileUpload({ complaintId, files, onFileUploaded, onFileDeleted }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isDeleting, setIsDeleting] = useState<number | null>(null)
  const [isDownloading, setIsDownloading] = useState<number | null>(null)
  const { toast } = useToast()

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      await handleFileUpload(files[0])
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      await handleFileUpload(files[0])
    }
  }

  const handleFileUpload = async (file: File) => {
    try {
      setIsUploading(true)
      await uploadComplaintFile(complaintId, file)
      onFileUploaded()
      toast({
        title: "Başarılı",
        description: "Dosya başarıyla yüklendi",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: error instanceof Error ? error.message : "Dosya yüklenirken bir hata oluştu",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileDelete = async (fileId: number) => {
    try {
      setIsDeleting(fileId)
      await deleteComplaintFile(complaintId, fileId)
      onFileDeleted()
      toast({
        title: "Başarılı",
        description: "Dosya başarıyla silindi",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: error instanceof Error ? error.message : "Dosya silinirken bir hata oluştu",
      })
    } finally {
      setIsDeleting(null)
    }
  }

  const handleFileDownload = async (fileId: number, fileName: string) => {
    try {
      setIsDownloading(fileId)
      const blob = await downloadComplaintFile(complaintId, fileId)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: error instanceof Error ? error.message : "Dosya indirilirken bir hata oluştu",
      })
    } finally {
      setIsDownloading(null)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B"
    const k = 1024
    const sizes = ["B", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <h3 className="text-lg font-semibold">Dosyalar</h3>

        {/* Dosya listesi */}
        <div className="space-y-4">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between p-4 rounded-lg border bg-card"
            >
              <div className="flex items-center gap-4">
                <FileIcon className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatFileSize(file.size)} • {file.uploadedBy} tarafından yüklendi
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleFileDownload(file.id, file.name)}
                  disabled={isDownloading === file.id}
                >
                  {isDownloading === file.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleFileDelete(file.id)}
                  disabled={isDeleting === file.id}
                >
                  {isDeleting === file.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <X className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Dosya yükleme alanı */}
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center ${
            isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleFileSelect}
            disabled={isUploading}
          />
          <div className="space-y-4">
            <div className="mx-auto w-fit rounded-full bg-primary/10 p-4">
              {isUploading ? (
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              ) : (
                <Upload className="h-6 w-6 text-primary" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium">
                Dosya yüklemek için sürükleyip bırakın veya tıklayın
              </p>
              <p className="text-sm text-muted-foreground">Maksimum dosya boyutu: 10MB</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
