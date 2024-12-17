'use client'

import { useCallback, useState } from 'react'
import { FileIcon, X } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'

interface FileUploadProps {
  onChange: (files: string[]) => void
  value: string[]
}

export function FileUpload({ onChange, value }: FileUploadProps) {
  const [files, setFiles] = useState<string[]>(value || [])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Gerçek uygulamada burada dosyaları yükleyip URL'lerini alacağız
    const newFiles = acceptedFiles.map(file => URL.createObjectURL(file))
    setFiles(prev => [...prev, ...newFiles])
    onChange([...files, ...newFiles])
  }, [files, onChange])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxSize: 5242880 // 5MB
  })

  const removeFile = (fileToRemove: string) => {
    const updatedFiles = files.filter(file => file !== fileToRemove)
    setFiles(updatedFiles)
    onChange(updatedFiles)
  }

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-4 text-center cursor-pointer
          transition-colors
          ${isDragActive ? 'border-primary bg-primary/10' : 'border-muted-foreground/25'}
        `}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-sm">Dosyaları buraya bırakın...</p>
        ) : (
          <p className="text-sm text-muted-foreground">
            Dosyaları sürükleyip bırakın veya seçmek için tıklayın
          </p>
        )}
        <p className="text-xs text-muted-foreground mt-2">
          PNG, JPG, PDF, DOC, DOCX - Max 5MB
        </p>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-2 p-2 rounded-md bg-muted/50"
            >
              <FileIcon className="h-4 w-4 text-blue-500" />
              <span className="text-sm flex-1 truncate">
                {file.split('/').pop()}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={() => removeFile(file)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
