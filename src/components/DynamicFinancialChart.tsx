import React, { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { getAnalyticsData, AnalyticsData } from "@/lib/analytics";

type ChartType = "line" | "bar" | "scatter" | "pie";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

// Transform events into datasets suitable for each chart type
function transformEventsForCalculator(analytics: AnalyticsData, calculatorId: string) {
  const usage = analytics.usageByCalculator[calculatorId];
  if (!usage) return { events: [], aggregatedByCriteria: [] };

  const events = (usage.events || [])
    .map((e) => ({
      timestamp: e.timestamp,
      criteria: e.criteria ?? "",
      input: typeof e.input === "number" ? e.input : Number(e.input) || null,
      result: typeof e.result === "number" ? e.result : Number(e.result) || null,
    }))
    .filter((e) => e.input !== null && e.result !== null)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  // Aggregate by criteria for bar/pie charts (average result and total count)
  const byCriteriaMap: Record<string, { name: string; totalResult: number; totalInput: number; count: number }> = {};
  events.forEach((ev) => {
    const key = ev.criteria || "(input)";
    if (!byCriteriaMap[key]) byCriteriaMap[key] = { name: key, totalResult: 0, totalInput: 0, count: 0 };
    byCriteriaMap[key].totalResult += ev.result as number;
    byCriteriaMap[key].totalInput += ev.input as number;
    byCriteriaMap[key].count += 1;
  });

  const aggregatedByCriteria = Object.values(byCriteriaMap).map((v) => ({
    name: v.name,
    avgResult: v.count > 0 ? v.totalResult / v.count : 0,
    avgInput: v.count > 0 ? v.totalInput / v.count : 0,
    count: v.count,
  }));

  return { events, aggregatedByCriteria };
}

export default function DynamicFinancialChart({ initialCalculatorId }: { initialCalculatorId?: string }) {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [chartType, setChartType] = useState<ChartType>("line");
  const [calculatorId, setCalculatorId] = useState<string | undefined>(initialCalculatorId);

  useEffect(() => {
    setAnalytics(getAnalyticsData());
  }, []);

  const calculators = useMemo(() => {
    if (!analytics) return [];
    return Object.values(analytics.usageByCalculator)
      .map((u) => ({ id: u.id, name: u.name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [analytics]);

  useEffect(() => {
    if (!calculatorId && calculators.length > 0) setCalculatorId(calculators[0].id);
  }, [calculators, calculatorId]);

  const { events, aggregatedByCriteria } = useMemo(() => {
    if (!analytics || !calculatorId) return { events: [], aggregatedByCriteria: [] };
    return transformEventsForCalculator(analytics, calculatorId);
  }, [analytics, calculatorId]);

  // Build chart-ready data sets
  const lineData = useMemo(() => events.map((e, i) => ({ index: i + 1, input: e.input, result: e.result, timestamp: e.timestamp, criteria: e.criteria })), [events]);
  const scatterData = useMemo(() => events.map((e) => ({ x: e.input, y: e.result, criteria: e.criteria })), [events]);
  const barData = useMemo(() => aggregatedByCriteria.map((a) => ({ name: a.name, avgResult: Math.round(a.avgResult * 100) / 100, avgInput: Math.round(a.avgInput * 100) / 100, count: a.count })), [aggregatedByCriteria]);
  const pieData = useMemo(() => aggregatedByCriteria.map((a) => ({ name: a.name, value: a.count })), [aggregatedByCriteria]);

  // Empty state handling
  if (!analytics) {
    return (
      <div className="rounded-lg border bg-card p-6 text-center">
        <div className="text-lg font-semibold mb-2">No analytics available</div>
        <div className="text-sm text-muted-foreground">Analytics data not found in local storage yet.</div>
      </div>
    );
  }

  if (!calculatorId) {
    return (
      <div className="rounded-lg border bg-card p-6">
        <div className="text-sm text-muted-foreground mb-2">No calculators tracked yet.</div>
      </div>
    );
  }

  if (events.length === 0 && aggregatedByCriteria.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-6 text-center">
        <div className="text-lg font-semibold mb-2">No event data for this calculator</div>
        <div className="text-sm text-muted-foreground mb-4">Run some calculations to generate input/result events for visualization.</div>
        <a href="/calculators" className="inline-flex items-center px-4 py-2 rounded bg-primary text-white">Open Calculators</a>
      </div>
    );
  }

  // Layout: narrower width and increased height for a taller, more rectangular chart
  const CONTAINER_WIDTH = "60%";
  const CONTAINER_HEIGHT = 420;

  return (
    <div className="rounded-lg border bg-card p-4" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <label className="text-sm text-muted-foreground">Calculator</label>
          <select value={calculatorId} onChange={(e) => setCalculatorId(e.target.value)} className="border rounded p-1">
            {calculators.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-sm text-muted-foreground">Chart Type</label>
          <select value={chartType} onChange={(e) => setChartType(e.target.value as ChartType)} className="border rounded p-1">
            <option value="line">Line Chart</option>
            <option value="bar">Bar Chart</option>
            <option value="scatter">Scatter Plot</option>
            <option value="pie">Pie Chart</option>
          </select>
        </div>
      </div>

      <div style={{ width: CONTAINER_WIDTH, height: CONTAINER_HEIGHT, margin: "0 auto" }}>
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "line" && (
            <LineChart data={lineData} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="input" type="number" domain={["dataMin", "dataMax"]} tickFormatter={(v) => String(v)} />
              <YAxis />
              <Tooltip formatter={(value: any, name: any, props: any) => [value, name]} labelFormatter={(label) => `Input: ${label}`} />
              <Legend />
              <Line type="monotone" dataKey="result" stroke={COLORS[1]} dot={{ r: 3 }} name="Result" />
            </LineChart>
          )}

          {chartType === "bar" && (
            <BarChart data={barData} margin={{ top: 10, right: 20, left: 10, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
              <YAxis />
              <Tooltip formatter={(value) => value} />
              <Legend />
              <Bar dataKey="avgResult" fill={COLORS[0]} name="Avg Result" />
            </BarChart>
          )}

          {chartType === "scatter" && (
            <ScatterChart margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid />
              <XAxis type="number" dataKey="x" name="Input" />
              <YAxis type="number" dataKey="y" name="Result" />
              <Tooltip cursor={{ strokeDasharray: "3 3" }} formatter={(value: any) => Math.round(value * 100) / 100} />
              <Scatter name="Input vs Result" data={scatterData} fill={COLORS[2]} />
            </ScatterChart>
          )}

          {chartType === "pie" && (
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={120} innerRadius={60} label>
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>

      <div className="mt-3 text-sm text-muted-foreground">
        <div>Note: X axis maps to the user's input value. Y axis maps to the calculated result.</div>
      </div>
    </div>
  );
}
