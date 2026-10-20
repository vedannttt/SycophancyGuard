import { useState, useRef } from 'react'
import {
  Database,
  Search,
  Filter,
  Download,
  Upload,
  Eye,
  X,
  FileSpreadsheet,
  AlertTriangle,
} from 'lucide-react'
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts'
import Papa from 'papaparse'
import { INITIAL_DATASET_ROWS, type DatasetItem } from '../lib/benchmarkData'

export default function DatasetExplorer() {
  const [data, setData] = useState<DatasetItem[]>(INITIAL_DATASET_ROWS)
  const [searchTerm, setSearchTerm] = useState('')
  const [domainFilter, setDomainFilter] = useState('All')
  const [pressureFilter, setPressureFilter] = useState('All')
  const [labelFilter, setLabelFilter] = useState('All')
  const [selectedItem, setSelectedItem] = useState<DatasetItem | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Filtering
  const filtered = data.filter(item => {
    const matchSearch =
      searchTerm === '' ||
      item.prompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.response.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.domain.toLowerCase().includes(searchTerm.toLowerCase())

    const matchDomain = domainFilter === 'All' || item.domain === domainFilter
    const matchPressure = pressureFilter === 'All' || item.pressureType === pressureFilter
    const matchLabel = labelFilter === 'All' || item.groundTruthLabel === labelFilter

    return matchSearch && matchDomain && matchPressure && matchLabel
  })

  // Export to CSV
  const exportCSV = () => {
    const csv = Papa.unparse(filtered)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `sycophancy_benchmark_${Date.now()}.csv`
    a.click()
  }

  // Export to JSON
  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(filtered, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `sycophancy_benchmark_${Date.now()}.json`
    a.click()
  }

  // Import CSV
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsed = results.data.map((row: any, i) => ({
          id: data.length + i + 1,
          domain: row.domain || 'General',
          pressureType: row.pressureType || 'neutral',
          prompt: row.prompt || '',
          response: row.response || '',
          reference: row.reference || '',
          groundTruthLabel: (row.groundTruthLabel || 'Grounded') as any,
          riskScore: parseFloat(row.riskScore) || 0.1,
        }))
        setData(prev => [...prev, ...parsed])
      },
    })
  }

  // Distribution for small DAV chart
  const domains = Array.from(new Set(data.map(d => d.domain)))
  const labelCounts = [
    { name: 'Potentially Sycophantic', value: data.filter(d => d.groundTruthLabel === 'Potentially Sycophantic').length, color: '#ef4444' },
    { name: 'Grounded', value: data.filter(d => d.groundTruthLabel === 'Grounded').length, color: '#10b981' },
    { name: 'Appropriately Agreeable', value: data.filter(d => d.groundTruthLabel === 'Appropriately Agreeable').length, color: '#3b82f6' },
  ]

  return (
    <div className="space-y-6 max-w-6xl pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#c9a227]/20 text-[#8c6d12] flex items-center gap-1">
              <Database size={12} /> Benchmark Corpus
            </span>
            <span className="text-xs text-[#5b5f65]">{data.length} Total Curated Records</span>
          </div>
          <h1 className="text-2xl font-bold text-[#1c1e21]">Dataset Explorer</h1>
          <p className="text-xs md:text-sm text-[#5b5f65] mt-1 max-w-2xl leading-relaxed">
            Inspect, filter, search, and import/export conversational sycophancy benchmark pairs across mathematical, scientific, and moral pressure vectors.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".csv,.json"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-1.5 bg-white border border-[#e7e2d4] hover:bg-[#fafaf8] text-[#2d3139] text-xs font-medium rounded-lg shadow-xs flex items-center gap-1.5 transition"
          >
            <Upload size={13} /> Import CSV
          </button>
          <button
            onClick={exportCSV}
            className="px-3 py-1.5 bg-[#c9a227] hover:bg-[#b5901e] text-white text-xs font-medium rounded-lg shadow-xs flex items-center gap-1.5 transition"
          >
            <Download size={13} /> Export CSV
          </button>
          <button
            onClick={exportJSON}
            className="px-3 py-1.5 bg-white border border-[#e7e2d4] hover:bg-[#fafaf8] text-[#2d3139] text-xs font-medium rounded-lg shadow-xs flex items-center gap-1.5 transition"
          >
            <FileSpreadsheet size={13} /> JSON
          </button>
        </div>
      </div>

      {/* Analytics Summary & Mini DAV */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-[#e7e2d4] rounded-xl p-4 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-[#5b5f65]">Active Corpus Filter</div>
            <div className="text-2xl font-bold text-[#1c1e21] mt-1">{filtered.length} of {data.length}</div>
            <div className="text-[11px] text-[#5b5f65] mt-0.5">Matching current search query</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#f8f6ed] flex items-center justify-center text-[#c9a227]">
            <Filter size={18} />
          </div>
        </div>

        <div className="bg-white border border-[#e7e2d4] rounded-xl p-4 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-[#5b5f65]">Sycophantic Label Ratio</div>
            <div className="text-2xl font-bold text-amber-700 mt-1">
              {((data.filter(d => d.groundTruthLabel === 'Potentially Sycophantic').length / data.length) * 100).toFixed(0)}%
            </div>
            <div className="text-[11px] text-[#5b5f65] mt-0.5">Adversarially induced flattery</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
            <AlertTriangle size={18} />
          </div>
        </div>

        <div className="bg-white border border-[#e7e2d4] rounded-xl p-4 shadow-xs flex items-center justify-between">
          <div className="flex-1">
            <div className="text-xs font-medium text-[#5b5f65]">Label Distribution</div>
            <div className="text-xs text-[#2d3139] font-medium mt-1">
              {labelCounts[0].value} Syc. / {labelCounts[1].value} Grounded
            </div>
            <div className="flex items-center gap-2 mt-2 text-[10px] text-[#5b5f65]">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Grounded</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" /> Sycophantic</span>
            </div>
          </div>
          <div className="w-16 h-16 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={labelCounts} dataKey="value" cx="50%" cy="50%" innerRadius={18} outerRadius={28}>
                  {labelCounts.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white border border-[#e7e2d4] rounded-xl p-4 shadow-xs flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[220px] relative">
          <Search size={15} className="absolute left-3 top-2.5 text-[#5b5f65]" />
          <input
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search prompt, model response, or domain..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-[#e7e2d4] rounded-lg focus:outline-none focus:border-[#c9a227]"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#5b5f65]">Domain:</span>
          <select
            value={domainFilter}
            onChange={e => setDomainFilter(e.target.value)}
            className="text-xs border border-[#e7e2d4] rounded-lg px-2.5 py-1.5 bg-white text-[#2d3139]"
          >
            <option value="All">All Domains</option>
            {domains.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#5b5f65]">Pressure:</span>
          <select
            value={pressureFilter}
            onChange={e => setPressureFilter(e.target.value)}
            className="text-xs border border-[#e7e2d4] rounded-lg px-2.5 py-1.5 bg-white text-[#2d3139]"
          >
            <option value="All">All Pressures</option>
            <option value="authority">Authority</option>
            <option value="confident_disagreement">Confident Disagreement</option>
            <option value="opinion">Opinion</option>
            <option value="emotional">Emotional</option>
            <option value="repeated_challenge">Repeated Challenge</option>
            <option value="neutral">Neutral</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#5b5f65]">Label:</span>
          <select
            value={labelFilter}
            onChange={e => setLabelFilter(e.target.value)}
            className="text-xs border border-[#e7e2d4] rounded-lg px-2.5 py-1.5 bg-white text-[#2d3139]"
          >
            <option value="All">All Labels</option>
            <option value="Potentially Sycophantic">Potentially Sycophantic</option>
            <option value="Grounded">Grounded</option>
            <option value="Appropriately Agreeable">Appropriately Agreeable</option>
          </select>
        </div>
      </div>

      {/* Dataset Table */}
      <div className="bg-white border border-[#e7e2d4] rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#fafaf8] text-[#5b5f65] uppercase tracking-wider text-[10px] border-b border-[#e7e2d4]">
              <tr>
                <th className="py-2.5 px-4 font-semibold w-12">ID</th>
                <th className="py-2.5 px-4 font-semibold">Domain</th>
                <th className="py-2.5 px-4 font-semibold">Pressure Type</th>
                <th className="py-2.5 px-4 font-semibold">User Claim / Prompt</th>
                <th className="py-2.5 px-4 font-semibold">Model Response</th>
                <th className="py-2.5 px-4 font-semibold">Ground Truth</th>
                <th className="py-2.5 px-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0ede4]">
              {filtered.map(item => {
                const isSyc = item.groundTruthLabel === 'Potentially Sycophantic'
                const isGro = item.groundTruthLabel === 'Grounded'

                return (
                  <tr key={item.id} className="hover:bg-[#fafaf8] transition">
                    <td className="py-3 px-4 font-mono text-[#5b5f65]">{item.id}</td>
                    <td className="py-3 px-4 font-medium text-[#1c1e21]">{item.domain}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px]">
                        {item.pressureType}
                      </span>
                    </td>
                    <td className="py-3 px-4 max-w-xs truncate text-[#2d3139]" title={item.prompt}>
                      {item.prompt}
                    </td>
                    <td className="py-3 px-4 max-w-xs truncate text-[#5b5f65] italic" title={item.response}>
                      "{item.response}"
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isSyc
                            ? 'bg-amber-100 text-amber-900'
                            : isGro
                            ? 'bg-emerald-100 text-emerald-900'
                            : 'bg-blue-100 text-blue-900'
                        }`}
                      >
                        {item.groundTruthLabel}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => setSelectedItem(item)}
                        className="p-1 hover:bg-white border border-transparent hover:border-[#e7e2d4] rounded text-[#5b5f65] hover:text-[#2d3139] transition"
                        title="View Full Detail"
                      >
                        <Eye size={13} />
                      </button>
                    </td>
                  </tr>
                )
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-xs text-[#5b5f65]">
                    No benchmark samples matched your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Row Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-[#e7e2d4] rounded-2xl max-w-2xl w-full p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#e7e2d4] pb-3">
              <div>
                <h3 className="font-bold text-base text-[#1c1e21]">
                  Benchmark Sample #{selectedItem.id} ({selectedItem.domain})
                </h3>
                <span className="text-xs text-[#5b5f65]">Pressure Vector: {selectedItem.pressureType}</span>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="p-1 text-[#5b5f65] hover:text-[#1c1e21] rounded-lg transition"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="font-semibold text-[#2d3139] block mb-1">User Prompt / Adversarial Claim:</span>
                <p className="bg-[#fafaf8] p-3 rounded-xl border border-[#e7e2d4] text-[#1c1e21] leading-relaxed">
                  {selectedItem.prompt}
                </p>
              </div>

              <div>
                <span className="font-semibold text-[#2d3139] block mb-1">Model Response:</span>
                <p className="bg-[#fafaf8] p-3 rounded-xl border border-[#e7e2d4] text-[#1c1e21] leading-relaxed italic">
                  "{selectedItem.response}"
                </p>
              </div>

              <div>
                <span className="font-semibold text-[#2d3139] block mb-1">Ground Truth Reference:</span>
                <p className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-emerald-900 leading-relaxed">
                  {selectedItem.reference}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-[#fafaf8] border border-[#e7e2d4] p-3 rounded-xl">
                  <span className="text-[#5b5f65] block">Ground Truth Classification:</span>
                  <span className="font-bold text-sm text-[#1c1e21] mt-0.5 block">
                    {selectedItem.groundTruthLabel}
                  </span>
                </div>
                <div className="bg-[#fafaf8] border border-[#e7e2d4] p-3 rounded-xl">
                  <span className="text-[#5b5f65] block">Assigned Sycophancy Risk:</span>
                  <span className="font-mono font-bold text-sm text-amber-700 mt-0.5 block">
                    {(selectedItem.riskScore * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 bg-[#c9a227] text-white rounded-lg text-xs font-semibold hover:bg-[#b5901e] transition"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
