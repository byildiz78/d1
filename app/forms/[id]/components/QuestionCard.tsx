"use client"

import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle2, XCircle, HelpCircle, AlertCircle, ImagePlus } from "lucide-react"
import { cn } from "@/lib/utils"

interface QuestionCardProps {
  question: any
  options: any[]
  questionOptionTypes: any[]
  answer: { optionId: string; note?: string } | undefined
  onAnswerChange: (questionId: number, optionId: string) => void
  onNoteChange: (questionId: number, note: string) => void
  answerStatus: string | null
}

export function QuestionCard({
  question,
  options,
  questionOptionTypes,
  answer,
  onAnswerChange,
  onNoteChange,
  answerStatus
}: QuestionCardProps) {
  return (
    <Card className={cn(
      "relative overflow-hidden transition-all duration-200 bg-white dark:bg-gray-800",
      answerStatus ? "shadow-md" : "shadow-sm hover:shadow-md"
    )}>
      {answerStatus && (
        <div className={cn(
          "absolute left-0 top-0 w-1 h-full",
          answerStatus === "UYGUN" ? "bg-green-500" :
          answerStatus === "UYGUN DEĞİL" ? "bg-red-500" :
          "bg-gray-400"
        )} />
      )}
      
      <CardContent className="p-4 space-y-4">
        <div className="flex items-start gap-3">
          <div className={cn(
            "p-1.5 rounded-lg mt-0.5 shrink-0",
            answerStatus === "UYGUN" ? "bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400" :
            answerStatus === "UYGUN DEĞİL" ? "bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400" :
            answerStatus === "DEĞ. DIŞI" ? "bg-gray-100 text-gray-600 dark:bg-gray-500/20 dark:text-gray-400" :
            "bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400"
          )}>
            {answerStatus === "UYGUN" ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : answerStatus === "UYGUN DEĞİL" ? (
              <XCircle className="h-4 w-4" />
            ) : answerStatus === "DEĞ. DIŞI" ? (
              <HelpCircle className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-3">
              <span className="text-sm text-gray-900 dark:text-white flex-1">
                {question.Question}
              </span>
              {answerStatus && (
                <span className={cn(
                  "px-2 py-1 rounded-md text-xs font-medium shrink-0",
                  answerStatus === "UYGUN" 
                    ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400" :
                  answerStatus === "UYGUN DEĞİL" 
                    ? "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400" :
                  "bg-gray-100 text-gray-600 dark:bg-gray-500/20 dark:text-gray-400"
                )}>
                  {answerStatus}
                </span>
              )}
            </div>
          </div>
        </div>

        <RadioGroup 
          value={answer?.optionId}
          onValueChange={(value) => onAnswerChange(question.QuestionID, value)}
          className="flex gap-2"
        >
          {questionOptionTypes.map(opt => (
            <div className="flex items-center space-x-2" key={opt.AutoID}>
              <RadioGroupItem 
                value={opt.AutoID.toString()} 
                id={`${question.QuestionID}-${opt.AutoID}`}
                className={cn(
                  "border-2 data-[state=checked]:border-current",
                  opt.OptionName === "UYGUN" && "text-green-600 focus:ring-green-600 data-[state=checked]:bg-green-50 dark:data-[state=checked]:bg-green-500/20",
                  opt.OptionName === "UYGUN DEĞİL" && "text-red-600 focus:ring-red-600 data-[state=checked]:bg-red-50 dark:data-[state=checked]:bg-red-500/20",
                  opt.OptionName === "DEĞ. DIŞI" && "text-gray-600 focus:ring-gray-600 data-[state=checked]:bg-gray-50 dark:data-[state=checked]:bg-gray-500/20"
                )}
              />
              <Label 
                htmlFor={`${question.QuestionID}-${opt.AutoID}`}
                className={cn(
                  "text-xs font-medium px-2.5 py-1.5 rounded-md border",
                  opt.OptionName === "UYGUN" && "text-green-700 border-green-200 bg-green-50 dark:bg-green-500/20 dark:border-green-500/30 dark:text-green-400",
                  opt.OptionName === "UYGUN DEĞİL" && "text-red-700 border-red-200 bg-red-50 dark:bg-red-500/20 dark:border-red-500/30 dark:text-red-400",
                  opt.OptionName === "DEĞ. DIŞI" && "text-gray-700 border-gray-200 bg-gray-50 dark:bg-gray-500/20 dark:border-gray-500/30 dark:text-gray-400"
                )}
              >
                {opt.OptionName}
              </Label>
            </div>
          ))}
        </RadioGroup>

        <div className="space-y-1.5">
          <Label className="text-xs text-gray-700 dark:text-gray-300">Açıklama</Label>
          <Textarea 
            placeholder="Açıklama giriniz..." 
            value={answer?.note || ""}
            onChange={(e) => onNoteChange(question.QuestionID, e.target.value)}
            className="resize-none focus:ring-blue-500 border-2 bg-white/80 dark:bg-gray-900/50 focus:border-blue-500/30 text-sm"
          />
        </div>

        {options.some(o => o.ImageRequired) && (
          <div>
            <Label className="text-xs text-gray-700 dark:text-gray-300 mb-1.5 block">Fotoğraf</Label>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="w-[100px] h-[100px] flex flex-col items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-blue-500/30 group border-2 border-dashed"
              >
                <div className="p-2.5 rounded-lg bg-gray-100 dark:bg-gray-800 group-hover:bg-blue-100 dark:group-hover:bg-blue-500/20 transition-colors">
                  <ImagePlus className="h-5 w-5 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                </div>
                <span className="text-xs mt-1.5 text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">
                  Fotoğraf Ekle
                </span>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
