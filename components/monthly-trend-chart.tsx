'use client'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import DataLabels from 'chartjs-plugin-datalabels';
import React from 'react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  DataLabels
);

interface MonthlyTrendChartProps {
  initialData: {
    Ay: string;
    DenetimSayisi: number;
  }[];
}

export function MonthlyTrendChart({ initialData }: MonthlyTrendChartProps) {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!initialData || initialData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Veri bulunamadı
      </div>
    )
  }

  // Trend line hesaplama
  const inspectionNumbers = initialData.map(item => item.DenetimSayisi);
  const trendlineData = inspectionNumbers.map((_, index) => {
    const x = index;
    const sumXY = inspectionNumbers.reduce((acc, y, i) => acc + i * y, 0);
    const sumX = inspectionNumbers.length * (inspectionNumbers.length - 1) / 2;
    const sumY = inspectionNumbers.reduce((acc, y) => acc + y, 0);
    const sumXX = inspectionNumbers.reduce((acc, _, i) => acc + i * i, 0);
    const n = inspectionNumbers.length;
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    return slope * x + intercept;
  });

  const data = {
    labels: initialData.map(item => item.Ay),
    datasets: [
      {
        type: 'bar' as const,
        label: 'Denetim Sayısı',
        data: initialData.map(item => item.DenetimSayisi),
        backgroundColor: initialData.map((_, index) => {
          const colors = [
            '#3b82f6', // blue
            '#10b981', // green
            '#8b5cf6', // purple
            '#f59e0b', // amber
            '#ef4444', // red
            '#06b6d4', // cyan
            '#ec4899', // pink
            '#f97316', // orange
            '#6366f1', // indigo
            '#14b8a6', // teal
            '#84cc16', // lime
            '#a855f7', // violet
          ];
          return colors[index % colors.length];
        }),
        borderRadius: 6,
        borderWidth: 0,
        datalabels: {
          display: !isMobile,
          color: '#4b5563',
          anchor: 'end',
          align: 'top',
          offset: 4,
          formatter: (value: number) => value.toLocaleString('tr-TR'),
          font: {
            weight: '600',
            size: isMobile ? 9 : 11
          },
          padding: {
            top: 4
          }
        }
      }
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          boxWidth: 10,
          padding: 10,
          font: {
            size: isMobile ? 10 : 12
          }
        }
      },
      datalabels: {
        display: !isMobile,
        color: '#4b5563',
        anchor: 'end',
        align: 'top',
        offset: 4,
        formatter: (value: number) => value.toLocaleString('tr-TR'),
        font: {
          weight: '600',
          size: isMobile ? 9 : 11
        },
        padding: {
          top: 4
        }
      },
      tooltip: {
        enabled: true,
        mode: 'index',
        intersect: false,
        padding: 10,
        titleFont: {
          size: isMobile ? 11 : 13
        },
        bodyFont: {
          size: isMobile ? 10 : 12
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: isMobile ? 9 : 11
          }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: '#e5e7eb',
        },
        ticks: {
          font: {
            size: isMobile ? 9 : 11
          }
        }
      }
    }
  };

  return (
    <div className="w-full h-full">
      <Bar data={data} options={options} />
    </div>
  );
}
