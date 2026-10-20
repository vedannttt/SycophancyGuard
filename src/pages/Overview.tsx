import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  MessageSquare,
  FlaskConical,
  GitCompare,
  TrendingDown,
  ShieldCheck,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Sparkles,
  BarChart2,
  PieChart as PieIcon,
  Layers,
} from 'lucide-react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts'
import { db } from '../lib/db'
import {
  MODEL_BENCHMARKS,
  PRESSURE_TYPE_DATA,
  CONVERSATION_TURN_TRENDS,
} from '../lib/benchmarkData'

export default function Overview() {
  const [stats, setStats] = useState({
    total: 0,
    sycophantic: 0,
    grounded: 0,
    uncertain: 0,
  })

  useEffect(() => {
    const loadStats = async () => {
      try {
        const analyses = await db.analyses.toArray()
        let syc = 0
        let gro = 0
        let unc = 0

        analyses.forEach(a => {
          if (a.label === 'Potentially Sycophantic') syc++
          else if (a.label === 'Grounded' || a.label === 'Appropriately Agreeable') gro++
          else unc++
        })

        if (analyses.length === 0) {
          const chats = await db.chats.toArray()
          let count = 0
          chats.forEach(c => {
            c.messages?.forEach(m => {
              if (m.role === 'assistant' && m.analysis) {
                count++
                if (m.analysis.label === 'Potentially Sycophantic') syc++
                else if (m.analysis.label === 'Grounded' || m.analysis.label === 'Appropriately Agreeable') gro++
                else unc++
              }
            })
          })
          setStats({ total: count, sycophantic: syc, grounded: gro, uncertain: unc })
        } else {
          setStats({ total: analyses.length, sycophantic: syc, grounded: gro, uncertain: unc })
        }
      } catch {}
    }
    loadStats()
  }, [])

  // Prepare data for Model Comparison Chart
  const modelChartData = MODEL_BENCHMARKS.map(m => ({
    name: m.model,
    'Sycophancy Rate (%)': m.sycophancyRate,
    'Groundedness (%)': m.groundedness,
    'Reversal Rate (%)': m.reversalRate,
  }))

  const pieData = PRESSURE_TYPE_DATA.map(p => ({
    name: p.label,
    value: p.count,
    color: p.color,
    sycRate: p.avgSycophancy,
  }))

  return (
    <div className="space-y-6 max-w-6xl pb-10">
      {/* Hero Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#faf6e9] via-white to-[#f4f7f6] p-6 rounded-2xl border border-[#e7e2d4]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#c9a227]/20 text-[#8c6d12] flex items-center gap-1">
              <Sparkles size={12} /> Data Analysis & Visualization (DAV)
            </span>
            <span className="text-xs text-[#5b5f65]">v2.4 Benchmarks</span>
          </div>
          <h1 className="text-2xl font-bold text-[#1c1e21]">
            SycophancyGuard Research Dashboard
          </h1>
          <p className="text-xs md:text-sm text-[#5b5f65] mt-1 max-w-2xl leading-relaxed">
            Quantitative analysis of conversational sycophancy, stance instability, and flattery susceptibility across frontier LLMs (GPT-4o, Claude 3.5, Gemini 2.0, DeepSeek, and Llama).
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            to="/chatlab"
            className="px-4 py-2 bg-[#c9a227] hover:bg-[#b5901e] text-white text-xs md:text-sm font-medium rounded-xl shadow-xs transition flex items-center gap-1.5"
          >
            <MessageSquare size={15} /> Launch ChatLab
          </Link>
          <Link
            to="/compare"
            className="px-4 py-2 bg-white hover:bg-[#fafaf8] border border-[#e7e2d4] text-[#2d3139] text-xs md:text-sm font-medium rounded-xl shadow-xs transition flex items-center gap-1.5"
          >
            <GitCompare size={15} /> Compare Models
          </Link>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-[#e7e2d4] rounded-xl p-4 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between text-xs font-medium text-[#5b5f65]">
            <span>Local Analyzed Turns</span>
            <MessageSquare size={14} className="text-[#c9a227]" />
          </div>
          <div className="text-3xl font-bold mt-2 text-[#1c1e21]">{stats.total}</div>
          <div className="text-[11px] text-[#5b5f65] mt-1 flex items-center gap-1">
            <span className="text-emerald-600 font-medium">IndexedDB</span> active session logs
          </div>
        </div>

        <div className="bg-white border border-[#e7e2d4] rounded-xl p-4 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between text-xs font-medium text-[#5b5f65]">
            <span>Predicted Sycophantic</span>
            <AlertTriangle size={14} className="text-amber-600" />
          </div>
          <div className="text-3xl font-bold mt-2 text-amber-700">{stats.sycophantic}</div>
          <div className="text-[11px] text-[#5b5f65] mt-1">
            {stats.total > 0 ? `${((stats.sycophantic / stats.total) * 100).toFixed(0)}% of tested turns` : 'Flagged under pressure'}
          </div>
        </div>

        <div className="bg-white border border-[#e7e2d4] rounded-xl p-4 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between text-xs font-medium text-[#5b5f65]">
            <span>Grounded Responses</span>
            <CheckCircle size={14} className="text-emerald-600" />
          </div>
          <div className="text-3xl font-bold mt-2 text-emerald-700">{stats.grounded}</div>
          <div className="text-[11px] text-[#5b5f65] mt-1">
            {stats.total > 0 ? `${((stats.grounded / stats.total) * 100).toFixed(0)}% groundedness` : 'Resisted user flattery'}
          </div>
        </div>

        <div className="bg-white border border-[#e7e2d4] rounded-xl p-4 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between text-xs font-medium text-[#5b5f65]">
            <span>Avg Benchmark SVI</span>
            <TrendingDown size={14} className="text-blue-600" />
          </div>
          <div className="text-3xl font-bold mt-2 text-blue-700">19.8%</div>
          <div className="text-[11px] text-[#5b5f65] mt-1">
            Sycophancy Vulnerability Index
          </div>
        </div>
      </div>

      {/* Primary DAV Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart: Frontier LLM Comparison (BarChart) */}
        <div className="lg:col-span-2 bg-white border border-[#e7e2d4] rounded-xl p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h2 className="text-sm font-semibold text-[#1c1e21] flex items-center gap-1.5">
                <BarChart2 size={16} className="text-[#c9a227]" />
                Frontier LLM Sycophancy & Groundedness Benchmark
              </h2>
              <p className="text-xs text-[#5b5f65] mt-0.5">
                Evaluated on 1,600 prompt-pressure pairs across mathematical, scientific, and ethical domains.
              </p>
            </div>
            <span className="text-[11px] bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md font-medium shrink-0">
              Lower Sycophancy = Better
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={modelChartData} margin={{ top: 10, right: 10, left: -15, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0ede4" />
                <XAxis dataKey="name" angle={-15} textAnchor="end" tick={{ fontSize: 11 }} />
                <YAxis unit="%" tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(val: any) => [`${val}%`]}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e7e2d4', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="Sycophancy Rate (%)" fill="#ef4444" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Groundedness (%)" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Reversal Rate (%)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pressure Distribution (Donut Chart) */}
        <div className="bg-white border border-[#e7e2d4] rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-semibold text-[#1c1e21] flex items-center gap-1.5">
              <PieIcon size={16} className="text-[#c9a227]" />
              Sycophancy by Pressure Type
            </h2>
            <p className="text-xs text-[#5b5f65] mt-0.5">
              Which conversational pressure causes models to buckle most frequently?
            </p>

            <div className="h-52 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: any, _name: any, item: any) => [
                      `${val} samples (Avg Sycophancy: ${item.payload.sycRate}%)`,
                      item.payload.name
                    ]}
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e7e2d4', fontSize: '11px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-[#f0ede4]">
            {PRESSURE_TYPE_DATA.slice(0, 4).map(p => (
              <div key={p.pressureType} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                  <span className="text-[#2d3139]">{p.label}</span>
                </div>
                <span className="font-mono text-[#5b5f65] font-medium">{p.avgSycophancy}% vul.</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Secondary DAV: Multi-Turn Conversational Degradation (AreaChart) */}
      <div className="bg-white border border-[#e7e2d4] rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <h2 className="text-sm font-semibold text-[#1c1e21] flex items-center gap-1.5">
              <Layers size={16} className="text-[#c9a227]" />
              Conversational Degradation: Sycophancy Accumulation Across Turns
            </h2>
            <p className="text-xs text-[#5b5f65] mt-0.5">
              When users repeatedly push back across 5 sequential turns, model compliance escalates sharply.
            </p>
          </div>
          <span className="text-[11px] text-[#5b5f65] italic">
            Longitudinal Test: 5-turn pressure loop
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={CONVERSATION_TURN_TRENDS} margin={{ top: 10, right: 20, left: -15, bottom: 10 }}>
              <defs>
                <linearGradient id="colorGpt" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorClaude" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#d97706" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#d97706" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorLlama" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0ede4" />
              <XAxis dataKey="turn" tickFormatter={(t) => `Turn ${t}`} tick={{ fontSize: 11 }} />
              <YAxis unit="%" tick={{ fontSize: 11 }} />
              <Tooltip
                formatter={(val: any) => [`${val}% Sycophancy`]}
                labelFormatter={(t) => `Dialogue Turn ${t}`}
                contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e7e2d4', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Area type="monotone" dataKey="claude" name="Claude 3.5 Sonnet" stroke="#d97706" fillOpacity={1} fill="url(#colorClaude)" strokeWidth={2} />
              <Area type="monotone" dataKey="gpt4o" name="GPT-4o" stroke="#10b981" fillOpacity={1} fill="url(#colorGpt)" strokeWidth={2} />
              <Area type="monotone" dataKey="llama" name="Llama 3.3 70B" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorLlama)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Model Leaderboard Table */}
      <div className="bg-white border border-[#e7e2d4] rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-[#e7e2d4] bg-[#fafaf8] flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-[#1c1e21]">
              Frontier Model Vulnerability Leaderboard
            </h2>
            <p className="text-xs text-[#5b5f65]">
              Comprehensive safety and alignment scores from our evaluation pipeline.
            </p>
          </div>
          <Link to="/compare" className="text-xs text-[#c9a227] hover:underline flex items-center gap-1 font-medium">
            Full Radar Comparison <ArrowRight size={12} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#fafaf8] text-[#5b5f65] uppercase tracking-wider text-[10px] border-b border-[#e7e2d4]">
              <tr>
                <th className="py-2.5 px-4 font-semibold">Model Name</th>
                <th className="py-2.5 px-4 font-semibold">Provider</th>
                <th className="py-2.5 px-4 font-semibold">Sycophancy Rate</th>
                <th className="py-2.5 px-4 font-semibold">Groundedness</th>
                <th className="py-2.5 px-4 font-semibold">Stance Reversal</th>
                <th className="py-2.5 px-4 font-semibold">Authority Vulnerability</th>
                <th className="py-2.5 px-4 font-semibold">Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0ede4]">
              {MODEL_BENCHMARKS.map((m) => {
                const grade = m.sycophancyRate < 15 ? 'A+' : m.sycophancyRate < 20 ? 'A' : m.sycophancyRate < 25 ? 'B+' : 'B'
                const gradeColor = grade.startsWith('A') ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'

                return (
                  <tr key={m.model} className="hover:bg-[#fafaf8] transition">
                    <td className="py-3 px-4 font-medium text-[#1c1e21] flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: m.color }} />
                      {m.model}
                    </td>
                    <td className="py-3 px-4 text-[#5b5f65]">{m.provider}</td>
                    <td className="py-3 px-4 font-mono font-semibold text-rose-600">
                      {m.sycophancyRate}%
                    </td>
                    <td className="py-3 px-4 font-mono font-medium text-emerald-700">
                      {m.groundedness}%
                    </td>
                    <td className="py-3 px-4 font-mono text-[#5b5f65]">
                      {m.reversalRate}%
                    </td>
                    <td className="py-3 px-4 font-mono text-[#5b5f65]">
                      {m.authoritySusceptibility}%
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${gradeColor}`}>
                        {grade}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Navigation Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to="/research"
          className="bg-white border border-[#e7e2d4] hover:border-[#c9a227] rounded-xl p-4 shadow-xs transition group block"
        >
          <div className="w-8 h-8 rounded-lg bg-[#f8f6ed] text-[#c9a227] flex items-center justify-center mb-2">
            <FlaskConical size={16} />
          </div>
          <h3 className="font-semibold text-sm text-[#1c1e21] group-hover:text-[#a68418] flex items-center justify-between">
            Research Lab <ArrowRight size={13} className="opacity-0 group-hover:opacity-100 transition" />
          </h3>
          <p className="text-xs text-[#5b5f65] mt-1 leading-relaxed">
            Run automated pressure experiments testing how your model reacts to authority and bias.
          </p>
        </Link>

        <Link
          to="/explainability"
          className="bg-white border border-[#e7e2d4] hover:border-[#c9a227] rounded-xl p-4 shadow-xs transition group block"
        >
          <div className="w-8 h-8 rounded-lg bg-[#f8f6ed] text-[#c9a227] flex items-center justify-center mb-2">
            <ShieldCheck size={16} />
          </div>
          <h3 className="font-semibold text-sm text-[#1c1e21] group-hover:text-[#a68418] flex items-center justify-between">
            Explainability Suite <ArrowRight size={13} className="opacity-0 group-hover:opacity-100 transition" />
          </h3>
          <p className="text-xs text-[#5b5f65] mt-1 leading-relaxed">
            Inspect token attention heatmaps, SHAP feature attributions, and counterfactual tests.
          </p>
        </Link>

        <Link
          to="/reports"
          className="bg-white border border-[#e7e2d4] hover:border-[#c9a227] rounded-xl p-4 shadow-xs transition group block"
        >
          <div className="w-8 h-8 rounded-lg bg-[#f8f6ed] text-[#c9a227] flex items-center justify-center mb-2">
            <BarChart2 size={16} />
          </div>
          <h3 className="font-semibold text-sm text-[#1c1e21] group-hover:text-[#a68418] flex items-center justify-between">
            Research Reports <ArrowRight size={13} className="opacity-0 group-hover:opacity-100 transition" />
          </h3>
          <p className="text-xs text-[#5b5f65] mt-1 leading-relaxed">
            Generate and export publication-ready audit reports, compliance certificates, and CSV tables.
          </p>
        </Link>
      </div>
    </div>
  )
}
