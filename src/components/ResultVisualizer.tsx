import React from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { VisualizationType } from "@/lib/visualizations";

interface ResultVisualizerProps {
  calculatorId: string;
  result: Record<string, number>;
  visualizationType: VisualizationType;
}

const colors = [
  "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6",
  "#ec4899", "#06b6d4", "#6366f1", "#14b8a6", "#f97316",
];

function prepareChartData(result: Record<string, number>, vizType: VisualizationType) {
  const entries = Object.entries(result)
    .filter(([_, v]) => typeof v === "number")
    .map(([k, v]) => ({ name: k, value: Math.round(v as number * 100) / 100 }));

  if (vizType === "line" || vizType === "area") {
    // For line and area, use index as x-axis
    return entries.map((e, idx) => ({ x: idx + 1, ...e }));
  }

  return entries;
}

export const ResultVisualizer: React.FC<ResultVisualizerProps> = ({
  calculatorId,
  result,
  visualizationType,
}) => {
  const data = prepareChartData(result, visualizationType);

  if (data.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">No data to visualize</div>;
  }

  switch (visualizationType) {
    case "bar":
      return (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 10 }} />
            <YAxis />
            <Tooltip formatter={(value) => Math.round(value as number * 100) / 100} />
            <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      );

    case "donut":
      return (
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
              label={({ name, value }) => `${name}: ${value}`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => Math.round(value as number * 100) / 100} />
          </PieChart>
        </ResponsiveContainer>
      );

    case "line":
      return (
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="x" />
            <YAxis />
            <Tooltip formatter={(value) => Math.round(value as number * 100) / 100} />
            <Legend />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#10b981"
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              strokeWidth={2}
              name="Value"
            />
          </LineChart>
        </ResponsiveContainer>
      );

    case "area":
      return (
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 10 }} />
            <YAxis />
            <Tooltip formatter={(value) => Math.round(value as number * 100) / 100} />
            <Area
              type="monotone"
              dataKey="value"
              fill="#10b98129"
              stroke="#10b981"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      );

    case "comparison":
      // For comparison, show multiple bars per category if applicable
      return (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 10 }} />
            <YAxis />
            <Tooltip formatter={(value) => Math.round(value as number * 100) / 100} />
            <Legend />
            {data.length > 0 && (
              <Bar dataKey="value" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
            )}
          </BarChart>
        </ResponsiveContainer>
      );

    case "waterfall":
      // Simplified waterfall as stacked bar chart
      return (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 10 }} />
            <YAxis />
            <Tooltip formatter={(value) => Math.round(value as number * 100) / 100} />
            <Bar dataKey="value" fill="#f59e0b" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      );

    default:
      return (
        <div className="text-center py-8 text-muted-foreground">
          Visualization type "{visualizationType}" not supported
        </div>
      );
  }
};

export default ResultVisualizer;
