import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, RefreshCw, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import { getAnalyticsData, clearAnalytics, getUsageStats, AnalyticsData } from "@/lib/analytics";

const Dashboard = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [pieData, setPieData] = useState<any[]>([]);
  const [lineData, setLineData] = useState<any[]>([]);
  const [barData, setBarData] = useState<any[]>([]);
  const [calcOptions, setCalcOptions] = useState<any[]>([]);
  const [selectedCalc, setSelectedCalc] = useState<string>("");
  const [selectedCalcs, setSelectedCalcs] = useState<string[]>([]);
  const [vizMode, setVizMode] = useState<"usage" | "breakdown" | "trend">("usage");

  const colors = [
    "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6",
    "#ec4899", "#06b6d4", "#6366f1", "#14b8a6", "#f97316",
  ];

  useEffect(() => {
    loadAnalytics();
  }, []);

  function loadAnalytics() {
    const data = getAnalyticsData();
    setAnalytics(data);

    // Prepare pie chart data (top calculators by usage)
    const calcs = Object.values(data.usageByCalculator)
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    setPieData(
      calcs.map((calc) => ({
        name: calc.name,
        value: calc.count,
        id: calc.id,
      }))
    );

    // Initialize line chart with top calculator
    if (calcs.length > 0) {
      const topCalc = calcs[0];
      setSelectedCalc(topCalc.id);
      setSelectedCalcs([topCalc.id]);
      setCalcOptions(
        Object.values(data.usageByCalculator)
          .sort((a, b) => b.count - a.count)
          .map((c) => ({ id: c.id, name: c.name }))
      );
    }

    // Prepare bar chart data (usage count by calculator)
    const barChartData = calcs.map((calc) => ({
      name: calc.name.length > 15 ? calc.name.substring(0, 15) + "..." : calc.name,
      uses: calc.count,
      fullName: calc.name,
    }));
    setBarData(barChartData);
  }

  function buildLineChartData(calcIds: string[]) {
    if (calcIds.length === 0 || !analytics) {
      setLineData([]);
      return;
    }

    // Collect all unique input criteria names from recent events
    const criteriaSet = new Set<string>();
    calcIds.forEach((id) => {
      const usage = analytics.usageByCalculator[id];
      if (usage && usage.events) {
        usage.events.forEach((e) => {
          if (e.criteria) criteriaSet.add(e.criteria);
        });
      }
    });

    const criteria = Array.from(criteriaSet);
    if (criteria.length === 0) {
      setLineData([]);
      return;
    }

    // Build chart data: each row is a criteria, columns are calculator series
    const chartData = criteria.map((c) => {
      const row: any = { name: c };
      calcIds.forEach((id) => {
        const usage = analytics.usageByCalculator[id];
        if (usage && usage.events) {
          // Find most recent event for this criteria
          const event = [...usage.events].reverse().find((e) => e.criteria === c);
          if (event) {
            row[usage.name] = event.input ?? 0;
          } else {
            row[usage.name] = null;
          }
        }
      });
      return row;
    });

    setLineData(chartData);
  }

  function handleCalcToggle(calcId: string) {
    setSelectedCalcs((prev) => {
      const updated = prev.includes(calcId)
        ? prev.filter((id) => id !== calcId)
        : [...prev, calcId];
      if (updated.length === 0) return [calcId];
      buildLineChartData(updated);
      return updated;
    });
  }

  // Rebuild line chart when analytics changes
  useEffect(() => {
    if (analytics && selectedCalcs.length > 0) {
      buildLineChartData(selectedCalcs);
    }
  }, [analytics]);

  function getKeyFindings() {
    const stats = getUsageStats();
    const findings = [];

    // Finding 1: Most used calculator
    if (stats.topUsed.length > 0) {
      findings.push(`📊 "${stats.topUsed[0].name}" is your most used calculator with ${stats.topUsed[0].count} calculations`);
    }

    // Finding 2: Usage frequency
    if (stats.totalCalculations > 0) {
      const avgPerCalc = Math.round(stats.totalCalculations / stats.totalCalculators);
      findings.push(`📈 You've made ${stats.totalCalculations} total calculations across ${stats.totalCalculators} different tools`);
    }

    // Finding 3: Latest usage
    if (stats.recentlyUsed.length > 0) {
      findings.push(`⏱️ Recently used: ${stats.recentlyUsed[0].name}`);
    }

    return findings.length > 0 ? findings : ["Start using calculators to generate insights"];
  }

  function handleClearAnalytics() {
    if (window.confirm("Clear all analytics data? This cannot be undone.")) {
      clearAnalytics();
      loadAnalytics();
    }
  }

  if (!analytics) {
    return <div className="text-center py-20">Loading analytics...</div>;
  }

  const stats = getUsageStats();

  return (
    <div className="container py-10 max-w-7xl">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link to="/" className="hover:text-primary">
          Home
        </Link>
        <ArrowRight className="h-3 w-3" />
        <span className="font-medium">Dashboard</span>
      </nav>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-bold mb-2">Calculator Analytics Dashboard</h1>
        <p className="text-muted-foreground mb-6">
          Track usage patterns and insights across all calculators
        </p>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="rounded-lg border bg-card p-6">
            <div className="text-sm text-muted-foreground">Total Calculations</div>
            <div className="text-3xl font-bold text-primary mt-2">{stats.totalCalculations}</div>
          </div>
          <div className="rounded-lg border bg-card p-6">
            <div className="text-sm text-muted-foreground">Calculators Used</div>
            <div className="text-3xl font-bold text-primary mt-2">{stats.totalCalculators}</div>
          </div>
          <div className="rounded-lg border bg-card p-6">
            <div className="text-sm text-muted-foreground">Avg Uses per Calculator</div>
            <div className="text-3xl font-bold text-primary mt-2">
              {stats.totalCalculators > 0
                ? Math.round(stats.totalCalculations / stats.totalCalculators)
                : 0}
            </div>
          </div>
        </div>

        {/* Interactive Visualizations Picker */}
        {stats.totalCalculations > 0 && (
          <div className="mb-8">
            {/* Key Findings */}
            <div className="rounded-lg border border-blue-300 bg-blue-50 p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4 text-blue-900">📊 Key Findings</h2>
              <ul className="space-y-2">
                {getKeyFindings().map((finding, idx) => (
                  <li key={idx} className="text-blue-800 flex items-start gap-2">
                    <span className="mt-1">•</span>
                    <span>{finding}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Visualization Mode Picker */}
            <div className="rounded-lg border bg-card p-6 mb-8">
              <h2 className="text-lg font-semibold mb-4">How would you like to see this data?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Option 1: Progress/Trend */}
                <button
                  onClick={() => setVizMode("trend")}
                  className={`p-6 rounded-lg border-2 transition text-left ${
                    vizMode === "trend"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="text-2xl mb-2">📈</div>
                  <h3 className="font-semibold mb-1">Input Values Over Time</h3>
                  <p className="text-sm text-gray-600">See how input values change across different criteria</p>
                </button>

                {/* Option 2: Breakdown/Cost */}
                <button
                  onClick={() => setVizMode("breakdown")}
                  className={`p-6 rounded-lg border-2 transition text-left ${
                    vizMode === "breakdown"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="text-2xl mb-2">🥧</div>
                  <h3 className="font-semibold mb-1">Usage Breakdown</h3>
                  <p className="text-sm text-gray-600">See which calculators you use most</p>
                </button>

                {/* Option 3: Comparison */}
                <button
                  onClick={() => setVizMode("usage")}
                  className={`p-6 rounded-lg border-2 transition text-left ${
                    vizMode === "usage"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="text-2xl mb-2">📊</div>
                  <h3 className="font-semibold mb-1">Usage Comparison</h3>
                  <p className="text-sm text-gray-600">Compare usage counts across all calculators</p>
                </button>
              </div>

              {/* Dynamic Content Based on Viz Mode */}
              <div className="mt-8">
                {vizMode === "usage" && (
                  <div>
                    <h3 className="text-md font-semibold mb-4">Calculator Usage Counts</h3>
                    {barData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={240}>
                        <BarChart data={barData} margin={{ top: 20, right: 30, left: 0, bottom: 80 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 11 }} />
                          <YAxis />
                          <Tooltip formatter={(value) => [`${value} uses`, "Count"]} />
                          <Bar dataKey="uses" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="text-center py-12 text-muted-foreground">No usage data available</div>
                    )}
                  </div>
                )}

                {vizMode === "breakdown" && (
                  <div>
                    <h3 className="text-md font-semibold mb-4">Usage Distribution</h3>
                    {pieData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={240}>
                        <PieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            labelLine={true}
                            label={({ name, percent }) =>
                              `${name.substring(0, 12)}: ${(percent * 100).toFixed(0)}%`
                            }
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => `${value} uses`} />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="text-center py-12 text-muted-foreground">No breakdown data available</div>
                    )}
                  </div>
                )}

                {vizMode === "trend" && (
                  <div>
                    <h3 className="text-md font-semibold mb-4">Input Values by Criteria</h3>
                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground mb-3">Select calculators to compare:</p>
                      <div className="flex flex-wrap gap-2">
                        {calcOptions.map((opt) => (
                          <button
                            key={opt.id}
                            onClick={() => handleCalcToggle(opt.id)}
                            className={`px-3 py-1 rounded text-sm transition ${
                              selectedCalcs.includes(opt.id)
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                            }`}
                          >
                            {opt.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {lineData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={240}>
                        <LineChart data={lineData} margin={{ top: 5, right: 30, left: 0, bottom: 80 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" type="category" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 11 }} />
                          <YAxis label={{ value: "Input Value", angle: -90, position: "insideLeft" }} />
                          <Tooltip formatter={(value: any) => (value !== null ? Math.round(value) : "N/A")} />
                          <Legend />
                          {selectedCalcs.map((calcId, idx) => {
                            const usage = analytics?.usageByCalculator[calcId];
                            const name = usage?.name || calcId;
                            return (
                              <Line
                                key={calcId}
                                type="monotone"
                                dataKey={name}
                                stroke={colors[idx % colors.length]}
                                dot={{ r: 4 }}
                                activeDot={{ r: 6 }}
                                strokeWidth={2}
                                connectNulls
                              />
                            );
                          })}
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="text-center py-12 text-muted-foreground">
                        No trend data yet. Use calculators to start tracking.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Charts Grid */}
        {stats.totalCalculations > 0 ? (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Pie Chart - Usage Distribution */}
              <div className="rounded-lg border bg-card p-6">
                <h2 className="text-lg font-semibold mb-4">Usage Distribution (Top 8)</h2>
                {pieData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={240}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) =>
                          `${name.substring(0, 10)}: ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value} uses`} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    No data available
                  </div>
                )}
              </div>

              {/* Bar Chart - Usage Count */}
              <div className="rounded-lg border bg-card p-6">
                <h2 className="text-lg font-semibold mb-4">Most Used Calculators</h2>
                {barData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart
                      data={barData}
                      margin={{ top: 20, right: 30, left: 0, bottom: 80 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="name"
                        angle={-45}
                        textAnchor="end"
                        height={80}
                        interval={0}
                        tick={{ fontSize: 11 }}
                      />
                      <YAxis />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#f9fafb", border: "1px solid #e5e7eb" }}
                        formatter={(value) => [`${value} uses`, "Count"]}
                      />
                      <Bar dataKey="uses" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    No data available
                  </div>
                )}
              </div>
            </div>

            {/* Line Chart - Input Values by Criteria */}
            <div className="rounded-lg border bg-card p-6 mb-8">
              <h2 className="text-lg font-semibold mb-4">Input Values by Criteria</h2>
              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-3">Select calculators to compare:</p>
                <div className="flex flex-wrap gap-2">
                  {calcOptions.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => handleCalcToggle(opt.id)}
                      className={`px-3 py-1 rounded text-sm transition ${
                        selectedCalcs.includes(opt.id)
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                      }`}
                    >
                      {opt.name}
                    </button>
                  ))}
                </div>
              </div>

              {lineData.length > 0 ? (
                <ResponsiveContainer width="100%" height={240}>
                  <LineChart data={lineData} margin={{ top: 5, right: 30, left: 0, bottom: 80 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      type="category"
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      tick={{ fontSize: 11 }}
                    />
                    <YAxis label={{ value: "Input Value", angle: -90, position: "insideLeft" }} />
                    <Tooltip formatter={(value: any) => (value !== null ? Math.round(value) : "N/A")} />
                    <Legend />
                    {selectedCalcs.map((calcId, idx) => {
                      const usage = analytics?.usageByCalculator[calcId];
                      const name = usage?.name || calcId;
                      return (
                        <Line
                          key={calcId}
                          type="monotone"
                          dataKey={name}
                          stroke={colors[idx % colors.length]}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                          strokeWidth={2}
                          connectNulls
                        />
                      );
                    })}
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  No data available. Use calculators to generate input/criteria data.
                </div>
              )}
            </div>

            {/* Recently Used Calculators */}
            <div className="rounded-lg border bg-card p-6 mb-8">
              <h2 className="text-lg font-semibold mb-4">Recently Used</h2>
              <div className="space-y-3">
                {stats.recentlyUsed.map((calc) => {
                  const lastUsedDate = new Date(calc.lastUsed);
                  const now = new Date();
                  const diffMinutes = Math.round((now.getTime() - lastUsedDate.getTime()) / 60000);
                  let timeAgo = `${diffMinutes} min ago`;
                  if (diffMinutes >= 60) {
                    timeAgo = `${Math.round(diffMinutes / 60)} hours ago`;
                  }
                  if (diffMinutes < 1) {
                    timeAgo = "Just now";
                  }

                  return (
                    <div
                      key={calc.id}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition"
                    >
                      <div>
                        <Link
                          to={`/calculators/${calc.id}`}
                          className="font-medium text-primary hover:underline"
                        >
                          {calc.name}
                        </Link>
                        <div className="text-sm text-muted-foreground">{timeAgo}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{calc.count} uses</div>
                        {calc.results.length > 0 && (
                          <div className="text-sm text-muted-foreground">
                            Avg: {Math.round(calc.results.reduce((a, b) => a + b) / calc.results.length)}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        ) : (
          <div className="rounded-lg border bg-card p-12 text-center">
            <p className="text-muted-foreground mb-4">No analytics data yet</p>
            <p className="text-sm text-muted-foreground mb-6">
              Start using calculators to see usage analytics and insights here
            </p>
            <Link
              to="/calculators"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/90"
            >
              Browse Calculators
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 mt-8">
          <button
            onClick={loadAnalytics}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-slate-200 hover:bg-slate-50 transition"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button
            onClick={handleClearAnalytics}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-red-300 text-red-700 hover:bg-red-50 transition"
          >
            <Trash2 className="w-4 h-4" />
            Clear Analytics
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
