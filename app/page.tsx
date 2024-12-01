import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RecentInspections } from "@/components/recent-inspections"
import { NotificationFeed } from "@/components/notification-feed"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { ChartCard } from "@/components/dashboard/chart-card"
import { StatsPieChart } from "@/components/dashboard/stats-pie-chart"

export default function Home() {
  return (
    <div className="container mx-auto p-4 lg:p-8 max-w-[1800px] space-y-8">
      <div className="flex items-center justify-between mb-8 border-b border-border/40 pb-6">
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Dashboard
          </h2>
          <p className="text-muted-foreground mt-1">
            Denetim sistemi genel durumu ve istatistikler
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr,340px]">
        <div className="space-y-8">
          <div className="border-2 rounded-xl p-6 bg-card/50 shadow-sm">
            <StatsCards />
          </div>

          <div className="grid gap-8 lg:grid-cols-7">
            <div className="lg:col-span-4 border-2 rounded-xl p-6 bg-card/50 shadow-sm">
              <ChartCard />
            </div>
            <div className="lg:col-span-3 border-2 rounded-xl p-6 bg-card/50 shadow-sm">
              <StatsPieChart />
            </div>
          </div>

          <div className="border-2 rounded-xl p-6 bg-card/50 shadow-sm">
            <Card className="border-2">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-semibold">Son Denetimler</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Son yapılan denetimler ve sonuçları
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Tümünü Gör
                  </Button>
                </div>
                <RecentInspections />
              </div>
            </Card>
          </div>
        </div>

        <div className="border-2 rounded-xl p-6 bg-card/50 shadow-sm">
          <Card className="border-2">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold">Bildirimler</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Son aktiviteler ve güncellemeler
                  </p>
                </div>
              </div>
              <NotificationFeed />
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}