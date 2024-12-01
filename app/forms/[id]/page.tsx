import { FormDetail } from "./form-detail"
import formsData from "@/jsons/forms.json"
import formGroupsData from "@/jsons/formgrups.json"
import questionsData from "@/jsons/questions.json"
import questionOptionTypesData from "@/jsons/questionoptiontypes.json"
import questionOptionsData from "@/jsons/questionoptions.json"

// Generate static params for all forms
export async function generateStaticParams() {
  return formsData.map((form) => ({
    id: form.FormID.toString(),
  }))
}

export default function FormDetailPage({ params }: { params: { id: string } }) {
  const formId = parseInt(params.id)
  
  // Get form details
  const form = formsData.find(f => f.FormID === formId)
  if (!form) return <div>Form bulunamadı</div>

  // Get form groups
  const formGroups = formGroupsData
    .filter(g => g.FormID === formId)
    .sort((a, b) => a.DisplayIndex - b.DisplayIndex)

  return (
    <FormDetail 
      form={form}
      formGroups={formGroups}
      questions={questionsData}
      questionOptionTypes={questionOptionTypesData}
      questionOptions={questionOptionsData}
    />
  )
}
