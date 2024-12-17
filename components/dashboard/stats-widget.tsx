import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatsWidgetProps {
  title: string
  value: number | string
  subtitle?: string
  trend?: {
    value: number
    isPositive: boolean
  }
  icon: React.ReactNode
  variant: 'blue' | 'green' | 'purple' | 'yellow' | 'red' | 'orange'
  className?: string
}

const variants = {
  blue: {
    background: 'bg-blue-50 dark:bg-blue-900/20',
    icon: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
    border: 'border-blue-100 dark:border-blue-800',
    text: 'text-blue-700 dark:text-blue-400',
    hover: 'hover:bg-blue-100/70 dark:hover:bg-blue-900/30'
  },
  green: {
    background: 'bg-green-50 dark:bg-green-900/20',
    icon: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    border: 'border-green-100 dark:border-green-800',
    text: 'text-green-700 dark:text-green-400',
    hover: 'hover:bg-green-100/70 dark:hover:bg-green-900/30'
  },
  purple: {
    background: 'bg-purple-50 dark:bg-purple-900/20',
    icon: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
    border: 'border-purple-100 dark:border-purple-800',
    text: 'text-purple-700 dark:text-purple-400',
    hover: 'hover:bg-purple-100/70 dark:hover:bg-purple-900/30'
  },
  yellow: {
    background: 'bg-yellow-50 dark:bg-yellow-900/20',
    icon: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
    border: 'border-yellow-100 dark:border-yellow-800',
    text: 'text-yellow-700 dark:text-yellow-400',
    hover: 'hover:bg-yellow-100/70 dark:hover:bg-yellow-900/30'
  },
  red: {
    background: 'bg-red-50 dark:bg-red-900/20',
    icon: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
    border: 'border-red-100 dark:border-red-800',
    text: 'text-red-700 dark:text-red-400',
    hover: 'hover:bg-red-100/70 dark:hover:bg-red-900/30'
  },
  orange: {
    background: 'bg-orange-50 dark:bg-orange-900/20',
    icon: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400',
    border: 'border-orange-100 dark:border-orange-800',
    text: 'text-orange-700 dark:text-orange-400',
    hover: 'hover:bg-orange-100/70 dark:hover:bg-orange-900/30'
  }
}

function formatNumber(value: number | string): string {
  if (typeof value === 'string') return value
  return new Intl.NumberFormat('tr-TR').format(value)
}

export function StatsWidget({
  title,
  value,
  subtitle,
  trend,
  icon,
  variant,
  className,
}: StatsWidgetProps) {
  const styles = variants[variant]

  return (
    <Card className={cn(
      "group relative overflow-hidden transition-all duration-200",
      "border-l-4 hover:shadow-lg hover:-translate-y-0.5",
      styles.background,
      styles.border,
      styles.hover,
      className
    )}>
      <div className="relative p-4">
        {/* Header with Icon */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className={cn(
              "w-7 h-7 rounded-lg flex items-center justify-center",
              "transition-transform duration-200 group-hover:scale-110",
              styles.icon
            )}>
              {icon}
            </div>
            <h3 className={cn(
              "text-sm font-medium",
              "text-muted-foreground"
            )}>
              {title}
            </h3>
          </div>

          {/* Trend Indicator */}
          {trend && (
            <div className={cn(
              "flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
              trend.isPositive 
                ? "text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-900/30"
                : "text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-900/30"
            )}>
              <span>
                {trend.isPositive ? "↑" : "↓"}
              </span>
              <span>{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>

        {/* Value and Subtitle */}
        <div className="space-y-0.5">
          <div className="flex items-baseline gap-2">
            <div className={cn(
              "text-xl font-bold",
              styles.text
            )}>
              {typeof value === 'number' 
                ? value.toLocaleString('tr-TR')
                : value}
            </div>
            {subtitle && (
              <div className="text-xs text-muted-foreground">
                {subtitle}
              </div>
            )}
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mt-2.5 h-1 w-full rounded-full overflow-hidden bg-black/5 dark:bg-white/5">
          <div 
            className={cn(
              "h-full rounded-full transition-all duration-500",
              styles.background
            )}
            style={{ width: '70%' }}
          />
        </div>
      </div>
    </Card>
  )
}
