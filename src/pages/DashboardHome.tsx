import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { motion } from "framer-motion";
import { Filter, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { InsightItem, ModuleItem, StatMetric, TrajectoryPoint } from "../types";
import { PremiumCard } from "../components/PremiumCard";

interface DashboardHomeProps {
  stats: StatMetric[];
  trajectory: TrajectoryPoint[];
  insights: InsightItem[];
  modules: ModuleItem[];
}

const statusStyles: Record<string, string> = {
  Compliant: "bg-emerald-500/15 text-emerald-400",
  Critical: "bg-rose-500/15 text-rose-400",
  "In-Progress": "bg-amber-500/15 text-amber-400",
};

export const DashboardHome = ({ stats, trajectory, insights, modules }: DashboardHomeProps) => {
  const [search, setSearch] = useState("");

  const filteredModules = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return modules;
    return modules.filter((module) =>
      [module.title, module.summary, module.owner].some((value) => value.toLowerCase().includes(term))
    );
  }, [modules, search]);

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <section className="relative overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-950/80 p-10 shadow-[0_30px_80px_rgba(15,23,42,0.8)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.2),_transparent_60%)]" />
        <div className="relative z-10 flex flex-col gap-8">
          <div className="space-y-3">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Enterprise Command Center</p>
            <h1 className="text-4xl font-black tracking-tight text-white md:text-5xl">
              India DPDP Act Command Center
            </h1>
            <p className="max-w-2xl text-sm text-slate-400">
              Orchestrate obligations, evidence readiness, and AI copilots in a single high-assurance compliance surface.
            </p>
          </div>
          <div className="flex flex-col gap-4 rounded-2xl border border-slate-800/80 bg-slate-900/70 p-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search operational modules, owners, or workflows"
                className="w-full rounded-xl border border-slate-800/80 bg-slate-950/60 py-3 pl-11 pr-24 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full border border-slate-700/80 bg-slate-900/80 px-3 py-1 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                ⌘ K
              </span>
            </div>
            <button className="flex items-center justify-center gap-2 rounded-xl border border-slate-800/80 bg-slate-950/60 px-4 py-3 text-xs font-black uppercase tracking-[0.3em] text-slate-300 transition hover:border-blue-500 hover:text-white">
              <Filter className="h-4 w-4" />
              Filters
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <PremiumCard key={stat.id} title={stat.label}>
            <div className="flex items-end justify-between">
              <p className="text-3xl font-black tracking-tight text-white">{stat.value}</p>
              <span
                className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.3em] ${
                  stat.trend === "up" ? "bg-emerald-500/15 text-emerald-400" : "bg-rose-500/15 text-rose-400"
                }`}
              >
                {stat.delta}
              </span>
            </div>
          </PremiumCard>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <PremiumCard title="Compliance Trajectory">
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm text-slate-400">
              <span>DPDP Readiness Score</span>
              <span className="rounded-full bg-blue-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.3em] text-blue-300">
                FY 24
              </span>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trajectory} margin={{ left: -20, right: 10, top: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="score" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.6} />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" stroke="#334155" tick={{ fill: "#94a3b8", fontSize: 10 }} />
                  <YAxis stroke="#334155" tick={{ fill: "#94a3b8", fontSize: 10 }} domain={[60, 100]} />
                  <Tooltip
                    contentStyle={{
                      background: "#0f172a",
                      border: "1px solid #1e293b",
                      borderRadius: "12px",
                      color: "#e2e8f0",
                      fontSize: "12px",
                    }}
                  />
                  <Area type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2} fill="url(#score)" />
                  <Area type="monotone" dataKey="benchmark" stroke="#38bdf8" strokeDasharray="4 4" fill="transparent" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </PremiumCard>

        <PremiumCard title="Real-time GRC Insights">
          <div className="space-y-4">
            {insights.map((insight) => (
              <div key={insight.id} className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-white">{insight.title}</p>
                  <span
                    className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.3em] ${
                      statusStyles[insight.status]
                    }`}
                  >
                    {insight.status}
                  </span>
                </div>
                <p className="mt-2 text-xs text-slate-400">{insight.detail}</p>
                <p className="mt-3 text-[10px] uppercase tracking-[0.3em] text-slate-500">{insight.timestamp}</p>
              </div>
            ))}
          </div>
        </PremiumCard>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Operational Modules</p>
            <h2 className="text-2xl font-black tracking-tight text-white">Active Command Modules</h2>
          </div>
          <span className="rounded-full border border-slate-800/80 bg-slate-950/60 px-4 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
            {filteredModules.length} modules
          </span>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {filteredModules.map((module) => (
            <PremiumCard key={module.id}>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-white">{module.title}</p>
                  <span
                    className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.3em] ${
                      statusStyles[module.status]
                    }`}
                  >
                    {module.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400">{module.summary}</p>
                <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500">Owner · {module.owner}</p>
              </div>
            </PremiumCard>
          ))}
        </div>
      </section>
    </motion.div>
  );
};
