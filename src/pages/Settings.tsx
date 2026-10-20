import { useEffect, useState } from 'react'
import { Save, Send, AlertCircle, CheckCircle, ExternalLink, Sparkles, Cpu, ShieldCheck } from 'lucide-react'
import {
  type ProviderConfig,
  loadConfig,
  saveConfig,
  testProvider,
  defaultConfig,
  PROVIDER_PRESETS,
} from '../lib/provider'

export default function Settings() {
  const [cfg, setCfg] = useState<ProviderConfig>(defaultConfig)
  const [status, setStatus] = useState<'idle' | 'testing' | 'ok' | 'error'>('idle')
  const [statusMsg, setStatusMsg] = useState('')
  const [sampleReply, setSampleReply] = useState('')
  const [activeProviderName, setActiveProviderName] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setCfg(loadConfig())
  }, [])

  const selectPreset = (presetId: string) => {
    const p = PROVIDER_PRESETS.find(x => x.id === presetId)
    if (!p) return
    setCfg(prev => ({
      ...prev,
      endpoint: p.endpoint,
      model: p.model,
      mode: 'live',
      apiKey: p.requiresKey ? prev.apiKey || '' : '',
    }))
    setStatus('idle')
    setSampleReply('')
  }

  const save = async () => {
    setSaving(true)
    saveConfig(cfg)
    setStatusMsg('Provider configuration saved successfully to localStorage.')
    setTimeout(() => {
      setSaving(false)
      setStatusMsg('')
    }, 3000)
  }

  const test = async () => {
    setStatus('testing')
    setStatusMsg(`Testing connection to ${cfg.model || 'model'}...`)
    setSampleReply('')
    setActiveProviderName('')
    try {
      const res = await testProvider(cfg)
      setStatus('ok')
      setStatusMsg(`Connected successfully to ${res.providerName}!`)
      setSampleReply(res.reply)
      setActiveProviderName(res.providerName)
    } catch (e: any) {
      setStatus('error')
      setStatusMsg(e?.message || String(e))
    }
  }

  const currentPreset = PROVIDER_PRESETS.find(
    p => p.endpoint === cfg.endpoint && p.model === cfg.model
  )

  return (
    <div className="space-y-6 max-w-4xl pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#1c1e21]">Model & Provider Settings</h1>
          <p className="text-sm text-[#5b5f65] mt-1">
            Configure free online LLMs (Claude 3.5, ChatGPT, DeepSeek, Pollinations, Groq) or sycophancy test personas.
          </p>
        </div>
        <span className="text-xs bg-[#f3e5a8] text-[#8c6d12] px-2.5 py-1 rounded-full font-medium">
          Stored locally & private
        </span>
      </div>

      {/* Preset Quick Chooser */}
      <div className="bg-white border border-[#e7e2d4] rounded-xl p-5 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium text-[#2d3139]">
          <Sparkles size={16} className="text-[#c9a227]" />
          <span>Quick 1-Click Free Presets</span>
        </div>
        <p className="text-xs text-[#5b5f65]">
          Select one of the free presets below to automatically fill in the connection details:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          {PROVIDER_PRESETS.map(preset => {
            const isSelected = currentPreset?.id === preset.id
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => selectPreset(preset.id)}
                className={`text-left p-3 rounded-lg border text-xs transition-all ${
                  isSelected
                    ? 'border-[#c9a227] bg-[#faf6e9] ring-1 ring-[#c9a227]'
                    : 'border-[#e7e2d4] hover:bg-[#fafaf8]'
                }`}
              >
                <div className="font-semibold text-sm text-[#1c1e21] mb-1 flex items-center justify-between">
                  <span>{preset.name.split(' (')[0]}</span>
                  {!preset.requiresKey && (
                    <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-normal">
                      No Key
                    </span>
                  )}
                </div>
                <div className="text-[#5b5f65] text-[11px] leading-relaxed line-clamp-2">
                  {preset.description}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Configuration Form */}
      <div className="bg-white border border-[#e7e2d4] rounded-xl p-5 shadow-xs space-y-4">
        <h2 className="text-sm font-medium text-[#2d3139] flex items-center gap-2">
          <Cpu size={16} className="text-[#5b5f65]" />
          Active Configuration
        </h2>

        <div className="grid gap-4">
          <div>
            <label className="block text-sm font-medium text-[#2d3139] mb-1">Operating Mode</label>
            <select
              value={cfg.mode}
              onChange={e =>
                setCfg({
                  ...cfg,
                  mode: e.target.value as 'live' | 'offline' | 'sycophantic' | 'grounded',
                })
              }
              className="w-full border border-[#e7e2d4] rounded-lg px-3 py-2 bg-white text-sm"
            >
              <option value="live">Live Online LLM (Claude 3.5, ChatGPT, DeepSeek, Pollinations, Groq, OpenRouter)</option>
              <option value="sycophantic">🧪 Sycophantic Persona Simulator (Forces Agreeableness & Sycophancy)</option>
              <option value="grounded">🛡️ Grounded Persona Simulator (Resists Pressure, Strictly Factual)</option>
              <option value="offline">Offline Standard Fallback</option>
            </select>
            <p className="text-xs text-[#5b5f65] mt-1">
              Tip: Use <b>Sycophantic Persona</b> to directly observe SycophancyGuard detecting sycophantic replies!
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2d3139] mb-1">Endpoint URL</label>
            <input
              value={cfg.endpoint}
              onChange={e => setCfg({ ...cfg, endpoint: e.target.value })}
              placeholder="https://js.puter.com or https://text.pollinations.ai or https://api.groq.com/openai/v1"
              className="w-full border border-[#e7e2d4] rounded-lg px-3 py-2 bg-white text-sm"
            />
            <p className="text-xs text-[#5b5f65] mt-1">
              OpenAI-compatible, Puter.js, or Pollinations API endpoint.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2d3139] mb-1">Model Name</label>
            <input
              value={cfg.model}
              onChange={e => setCfg({ ...cfg, model: e.target.value })}
              placeholder="claude-3-5-sonnet, gpt-4o-mini, deepseek-chat, openai-fast, llama-3.3-70b-versatile"
              className="w-full border border-[#e7e2d4] rounded-lg px-3 py-2 bg-white text-sm"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium text-[#2d3139]">
                API Key <span className="text-[#5b5f65] font-normal">(Optional for Free Claude, ChatGPT, DeepSeek & Pollinations)</span>
              </label>
              {currentPreset?.keyHelpUrl && (
                <a
                  href={currentPreset.keyHelpUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-[#c9a227] hover:underline flex items-center gap-1"
                >
                  Get free key here <ExternalLink size={11} />
                </a>
              )}
            </div>
            <input
              type="password"
              value={cfg.apiKey || ''}
              onChange={e => setCfg({ ...cfg, apiKey: e.target.value })}
              placeholder={currentPreset?.keyPlaceholder || 'sk-... or gsk_... (leave blank for free providers)'}
              className="w-full border border-[#e7e2d4] rounded-lg px-3 py-2 bg-white text-sm"
            />
            <p className="text-xs text-[#5b5f65] mt-1">
              All credentials are saved only in your local browser storage (<code className="font-mono">localStorage</code>) and never transmitted to any third-party telemetry server.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={save}
            disabled={saving}
            className="px-4 py-2 bg-[#c9a227] hover:bg-[#b5901e] text-white text-sm font-medium rounded-lg disabled:opacity-50 flex items-center gap-2 transition cursor-pointer"
          >
            {saving ? <Send size={14} className="animate-pulse" /> : <Save size={14} />} Save Settings
          </button>
          <button
            onClick={test}
            disabled={status === 'testing'}
            className="px-4 py-2 border border-[#e7e2d4] rounded-lg text-sm text-[#2d3139] hover:bg-[#fafaf8] disabled:opacity-50 transition cursor-pointer"
          >
            {status === 'testing' ? 'Testing...' : 'Test Connection'}
          </button>
        </div>
      </div>

      {/* Status & Test Result */}
      {status !== 'idle' && (
        <div
          className={`rounded-xl p-4 text-sm transition-all ${
            status === 'testing'
              ? 'bg-blue-50 border border-blue-200 text-blue-800'
              : status === 'ok'
              ? 'bg-[#f8f6ed] border border-[#f3e5a8] text-[#8c6d12]'
              : 'bg-[#fdecec] border border-[#ef9f9f] text-[#b3261e]'
          }`}
        >
          <div className="flex items-center gap-2 font-medium">
            {status === 'ok' && <CheckCircle size={16} className="text-[#a68418]" />}
            {status === 'error' && <AlertCircle size={16} className="text-[#b3261e]" />}
            {status === 'testing' && <Cpu size={16} className="animate-spin text-blue-600" />}
            <span>{statusMsg}</span>
          </div>
          {sampleReply && (
            <div className="mt-3 pt-3 border-t border-[#f3e5a8] text-xs space-y-1">
              <span className="font-semibold text-[#6d540e]">
                Model Response ({activeProviderName || cfg.model}):
              </span>
              <p className="bg-white/80 p-2.5 rounded-lg border border-[#e7e2d4] text-[#2d3139] italic">
                "{sampleReply}"
              </p>
            </div>
          )}
        </div>
      )}

      {/* Research Note on Sycophancy */}
      <div className="bg-[#fafaf8] border border-[#e7e2d4] rounded-xl p-4 text-xs text-[#5b5f65] space-y-1">
        <div className="flex items-center gap-1.5 font-medium text-[#2d3139]">
          <ShieldCheck size={14} className="text-[#c9a227]" />
          <span>SycophancyGuard Security & Privacy Guarantee</span>
        </div>
        <p>
          Your API keys remain strictly local in your browser. When testing models in ChatLab, responses are evaluated on-device for unwarranted agreement tokens, answer reversals, and factual contradictions.
        </p>
      </div>
    </div>
  )
}
