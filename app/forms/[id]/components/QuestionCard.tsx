"use client"

import { Card } from "@/components/ui/card"
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
      "relative overflow-hidden transition-all duration-300 border-2",
      "hover:shadow-lg hover:-translate-y-0.5",
      answerStatus === "UYGUN" 
        ? "border-emerald-200 dark:border-emerald-800 bg-gradient-to-br from-emerald-50/80 to-green-50/50 dark:from-emerald-950/30 dark:to-green-950/20" 
        : answerStatus === "UYGUN DEĞİL"
          ? "border-rose-200 dark:border-rose-800 bg-gradient-to-br from-rose-50/80 to-pink-50/50 dark:from-rose-950/30 dark:to-pink-950/20"
          : answerStatus === "DEĞ. DIŞI"
            ? "border-slate-200 dark:border-slate-800 bg-gradient-to-br from-slate-50/80 to-gray-50/50 dark:from-slate-950/30 dark:to-gray-950/20"
            : "border-sky-200 dark:border-sky-800 bg-gradient-to-br from-sky-50/80 to-blue-50/50 dark:from-sky-950/30 dark:to-blue-950/20"
    )}>
      <div className="p-6 space-y-6">
        {/* Question Header */}
        <div className="flex items-start gap-4">
          <div className={cn(
            "p-3.5 rounded-xl shadow-sm shrink-0",
            answerStatus === "UYGUN" 
              ? "bg-gradient-to-br from-emerald-400 to-green-400 text-white" 
              : answerStatus === "UYGUN DEĞİL"
                ? "bg-gradient-to-br from-rose-400 to-pink-400 text-white"
                : answerStatus === "DEĞ. DIŞI"
                  ? "bg-gradient-to-br from-slate-400 to-gray-400 text-white"
                  : "bg-gradient-to-br from-sky-400 to-blue-400 text-white"
          )}>
            {answerStatus === "UYGUN" ? (
              <CheckCircle2 className="h-6 w-6" />
            ) : answerStatus === "UYGUN DEĞİL" ? (
              <XCircle className="h-6 w-6" />
            ) : answerStatus === "DEĞ. DIŞI" ? (
              <HelpCircle className="h-6 w-6" />
            ) : (
              <AlertCircle className="h-6 w-6" />
            )}
          </div>

          <div className="flex-1 min-w-0 space-y-6">
            {/* Question Title and Status */}
            <div className="flex items-start justify-between gap-4">
              <h4 className="text-lg font-medium leading-relaxed text-gray-700 dark:text-gray-200">
                {question.Question}
              </h4>
              {answerStatus && (
                <span className={cn(
                  "px-4 py-1.5 rounded-full text-sm font-medium shadow-sm whitespace-nowrap",
                  answerStatus === "UYGUN" 
                    ? "bg-gradient-to-r from-emerald-400 to-green-400 text-white" 
                    : answerStatus === "UYGUN DEĞİL"
                      ? "bg-gradient-to-r from-rose-400 to-pink-400 text-white"
                      : "bg-gradient-to-r from-slate-400 to-gray-400 text-white"
                )}>
                  {answerStatus}
                </span>
              )}
            </div>

            {/* Radio Options */}
            <RadioGroup 
              value={answer?.optionId}
              onValueChange={(value) => onAnswerChange(question.QuestionID, value)}
              className="flex flex-wrap gap-4"
            >
              {questionOptionTypes.map(opt => (
                <div className="flex items-center space-x-3" key={opt.AutoID}>
                  <RadioGroupItem 
                    value={opt.AutoID.toString()} 
                    id={`${question.QuestionID}-${opt.AutoID}`}
                    className={cn(
                      "border-2 w-6 h-6 data-[state=checked]:border-current",
                      opt.OptionName === "UYGUN" && "text-emerald-500 focus:ring-emerald-400 data-[state=checked]:bg-emerald-50 dark:data-[state=checked]:bg-emerald-900/20",
                      opt.OptionName === "UYGUN DEĞİL" && "text-rose-500 focus:ring-rose-400 data-[state=checked]:bg-rose-50 dark:data-[state=checked]:bg-rose-900/20",
                      opt.OptionName === "DEĞ. DIŞI" && "text-slate-500 focus:ring-slate-400 data-[state=checked]:bg-slate-50 dark:data-[state=checked]:bg-slate-900/20"
                    )}
                  />
                  <Label 
                    htmlFor={`${question.QuestionID}-${opt.AutoID}`}
                    className={cn(
                      "px-5 py-2.5 rounded-full text-sm font-medium shadow-sm cursor-pointer transition-all duration-200",
                      opt.OptionName === "UYGUN" && "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:hover:bg-emerald-900/30",
                      opt.OptionName === "UYGUN DEĞİL" && "bg-rose-100 text-rose-700 hover:bg-rose-200 dark:bg-rose-900/20 dark:text-rose-300 dark:hover:bg-rose-900/30",
                      opt.OptionName === "DEĞ. DIŞI" && "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-900/20 dark:text-slate-300 dark:hover:bg-slate-900/30"
                    )}
                  >
                    {opt.OptionName}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            {/* Notes Section */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Açıklama
              </Label>
              <Textarea 
                placeholder="Açıklama giriniz..." 
                value={answer?.note || ""}
                onChange={(e) => onNoteChange(question.QuestionID, e.target.value)}
                className="resize-none min-h-[120px] border-2 focus:ring-2 focus:ring-offset-0 bg-white/90 dark:bg-gray-900/50 text-base leading-relaxed"
              />
            </div>

            {/* Image Upload Section */}
            {options.some(o => o.ImageRequired) && (
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Fotoğraf
                </Label>
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    className="w-[120px] h-[120px] flex flex-col items-center justify-center border-2 border-dashed hover:border-sky-400 hover:bg-sky-50/50 dark:hover:bg-sky-900/20 transition-all duration-200 group"
                  >
                    <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800 group-hover:bg-sky-100 dark:group-hover:bg-sky-900/30 transition-colors">
                      <ImagePlus className="h-6 w-6 text-gray-500 dark:text-gray-400 group-hover:text-sky-600 dark:group-hover:text-sky-400" />
                    </div>
                    <span className="text-sm mt-3 text-gray-500 dark:text-gray-400 group-hover:text-sky-600 dark:group-hover:text-sky-400">
                      Fotoğraf Ekle
                    </span>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}