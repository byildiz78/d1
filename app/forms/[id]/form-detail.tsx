"use client"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Save, CheckSquare, ChevronRight, ChevronLeft, CheckCircle2, AlertCircle } from "lucide-react"
import { useState } from "react"
import { FormSidebar } from "./components/FormSidebar"
import { QuestionCard } from "./components/QuestionCard"
import { cn } from "@/lib/utils"

interface FormDetailProps {
  form: any
  formGroups: any[]
  questions: any[]
  questionOptionTypes: any[]
  questionOptions: any[]
}

export function FormDetail({ 
  form, 
  formGroups, 
  questions, 
  questionOptionTypes, 
  questionOptions 
}: FormDetailProps) {
  const [activeGroup, setActiveGroup] = useState<string>(formGroups[0]?.GroupID.toString())
  const [answers, setAnswers] = useState<Record<string, { optionId: string; note?: string }>>({})
  
  const totalQuestions = questions.filter(q => 
    formGroups.some(g => g.GroupID === q.GroupID)
  ).length
  const answeredQuestions = Object.keys(answers).length
  const completionPercentage = Math.round((answeredQuestions / totalQuestions) * 100)

  const handleAnswerChange = (questionId: number, optionId: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: { ...prev[questionId], optionId }
    }))
  }

  const handleNoteChange = (questionId: number, note: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: { ...prev[questionId], note }
    }))
  }

  const getAnswerStatus = (questionId: number) => {
    const answer = answers[questionId]
    if (!answer?.optionId) return null
    const option = questionOptionTypes.find(opt => opt.AutoID.toString() === answer.optionId)
    return option?.OptionName
  }

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <FormSidebar 
        formGroups={formGroups}
        activeGroup={activeGroup}
        setActiveGroup={setActiveGroup}
        answers={answers}
        questions={questions}
        completionPercentage={completionPercentage}
      />

      <div className="flex-1 overflow-hidden flex flex-col bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="border-b bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-4 shadow-sm">
          <div className="max-w-5xl mx-auto flex items-center justify-between px-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-500/20">
                <CheckSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {form.FormName}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {form.Description}
                </p>
              </div>
            </div>
            <Button 
              size="sm"
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 shadow-lg shadow-blue-500/25"
            >
              <Save className="mr-2 h-4 w-4" />
              Kaydet
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1 p-6">
          <div className="max-w-5xl mx-auto space-y-6 px-4">
            {formGroups
              .filter(group => group.GroupID.toString() === activeGroup)
              .map(group => {
                const groupQuestions = questions
                  .filter(q => q.GroupID === group.GroupID)
                  .sort((a, b) => (a.DisplayIndex || 0) - (b.DisplayIndex || 0))

                const groupIndex = formGroups.findIndex(g => g.GroupID === group.GroupID)
                const prevGroup = formGroups[groupIndex - 1]
                const nextGroup = formGroups[groupIndex + 1]
                const answeredInGroup = groupQuestions.filter(q => answers[q.QuestionID]?.optionId).length
                const progress = Math.round((answeredInGroup / groupQuestions.length) * 100)

                return (
                  <div key={group.GroupID} className="space-y-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                      <div className="p-4 bg-gradient-to-r from-blue-500 to-indigo-600">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 rounded-xl bg-white/20 backdrop-blur-sm">
                            <CheckSquare className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h2 className="font-bold text-lg text-white">
                              {group.GroupName}
                            </h2>
                            {group.Description && (
                              <p className="text-sm text-blue-100">
                                {group.Description}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-gradient-to-b from-white to-blue-50/50 dark:from-gray-800 dark:to-gray-800/50">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                Tamamlanma Durumu
                              </p>
                              <div className="flex items-center gap-2">
                                <div className={cn(
                                  "w-3 h-3 rounded-full animate-pulse",
                                  progress === 100 ? "bg-green-500" :
                                  progress > 50 ? "bg-yellow-500" :
                                  "bg-blue-500"
                                )} />
                                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                  {progress}%
                                </span>
                              </div>
                            </div>
                            <div className={cn(
                              "p-2 rounded-xl",
                              progress === 100 ? "bg-green-100 text-green-700" :
                              progress > 50 ? "bg-yellow-100 text-yellow-700" :
                              "bg-blue-100 text-blue-700"
                            )}>
                              {progress === 100 ? (
                                <CheckCircle2 className="h-6 w-6" />
                              ) : (
                                <AlertCircle className="h-6 w-6" />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {groupQuestions.map(question => {
                        const options = questionOptions.filter(o => o.QuestionID === question.QuestionID)
                        return (
                          <QuestionCard
                            key={question.QuestionID}
                            question={question}
                            options={options}
                            questionOptionTypes={questionOptionTypes}
                            answer={answers[question.QuestionID]}
                            onAnswerChange={handleAnswerChange}
                            onNoteChange={handleNoteChange}
                            answerStatus={getAnswerStatus(question.QuestionID)}
                          />
                        )
                      })}
                    </div>

                    <div className="flex items-center justify-between gap-4 mt-8 pt-4 border-t">
                      {prevGroup ? (
                        <Button
                          variant="outline"
                          className="flex items-center gap-2 w-[200px]"
                          onClick={() => setActiveGroup(prevGroup.GroupID.toString())}
                        >
                          <ChevronLeft className="h-4 w-4 shrink-0" />
                          <div className="flex flex-col items-start min-w-0">
                            <span className="text-xs text-gray-500 w-full">Önceki Grup</span>
                            <span className="text-sm font-medium truncate w-full">{prevGroup.GroupName}</span>
                          </div>
                        </Button>
                      ) : (
                        <div className="w-[200px]" /> /* Fixed width spacer */
                      )}

                      {nextGroup && (
                        <Button
                          className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 w-[200px]"
                          onClick={() => setActiveGroup(nextGroup.GroupID.toString())}
                        >
                          <div className="flex flex-col items-end min-w-0">
                            <span className="text-xs text-blue-100 w-full text-right">Sonraki Grup</span>
                            <span className="text-sm font-medium truncate w-full text-right">{nextGroup.GroupName}</span>
                          </div>
                          <ChevronRight className="h-4 w-4 shrink-0" />
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}