"use client"

import { FileUp, X } from "lucide-react"
import { useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"

interface FileUploadProps {
  value?: File[]
  onChange?: (files: File[]) => void
  onRemove?: (file: File) => void
}

export function FileUpload({ value = [], onChange, onRemove }: FileUploadProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onChange?.(acceptedFiles)
    },
    [onChange]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
      "application/pdf": [],
      "application/msword": [],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [],
    },
  })

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors ${
          isDragActive
            ? "border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-950"
            : "border-gray-300 hover:border-blue-500 dark:border-gray-700 dark:hover:border-blue-400"
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center gap-2 text-gray-500 dark:text-gray-400">
          <FileUp className="h-8 w-8" />
          {isDragActive ? (
            <p>Dosyaları buraya bırakın...</p>
          ) : (
            <>
              <p>Dosyaları sürükleyip bırakın veya tıklayın</p>
              <p className="text-sm">
                (Desteklenen formatlar: Resim, PDF, Word)
              </p>
            </>
          )}
        </div>
      </div>

      {value.length > 0 && (
        <div className="space-y-2">
          {value.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-900 rounded-lg"
            >
              <span className="text-sm truncate flex-1">{file.name}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemove?.(file)}
                className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
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
