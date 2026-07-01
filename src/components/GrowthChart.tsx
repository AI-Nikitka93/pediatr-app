import { useEffect, useRef, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
} from "recharts";

export type GrowthMetric = "weight" | "height";

export interface GrowthChartPoint {
  ageInMonths: number;
  ageLabel: string;
  date: string;
  weight: number;
  height: number;
  whoWeight: number;
  whoHeight: number;
}

interface GrowthChartProps {
  data: GrowthChartPoint[];
  activeMetric: GrowthMetric;
}

export default function GrowthChart({ data, activeMetric }: GrowthChartProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [chartSize, setChartSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const updateSize = () => {
      const rect = element.getBoundingClientRect();
      setChartSize({
        width: rect.width > 0 ? Math.round(rect.width) : 0,
        height: rect.height > 0 ? Math.round(rect.height) : 0,
      });
    };

    updateSize();

    const observer = new ResizeObserver(updateSize);
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const hasMeasuredSize = chartSize.width > 0 && chartSize.height > 0;

  return (
    <div ref={containerRef} className="h-full min-h-72 w-full min-w-0">
      {!hasMeasuredSize ? (
        <div className="h-full min-h-72 w-full flex items-center justify-center rounded-2xl bg-slate-50 text-xs font-semibold text-slate-500">
          Подготовка графика развития...
        </div>
      ) : (
      <LineChart
        data={data}
        width={chartSize.width}
        height={chartSize.height}
        margin={{ top: 10, right: 10, left: -22, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis
          dataKey="ageLabel"
          tick={{ fontSize: 10, fill: "#64748b" }}
          tickLine={false}
          axisLine={{ stroke: "#e2e8f0" }}
        />
        <YAxis
          domain={["auto", "auto"]}
          tick={{ fontSize: 10, fill: "#64748b" }}
          tickLine={false}
          axisLine={{ stroke: "#e2e8f0" }}
        />
        <RechartsTooltip
          content={({ active, payload }: any) => {
            if (active && payload && payload.length) {
              const point = payload[0].payload as GrowthChartPoint;
              const isWeight = activeMetric === "weight";
              const actualVal = isWeight ? point.weight : point.height;
              const whoVal = isWeight ? point.whoWeight : point.whoHeight;
              const diff = parseFloat((actualVal - whoVal).toFixed(1));
              const unit = isWeight ? "кг" : "см";

              return (
                <div className="bg-slate-900 border border-slate-800 text-white p-3 rounded-xl shadow-xl space-y-1 text-xs z-50">
                  <p className="font-extrabold text-[#C1FF72]">
                    {point.ageLabel} ({new Date(point.date).toLocaleDateString("ru-RU")})
                  </p>
                  <div className="border-t border-slate-800 pt-1.5 space-y-1">
                    <p className="flex items-center justify-between gap-6">
                      <span className="text-slate-400">Показатель ребенка:</span>
                      <span className={isWeight ? "text-emerald-400 font-bold" : "text-indigo-400 font-bold"}>
                        {actualVal} {unit}
                      </span>
                    </p>
                    <p className="flex items-center justify-between gap-6">
                      <span className="text-slate-400">Медиана ВОЗ (норма):</span>
                      <span className="text-slate-300 font-medium">
                        {whoVal} {unit}
                      </span>
                    </p>
                    <p className="flex items-center justify-between gap-3 border-t border-slate-800/60 pt-1 text-[10px]">
                      <span className="text-slate-500">Отклонение от медианы:</span>
                      <span className={diff >= 0 ? "text-emerald-400 font-semibold" : "text-rose-400 font-semibold"}>
                        {diff > 0 ? `+${diff}` : diff} {unit}
                      </span>
                    </p>
                  </div>
                </div>
              );
            }
            return null;
          }}
        />
        <Line
          name="Эталон ВОЗ"
          type="monotone"
          dataKey={activeMetric === "weight" ? "whoWeight" : "whoHeight"}
          stroke="#ecfdd5"
          strokeWidth={2}
          strokeDasharray="4 4"
          dot={false}
          activeDot={false}
        />
        <Line
          name="Ребенок"
          type="monotone"
          dataKey={activeMetric === "weight" ? "weight" : "height"}
          stroke={activeMetric === "weight" ? "#10b981" : "#6366f1"}
          strokeWidth={3.5}
          activeDot={{ r: 6 }}
          dot={{ r: 4.5, strokeWidth: 2.5, fill: "#ffffff" }}
        />
      </LineChart>
      )}
    </div>
  );
}
