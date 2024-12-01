"use client"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"
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
    <div className="hidden md:flex md:w-[380px] flex-col border-r-2 border-r-gray-200/60 dark:border-r-gray-800/60 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header Card */}
      <Card className="m-6 border-2 border-blue-200/60 dark:border-blue-800/60 bg-gradient-to-br from-blue-50 to-indigo-50/50 dark:from-blue-950/50 dark:to-indigo-950/50 shadow-xl shadow-blue-500/10 dark:shadow-blue-500/5">
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 shadow-lg shadow-blue-500/30 dark:shadow-blue-500/20">
              <ClipboardList className="h-7 w-7 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                Denetim Grupları
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Formu doldurmaya başlayın
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Tamamlanma Durumu
                </p>
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "w-3 h-3 rounded-full animate-pulse shadow-lg",
                    completionPercentage === 100 
                      ? "bg-green-500 shadow-green-500/50" 
                      : "bg-blue-500 shadow-blue-500/50"
                  )} />
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                    {completionPercentage}%
                  </span>
                </div>
              </div>
              <div className={cn(
                "p-2.5 rounded-xl shadow-lg",
                completionPercentage === 100 
                  ? "bg-gradient-to-br from-green-500 to-emerald-500 shadow-green-500/30" 
                  : "bg-gradient-to-br from-blue-500 to-indigo-500 shadow-blue-500/30"
              )}>
                {completionPercentage === 100 ? (
                  <CheckCircle2 className="h-6 w-6 text-white" />
                ) : (
                  <AlertCircle className="h-6 w-6 text-white" />
                )}
              </div>
            </div>

            <Progress 
              value={completionPercentage} 
              className="h-3 bg-blue-100 dark:bg-blue-950 rounded-lg" 
              indicatorClassName={cn(
                "transition-all duration-500 rounded-lg shadow-lg",
                completionPercentage === 100 
                  ? "bg-gradient-to-r from-green-500 to-emerald-500 shadow-green-500/50" 
                  : "bg-gradient-to-r from-blue-500 to-indigo-500 shadow-blue-500/50"
              )}
            />
          </div>
        </div>
      </Card>

      {/* Groups List */}
      <ScrollArea className="flex-1 px-6 pb-6">
        <div className="space-y-4">
          {formGroups.map((group, index) => {
            const groupQuestions = questions.filter(q => q.GroupID === group.GroupID)
            const answeredInGroup = groupQuestions.filter(q => answers[q.QuestionID]?.optionId).length
            const isActive = activeGroup === group.GroupID.toString()
            const progress = Math.round((answeredInGroup / groupQuestions.length) * 100)
            
            return (
              <Card
                key={group.GroupID}
                className={cn(
                  "transition-all duration-300 cursor-pointer hover:shadow-xl border-2",
                  isActive 
                    ? "bg-gradient-to-br from-blue-50 to-indigo-50/50 dark:from-blue-950/50 dark:to-indigo-950/50 border-blue-300 dark:border-blue-800 shadow-lg shadow-blue-500/20" 
                    : progress === 100
                      ? "bg-gradient-to-br from-green-50 to-emerald-50/50 dark:from-green-950/50 dark:to-emerald-950/50 border-green-300 dark:border-green-800 shadow-lg shadow-green-500/20"
                      : "bg-white dark:bg-gray-800 border-gray-200/60 dark:border-gray-700/60 hover:border-blue-300 dark:hover:border-blue-800",
                  "hover:-translate-y-1"
                )}
                onClick={() => setActiveGroup(group.GroupID.toString())}
              >
                <div className="p-5 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "p-3 rounded-xl shadow-lg transition-transform duration-300 group-hover:scale-110",
                      isActive 
                        ? "bg-gradient-to-br from-blue-500 to-indigo-500 shadow-blue-500/30 text-white" 
                        : progress === 100
                          ? "bg-gradient-to-br from-green-500 to-emerald-500 shadow-green-500/30 text-white"
                          : "bg-gradient-to-br from-gray-100 to-gray-50 shadow-gray-500/20 text-gray-600 dark:from-gray-800 dark:to-gray-700 dark:text-gray-300"
                    )}>
                      <CheckSquare className="h-5 w-5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-3">
                        <h4 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                          {group.GroupName}
                        </h4>
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            "px-2.5 py-1 rounded-full text-xs font-medium shadow-lg",
                            progress === 100 
                              ? "bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-green-500/30" 
                              : "bg-gradient-to-br from-gray-100 to-gray-50 text-gray-600 shadow-gray-500/20 dark:from-gray-800 dark:to-gray-700 dark:text-gray-300"
                          )}>
                            {answeredInGroup}/{groupQuestions.length}
                          </span>
                          <ChevronRight className={cn(
                            "h-4 w-4 transition-transform",
                            isActive && "rotate-90",
                            "text-gray-400"
                          )} />
                        </div>
                      </div>

                      <div className="mt-4 space-y-2">
                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                          <span>İlerleme</span>
                          <span>{progress}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-700 shadow-inner">
                          <div 
                            className={cn(
                              "h-full rounded-full transition-all duration-500 shadow-lg",
                              progress === 100 
                                ? "bg-gradient-to-r from-green-500 to-emerald-500 shadow-green-500/50" 
                                : "bg-gradient-to-r from-blue-500 to-indigo-500 shadow-blue-500/50"
                            )} 
                            style={{ width: `${progress}%` }} 
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
}