import { getInspectionDetails, getInspectionHeader, getAllInspectionIds } from "@/app/actions/database"
import ReportDetailClient from "./client-page"

// For static exports, we need to provide all possible paths
export async function generateStaticParams() {
  const result = await getAllInspectionIds()
  
  if (!result.success) {
    console.error('Failed to get inspection IDs:', result.error)
    return []
  }

  return result.data.map(id => ({
    id: id.toString()
  }))
}

export default async function ReportDetailPage({ params }: { params: { id: string } }) {
  const [headerResult, detailsResult] = await Promise.all([
    getInspectionHeader(parseInt(params.id)),
    getInspectionDetails(parseInt(params.id))
  ])
  
  if (!headerResult.success || !detailsResult.success) {
    return (
      <div className="flex-1 p-8">
        <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-700 dark:text-red-400">
            {headerResult.error || detailsResult.error}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1">
      <ReportDetailClient 
        headerData={headerResult.data} 
        detailData={detailsResult.data} 
      />
    </div>
  )
}
