"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip } from "recharts"

const data = [
  {
    name: "Oca",
    total: 132,
  },
  {
    name: "Şub",
    total: 124,
  },
  {
    name: "Mar",
    total: 143,
  },
  {
    name: "Nis",
    total: 156,
  },
  {
    name: "May",
    total: 134,
  },
  {
    name: "Haz",
    total: 145,
  },
]

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <Tooltip />
        <Line
          type="monotone"
          dataKey="total"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}