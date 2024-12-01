"use client"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ClipboardList, CheckSquare, ChevronRight, CheckCircle2, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface FormSidebarProps {
  formGroups: any[]
  activeGroup: string
  setActiveGroup: (groupId: string) => void
  answers: Record<string, { optionId: string; note?: string }>
  questions: any[]
  completionPercentage: number
}

export function FormSidebar({
  formGroups,
  activeGroup,
  setActiveGroup,
  answers,
  questions,
  completionPercentage
}: FormSidebarProps) {
  return (
    <div className="hidden md:block md:w-[380px] border-r bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 p-4 flex flex-col">
      <div className="space-y-4 mb-4">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-white/20 backdrop-blur-sm">
                <ClipboardList className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white">
                  Denetim Grupları
                </h3>
                <p className="text-sm text-blue-100">
                  Formu doldurmaya başlayın
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-3 bg-gradient-to-b from-white to-blue-50/50 dark:from-gray-800 dark:to-gray-800/50">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Tamamlanma Durumu
                  </p>
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "w-3 h-3 rounded-full animate-pulse",
                      completionPercentage === 100 ? "bg-green-500" :
                      completionPercentage > 50 ? "bg-yellow-500" :
                      "bg-blue-500"
                    )} />
                    <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      {completionPercentage}%
                    </span>
                  </div>
                </div>
                <div className={cn(
                  "p-2 rounded-xl",
                  completionPercentage === 100 ? "bg-green-100 text-green-700" :
                  completionPercentage > 50 ? "bg-yellow-100 text-yellow-700" :
                  "bg-blue-100 text-blue-700"
                )}>
                  {completionPercentage === 100 ? (
                    <CheckCircle2 className="h-6 w-6" />
                  ) : (
                    <AlertCircle className="h-6 w-6" />
                  )}
                </div>
              </div>
              
              <Progress 
                value={completionPercentage} 
                className="h-3 bg-gray-100 dark:bg-gray-700" 
                indicatorClassName={cn(
                  "transition-all",
                  completionPercentage === 100 ? "bg-gradient-to-r from-green-500 to-emerald-500" :
                  completionPercentage > 50 ? "bg-gradient-to-r from-yellow-500 to-orange-500" :
                  "bg-gradient-to-r from-blue-500 to-indigo-500"
                )}
              />
            </div>
          </div>
        </div>
      </div>
 
      <ScrollArea className="h-[calc(100vh-16rem)] flex-1 pr-2">
        <div className="space-y-1.5">
          {formGroups.map((group, index) => {
            const groupQuestions = questions.filter(q => q.GroupID === group.GroupID)
            const answeredInGroup = groupQuestions.filter(q => answers[q.QuestionID]?.optionId).length
            const isActive = activeGroup === group.GroupID.toString()
            const progress = Math.round((answeredInGroup / groupQuestions.length) * 100)
            const isEven = index % 2 === 0
            
            return (
              <Button
                key={group.GroupID}
                variant="ghost"
                className={cn(
                  "w-full text-left flex flex-col p-0 h-auto relative overflow-hidden transition-all group",
                  isActive 
                    ? "ring-2 ring-blue-500 dark:ring-blue-400" 
                    : "hover:bg-white/60 dark:hover:bg-white/10",
                  "rounded-lg"
                )}
                onClick={() => setActiveGroup(group.GroupID.toString())}
              >
                <div className={cn(
                  "absolute inset-0 transition-opacity",
                  progress === 100 ? "bg-gradient-to-r from-green-100 dark:from-green-500/20" :
                  progress > 0 ? "bg-gradient-to-r from-blue-100 dark:from-blue-500/20" :
                  isEven ? "bg-white/40 dark:bg-white/5" : "bg-white/80 dark:bg-white/10"
                )} style={{ width: `${progress}%` }} />

                <div className="relative p-3 w-full">
                  <div className="flex gap-3 items-start w-full">
                    <div className={cn(
                      "shrink-0 w-8 h-8 rounded-lg flex items-center justify-center",
                      isActive 
                        ? "bg-blue-500 text-white" 
                        : progress === 100
                          ? "bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400"
                          : "bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400"
                    )}>
                      <CheckSquare className="h-5 w-5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 w-full">
                        <div className="space-y-1 flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 dark:text-white line-clamp-2 text-left">
                            {group.GroupName}
                          </h4>
                          {group.Description && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 text-left">
                              {group.Description}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0 ml-auto">
                          <span className={cn(
                            "px-2 py-0.5 rounded text-sm whitespace-nowrap",
                            progress === 100 
                              ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400" :
                            progress > 0 
                              ? "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400" :
                            "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                          )}>
                            {answeredInGroup}/{groupQuestions.length}
                          </span>
                          <ChevronRight className={cn(
                            "h-4 w-4 transition-transform shrink-0",
                            isActive && "rotate-90",
                            "text-gray-400"
                          )} />
                        </div>
                      </div>

                      <div className="mt-2 flex items-center gap-1.5">
                        <div className="flex-1 h-1 rounded-full bg-gray-100 dark:bg-gray-700">
                          <div 
                            className={cn(
                              "h-full rounded-full transition-all",
                              progress === 100 ? "bg-green-500" :
                              "bg-blue-500"
                            )} 
                            style={{ width: `${progress}%` }} 
                          />
                        </div>
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400 min-w-[32px] text-right">
                          {progress}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Button>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
}
