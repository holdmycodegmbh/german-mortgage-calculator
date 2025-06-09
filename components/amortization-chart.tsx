"use client"

import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  type ChartData,
} from "chart.js"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

interface AmortizationChartProps {
  chartData: ChartData<"line">
}

export function AmortizationChart({ chartData }: AmortizationChartProps) {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Darlehensverlauf über die Jahre",
        font: {
          size: 18,
        },
        color: "#1e293b",
      },
    },
    scales: {
      y: {
        ticks: {
          callback: (value: string | number) =>
            new Intl.NumberFormat("de-DE", {
              style: "currency",
              currency: "EUR",
              maximumFractionDigits: 0,
            }).format(Number(value)),
        },
      },
    },
  }

  return (
    <div className="relative h-64 md:h-96 mt-8">
      <Line options={options} data={chartData} />
    </div>
  )
}
