import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RecentInspections } from "@/components/recent-inspections"
import { NotificationFeed } from "@/components/notification-feed"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { ChartCard } from "@/components/dashboard/chart-card"
import { StatsPieChart } from "@/components/dashboard/stats-pie-chart"
import { FormDistributionCard } from "@/components/dashboard/form-distribution-card"
import { Bell, ArrowRight, Activity, CheckCircle2, Clock } from "lucide-react"
import Link from "next/link"
import { 
  getActiveBranchCount, 
  getRecentInspections,
  getTotalInspectionCount,
  getCurrentMonthInspectionCount,
  getCurrentWeekInspectionCount,
  getNotifications,
  getMonthlyInspectionCounts,
  getFormDistribution
} from './actions/database'

export default async function Home() {
  // First batch of essential data
  const [branchCount, totalInspections, monthlyInspections] = await Promise.all([
    getActiveBranchCount(),
    getTotalInspectionCount(),
    getCurrentMonthInspectionCount()
  ]);

  // Second batch with a small delay
  const [weeklyInspections, notifications] = await Promise.all([
    new Promise(resolve => setTimeout(() => resolve(getCurrentWeekInspectionCount()), 100)),
    new Promise(resolve => setTimeout(() => resolve(getNotifications()), 200))
  ]);

  // Third batch with another delay
  const [monthlyTrend, formDistribution, recentInspections] = await Promise.all([
    new Promise(resolve => setTimeout(() => resolve(getMonthlyInspectionCounts()), 300)),
    new Promise(resolve => setTimeout(() => resolve(getFormDistribution()), 400)),
    new Promise(resolve => setTimeout(() => resolve(getRecentInspections()), 500))
  ]);

  console.log('Monthly trend data:', {
    success: monthlyTrend.success,
    data: monthlyTrend.data,
    raw: monthlyTrend
  });

  return (
    <div className="flex-1 space-y-4 p-4 md:space-y-6 md:p-6 pt-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 sm:space-x-2">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
            Hoş Geldiniz 👋
          </h2>
          <p className="text-sm sm:text-[0.925rem] text-muted-foreground">
            Denetim sistemi genel durumu ve istatistikler
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[1fr] lg:grid-cols-[1fr,400px]">
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="group relative overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 border-l-[6px] border-l-indigo-500 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/20 dark:to-purple-950/20 shadow-lg shadow-indigo-500/10 dark:shadow-indigo-900/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Toplam Şube Sayısı
                </CardTitle>
                <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-indigo-600 dark:text-indigo-400"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <div className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                    {branchCount.success ? Number(branchCount.count).toLocaleString('tr-TR') : 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Aktif şubeler
                  </p>
                </div>
                <div className="mt-2 h-1.5 w-full rounded-full overflow-hidden bg-black/5 dark:bg-white/5">
                  <div className="h-full w-full bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 rounded-full opacity-20" />
                </div>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 border-l-[6px] border-l-purple-500 bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20 shadow-lg shadow-purple-500/10 dark:shadow-purple-900/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Toplam Denetim
                </CardTitle>
                <div className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Activity className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <div className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                    {totalInspections.success ? Number(totalInspections.count).toLocaleString('tr-TR') : 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Yapılan tüm denetimler
                  </p>
                </div>
                <div className="mt-2 h-1.5 w-full rounded-full overflow-hidden bg-black/5 dark:bg-white/5">
                  <div className="h-full w-full bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 rounded-full opacity-20" />
                </div>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 border-l-[6px] border-l-pink-500 bg-gradient-to-br from-pink-50/50 to-rose-50/50 dark:from-pink-950/20 dark:to-rose-950/20 shadow-lg shadow-pink-500/10 dark:shadow-pink-900/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Bu Ay Yapılan
                </CardTitle>
                <div className="w-7 h-7 rounded-lg bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle2 className="h-4 w-4 text-pink-600 dark:text-pink-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <div className="text-xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 dark:from-pink-400 dark:to-rose-400 bg-clip-text text-transparent">
                    {monthlyInspections.success ? Number(monthlyInspections.count).toLocaleString('tr-TR') : 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Bu ay yapılan denetimler
                  </p>
                </div>
                <div className="mt-2 h-1.5 w-full rounded-full overflow-hidden bg-black/5 dark:bg-white/5">
                  <div className="h-full w-full bg-gradient-to-r from-pink-600 to-rose-600 dark:from-pink-400 dark:to-rose-400 rounded-full opacity-20" />
                </div>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 border-l-[6px] border-l-rose-500 bg-gradient-to-br from-rose-50/50 to-orange-50/50 dark:from-rose-950/20 dark:to-orange-950/20 shadow-lg shadow-rose-500/10 dark:shadow-rose-900/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Bu Hafta Yapılan
                </CardTitle>
                <div className="w-7 h-7 rounded-lg bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Clock className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <div className="text-xl font-bold bg-gradient-to-r from-rose-600 to-orange-600 dark:from-rose-400 dark:to-orange-400 bg-clip-text text-transparent">
                    {weeklyInspections.success ? Number(weeklyInspections.count).toLocaleString('tr-TR') : 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Bu hafta yapılan denetimler
                  </p>
                </div>
                <div className="mt-2 h-1.5 w-full rounded-full overflow-hidden bg-black/5 dark:bg-white/5">
                  <div className="h-full w-full bg-gradient-to-r from-rose-600 to-orange-600 dark:from-rose-400 dark:to-orange-400 rounded-full opacity-20" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-7">
            <div className="lg:col-span-4">
              <ChartCard data={monthlyTrend?.data || []} />
            </div>
            <div className="lg:col-span-3">
              <FormDistributionCard data={formDistribution?.data || []} />
            </div>
          </div>

          <div className="rounded-xl bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-900/50 shadow-xl shadow-gray-200/40 dark:shadow-gray-900/40 border border-gray-200/60 dark:border-gray-800/60 overflow-hidden">
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-xl font-semibold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
                    Son Denetimler
                  </h3>
                  <p className="text-[0.925rem] text-muted-foreground">
                    Son yapılan denetimler ve sonuçları
                  </p>
                </div>
                <Link href="/reports">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="group hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950"
                  >
                    <span className="text-sm mr-2 group-hover:text-blue-600 dark:group-hover:text-blue-400">Tümünü Gör</span>
                    <ArrowRight className="h-4 w-4 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                  </Button>
                </Link>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                
                </div>
                <RecentInspections inspections={recentInspections.success ? recentInspections.data || [] : []} />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-900/50 shadow-xl shadow-gray-200/40 dark:shadow-gray-900/40 border border-gray-200/60 dark:border-gray-800/60 overflow-hidden">
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-semibold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
                    Bildirimler
                  </h3>
                  <div className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                    son yapılan denetimler
                  </div>
                </div>
                <p className="text-[0.925rem] text-muted-foreground">
                  Son aktiviteler ve güncellemeler
                </p>
              </div>
              <div className="relative">
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse" />
                <Button 
                  size="icon" 
                  variant="outline"
                  className="hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  <Bell className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex-1 space-y-4">
              <div className="flex items-center justify-between">
             
              </div>
              <NotificationFeed initialData={notifications.success ? notifications.data : []} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}