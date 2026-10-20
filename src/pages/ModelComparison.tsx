import { useState } from 'react'
import {
  GitCompare,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  Eye,
  Sliders,
} from 'lucide-react'
import {
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts'
import {
  BENCHMARK_COMPARISON_SAMPLES,
} from '../lib/benchmarkData'

export default function ModelComparison() {
  const [selectedPromptId, setSelectedPromptId] = useState<string>('sample-1')
  const [selectedModelsForRadar, setSelectedModelsForRadar] = useState<string[]>([
    'Claude 3.5 Sonnet',
    'GPT-4o',
    'Gemini 2.0 Flash',
  ])

  // Radar chart data structure
  const radarData = [
    {
      metric: 'Factual Groundedness',
      'Claude 3.5 Sonnet': 89.8,
      'GPT-4o': 86.4,
      'Gemini 2.0 Flash': 83.9,
      'Llama 3.3 70B': 77.2,
      'DeepSeek R1': 88.1,
    },
    {
      metric: 'Flattery Resistance',
      'Claude 3.5 Sonnet': 83.6,
      'GPT-4o': 77.9,
      'Gemini 2.0 Flash': 75.2,
      'Llama 3.3 70B': 69.0,
      'DeepSeek R1': 81.5,
    },
    {
      metric: 'Stance Stability',
      'Claude 3.5 Sonnet': 88.5,
      'GPT-4o': 84.8,
      'Gemini 2.0 Flash': 80.9,
      'Llama 3.3 70B': 75.4,
      'DeepSeek R1': 86.1,
    },
    {
      metric: 'Evidence Backing',
      'Claude 3.5 Sonnet': 91.2,
      'GPT-4o': 88.0,
      'Gemini 2.0 Flash': 84.5,
      'Llama 3.3 70B': 79.1,
      'DeepSeek R1': 89.4,
    },
    {
      metric: 'Authority Pushback',
      'Claude 3.5 Sonnet': 81.8,
      'GPT-4o': 75.5,
      'Gemini 2.0 Flash': 73.0,
      'Llama 3.3 70B': 65.8,
      'DeepSeek R1': 79.0,
    },
  ]

  // Filter benchmark sample
  const currentSample = BENCHMARK_COMPARISON_SAMPLES.find(s => s.id === selectedPromptId) || BENCHMARK_COMPARISON_SAMPLES[0]

  const toggleModelRadar = (modelName: string) => {
    if (selectedModelsForRadar.includes(modelName)) {
      if (selectedModelsForRadar.length > 1) {
        setSelectedModelsForRadar(prev => prev.filter(m => m !== modelName))
      }
    } else {
      setSelectedModelsForRadar(prev => [...prev, modelName])
    }
  }

  // Model colors for radar chart
  const modelColors: Record<string, string> = {
    'Claude 3.5 Sonnet': '#d97706',
    'GPT-4o': '#10b981',
    'Gemini 2.0 Flash': '#3b82f6',
    'Llama 3.3 70B': '#8b5cf6',
    'DeepSeek R1': '#06b6d4',
  }

  // Data for Category Performance Bar Chart
  const categoryData = [
    { category: 'Math & Logic', 'Claude 3.5 Sonnet': 9.2, 'GPT-4o': 14.1, 'Gemini 2.0 Flash': 18.5, 'Llama 3.3 70B': 24.2 },
    { category: 'Physical Science', 'Claude 3.5 Sonnet': 11.4, 'GPT-4o': 15.8, 'Gemini 2.0 Flash': 19.2, 'Llama 3.3 70B': 26.0 },
    { category: 'History & Facts', 'Claude 3.5 Sonnet': 12.8, 'GPT-4o': 17.0, 'Gemini 2.0 Flash': 20.8, 'Llama 3.3 70B': 27.5 },
    { category: 'Subjective Opinion', 'Claude 3.5 Sonnet': 21.0, 'GPT-4o': 26.5, 'Gemini 2.0 Flash': 29.4, 'Llama 3.3 70B': 35.8 },
    { category: 'Code & Systems', 'Claude 3.5 Sonnet': 8.5, 'GPT-4o': 12.2, 'Gemini 2.0 Flash': 16.0, 'Llama 3.3 70B': 21.3 },
  ]

  return (
    <div className="space-y-6 max-w-6xl pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#c9a227]/20 text-[#8c6d12] flex items-center gap-1">
              <GitCompare size={12} /> Frontier Comparison
            </span>
            <span className="text-xs text-[#5b5f65]">Standardized Sycophancy Testbed</span>
          </div>
          <h1 className="text-2xl font-bold text-[#1c1e21]">Model Comparison</h1>
          <p className="text-xs md:text-sm text-[#5b5f65] mt-1 max-w-2xl leading-relaxed">
            Side-by-side behavioral comparison of Claude 3.5 Sonnet, GPT-4o, Gemini 2.0 Flash, DeepSeek R1, and open-weight models under controlled conversational pressure.
          </p>
        </div>
      </div>

      {/* Radar Chart & Multi-Axis Evaluation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white border border-[#e7e2d4] rounded-xl p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h2 className="text-sm font-semibold text-[#1c1e21] flex items-center gap-1.5">
                <Sliders size={15} className="text-[#c9a227]" />
                Multi-Dimensional Alignment Radar (0-100)
              </h2>
              <p className="text-xs text-[#5b5f65]">
                Higher score indicates stronger resistance to sycophancy and superior truthfulness.
              </p>
            </div>

            {/* Model Toggles */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {Object.keys(modelColors).map(name => {
                const isSelected = selectedModelsForRadar.includes(name)
                return (
                  <button
                    key={name}
                    onClick={() => toggleModelRadar(name)}
                    className={`px-2 py-0.5 rounded-full text-[11px] font-medium border transition ${
                      isSelected
                        ? 'border-transparent text-white'
                        : 'border-[#e7e2d4] text-[#5b5f65] bg-white hover:bg-[#fafaf8]'
                    }`}
                    style={isSelected ? { backgroundColor: modelColors[name] } : {}}
                  >
                    {name.split(' ')[0]}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} outerRadius="75%">
                <PolarGrid stroke="#e7e2d4" />
                <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10, fill: '#5b5f65' }} />
                <PolarRadiusAxis angle={30} domain={[50, 100]} tick={{ fontSize: 9 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e7e2d4', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                {selectedModelsForRadar.map(m => (
                  <Radar
                    key={m}
                    name={m}
                    dataKey={m}
                    stroke={modelColors[m]}
                    fill={modelColors[m]}
                    fillOpacity={0.25}
                    strokeWidth={2}
                  />
                ))}
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sycophancy Vulnerability by Domain */}
        <div className="lg:col-span-5 bg-white border border-[#e7e2d4] rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-semibold text-[#1c1e21] flex items-center gap-1.5">
              <Sparkles size={15} className="text-[#c9a227]" />
              Sycophancy Rate by Knowledge Domain
            </h2>
            <p className="text-xs text-[#5b5f65] mt-0.5">
              Subjective opinions trigger significantly higher model compliance than math or code.
            </p>

            <div className="h-72 w-full mt-3">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0ede4" />
                  <XAxis dataKey="category" angle={-15} textAnchor="end" tick={{ fontSize: 10 }} />
                  <YAxis unit="%" tick={{ fontSize: 10 }} />
                  <Tooltip
                    formatter={(val: any) => [`${val}% Sycophancy`]}
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e7e2d4', fontSize: '11px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '10px' }} />
                  <Bar dataKey="Claude 3.5 Sonnet" fill="#d97706" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="GPT-4o" fill="#10b981" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="Gemini 2.0 Flash" fill="#3b82f6" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="text-[11px] text-[#5b5f65] bg-[#fafaf8] p-2.5 rounded-lg border border-[#e7e2d4]">
            <b>Key Finding:</b> Subjective and political queries result in 2.8x higher sycophancy rates than strict mathematical prompts.
          </div>
        </div>
      </div>

      {/* Side-by-Side Prompt Response Playground */}
      <div className="bg-white border border-[#e7e2d4] rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#e7e2d4] pb-4">
          <div>
            <h2 className="text-base font-semibold text-[#1c1e21] flex items-center gap-1.5">
              <Eye size={16} className="text-[#c9a227]" />
              Side-by-Side Response Playground
            </h2>
            <p className="text-xs text-[#5b5f65] mt-0.5">
              Select a benchmark pressure prompt below to see how each model responds to the identical claim.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#5b5f65] font-medium">Select Test Prompt:</span>
            <select
              value={selectedPromptId}
              onChange={e => setSelectedPromptId(e.target.value)}
              className="text-xs border border-[#e7e2d4] rounded-lg px-2.5 py-1.5 bg-white text-[#2d3139] focus:outline-none focus:border-[#c9a227]"
            >
              {BENCHMARK_COMPARISON_SAMPLES.map(s => (
                <option key={s.id} value={s.id}>
                  [{s.category}] {s.prompt.slice(0, 50)}...
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Selected Prompt Banner */}
        <div className="bg-[#fafaf8] border border-[#e7e2d4] rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#8c6d12] bg-[#f8f6ed] border border-[#f3e5a8] px-2 py-0.5 rounded">
              User Test Prompt ({currentSample.category})
            </span>
            <span className="text-xs text-[#5b5f65]">
              Ground Truth Reference: <i>{currentSample.reference}</i>
            </span>
          </div>
          <p className="text-sm text-[#1c1e21] font-medium italic">
            "{currentSample.prompt}"
          </p>
        </div>

        {/* Model Response Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {currentSample.models.map((item, idx) => {
            const isSyc = item.isSycophantic
            return (
              <div
                key={idx}
                className={`border rounded-xl p-4 flex flex-col justify-between transition hover:shadow-md ${
                  isSyc
                    ? 'border-amber-300 bg-amber-50/30'
                    : 'border-emerald-200 bg-emerald-50/20'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-xs text-[#1c1e21]">{item.name}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-bold flex items-center gap-1 ${
                        isSyc
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      }`}
                    >
                      {isSyc ? <AlertTriangle size={10} /> : <CheckCircle size={10} />}
                      {isSyc ? 'Sycophantic' : 'Grounded'}
                    </span>
                  </div>

                  <p className="text-xs text-[#2d3139] leading-relaxed line-clamp-6 bg-white p-2.5 rounded-lg border border-[#e7e2d4] mb-3">
                    "{item.response}"
                  </p>
                </div>

                <div className="pt-2 border-t border-[#e7e2d4] flex items-center justify-between text-[11px] text-[#5b5f65]">
                  <span>Sycophancy Risk:</span>
                  <span className={`font-mono font-bold ${isSyc ? 'text-amber-700' : 'text-emerald-700'}`}>
                    {(item.riskScore * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
