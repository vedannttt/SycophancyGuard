import { useState, useEffect, useRef } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  ShieldCheck,
  LayoutDashboard,
  MessageSquare,
  FileSearch,
  FlaskConical,
  GitCompare,
  Database,
  Eye,
  BarChart3,
  FileText,
  Settings,
  Search,
  BookMarked,
  ChevronLeft,
  ChevronRight,
  X,
  Clock,
} from 'lucide-react'
import { db, type ChatSession } from '../../lib/db'

const nav = [
  { to: '/', label: 'Overview', icon: LayoutDashboard },
  { to: '/chatlab', label: 'ChatLab', icon: MessageSquare },
  { to: '/analyze', label: 'Analyze Conversation', icon: FileSearch },
  { to: '/research', label: 'Research Lab', icon: FlaskConical },
  { to: '/compare', label: 'Model Comparison', icon: GitCompare },
  { to: '/datasets', label: 'Dataset Explorer', icon: Database },
  { to: '/explainability', label: 'Explainability', icon: Eye },
  { to: '/evaluation', label: 'Evaluation & Benchmarks', icon: BarChart3 },
  { to: '/reports', label: 'Reports', icon: FileText },
  { to: '/settings', label: 'Settings', icon: Settings },
]

interface SearchMatch {
  id: number
  title: string
  snippet: string
  date: string
}

export function Layout() {
  const [collapsed, setCollapsed] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchMatch[]>([])
  const [showSearchDropdown, setShowSearchDropdown] = useState(false)
  const searchContainerRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  // Real-time conversation search across IndexedDB
  useEffect(() => {
    const performSearch = async () => {
      const q = searchQuery.trim().toLowerCase()
      if (!q) {
        setSearchResults([])
        setShowSearchDropdown(false)
        return
      }

      try {
        const chats: ChatSession[] = await db.chats.toArray()
        const matches: SearchMatch[] = []

        for (const chat of chats) {
          if (!chat.id) continue
          const titleMatch = (chat.title || '').toLowerCase().includes(q)

          let foundSnippet = ''
          if (chat.messages) {
            for (const msg of chat.messages) {
              const contentLower = (msg.content || '').toLowerCase()
              const matchIdx = contentLower.indexOf(q)
              if (matchIdx !== -1) {
                const start = Math.max(0, matchIdx - 30)
                const end = Math.min(msg.content.length, matchIdx + q.length + 40)
                foundSnippet = (start > 0 ? '...' : '') + msg.content.slice(start, end) + (end < msg.content.length ? '...' : '')
                break
              }
            }
          }

          if (titleMatch || foundSnippet) {
            matches.push({
              id: chat.id,
              title: chat.title || 'Untitled Conversation',
              snippet: foundSnippet || (chat.messages?.[0]?.content?.slice(0, 60) || 'Conversation'),
              date: new Date(chat.updatedAt || chat.createdAt || Date.now()).toLocaleDateString(),
            })
          }
        }

        setSearchResults(matches)
        setShowSearchDropdown(true)
      } catch {
        setSearchResults([])
      }
    }

    const timer = setTimeout(performSearch, 150)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowSearchDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelectConversation = (id: number) => {
    setShowSearchDropdown(false)
    setSearchQuery('')
    navigate(`/chatlab?session=${id}`)
  }

  return (
    <div className="min-h-screen bg-white text-[#1f2328] flex">
      {/* Sidebar (Collapsible) */}
      <aside
        className={`shrink-0 border-r border-[#e7e2d4] bg-[#fafaf8] hidden md:flex md:flex-col transition-all duration-300 relative ${
          collapsed ? 'w-18' : 'w-64'
        }`}
      >
        {/* Sidebar Header & Toggle */}
        <div className="px-4 py-4 flex items-center justify-between border-b border-[#e7e2d4] h-16">
          <div className="flex items-center gap-2 overflow-hidden">
            <ShieldCheck className="text-[#c9a227] shrink-0" size={24} />
            {!collapsed && (
              <div className="truncate">
                <div className="font-bold text-sm leading-tight text-[#1c1e21]">SycophancyGuard</div>
                <div className="text-[10px] text-[#5b5f65] truncate">LLM Alignment Platform</div>
              </div>
            )}
          </div>

          {/* Open / Close Toggle Button */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="p-1 rounded-lg text-[#5b5f65] hover:text-[#1c1e21] hover:bg-white border border-transparent hover:border-[#e7e2d4] transition shrink-0 cursor-pointer"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Navigation List */}
        <nav className="p-2 flex-1 overflow-y-auto space-y-1">
          {nav.map(n => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.to === '/'}
              title={collapsed ? n.label : undefined}
              className={({ isActive }) =>
                `flex items-center rounded-xl py-2.5 text-xs transition group ${
                  collapsed ? 'justify-center px-0' : 'gap-3 px-3'
                } ${
                  isActive
                    ? 'bg-[#c9a227]/15 text-[#a68418] font-bold shadow-xs'
                    : 'text-[#5b5f65] hover:text-[#1c1e21] hover:bg-white'
                }`
              }
            >
              <n.icon size={18} className="shrink-0" />
              {!collapsed && <span className="truncate">{n.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Footer Persistence Tag */}
        <div className={`p-3 border-t border-[#e7e2d4] text-[11px] text-[#5b5f65] flex items-center ${collapsed ? 'justify-center' : 'gap-2'}`}>
          <BookMarked size={15} className="text-[#c9a227] shrink-0" />
          {!collapsed && <span className="truncate">IndexedDB local persistence</span>}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header with Working Global Search */}
        <header className="h-14 border-b border-[#e7e2d4] bg-white flex items-center px-6 gap-4 sticky top-0 z-40">
          <div ref={searchContainerRef} className="flex-1 max-w-lg relative">
            <div className="flex items-center gap-2 border border-[#e7e2d4] focus-within:border-[#c9a227] rounded-xl px-3 py-1.5 bg-[#fafaf8] focus-within:bg-white transition">
              <Search size={15} className="text-[#5b5f65] shrink-0" />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onFocus={() => { if (searchResults.length > 0) setShowSearchDropdown(true) }}
                placeholder="Search past conversations & transcripts..."
                className="flex-1 bg-transparent outline-none text-xs text-[#1c1e21]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="p-0.5 text-[#5b5f65] hover:text-[#1c1e21] transition cursor-pointer"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Interactive Search Results Dropdown */}
            {showSearchDropdown && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-[#e7e2d4] rounded-xl shadow-xl overflow-hidden z-50 max-h-80 overflow-y-auto">
                <div className="p-2.5 bg-[#fafaf8] border-b border-[#e7e2d4] flex items-center justify-between text-[11px] text-[#5b5f65]">
                  <span>Matches in IndexedDB ({searchResults.length})</span>
                  <span>Click to open in ChatLab</span>
                </div>

                {searchResults.length > 0 ? (
                  <div className="divide-y divide-[#f0ede4]">
                    {searchResults.map(result => (
                      <div
                        key={result.id}
                        onClick={() => handleSelectConversation(result.id)}
                        className="p-3 hover:bg-[#fafaf8] cursor-pointer transition text-xs space-y-1 group"
                      >
                        <div className="font-semibold text-[#1c1e21] flex items-center justify-between">
                          <span className="truncate group-hover:text-[#a68418] flex items-center gap-1.5">
                            <MessageSquare size={13} className="text-[#c9a227]" />
                            {result.title}
                          </span>
                          <span className="text-[10px] text-[#5b5f65] flex items-center gap-1 shrink-0">
                            <Clock size={10} /> {result.date}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#5b5f65] line-clamp-2 italic">
                          "{result.snippet}"
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center text-xs text-[#5b5f65]">
                    No saved conversations found matching "<b className="text-[#1c1e21]">{searchQuery}</b>".
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 text-xs text-[#5b5f65] ml-auto">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#f8f6ed] text-[#8c6d12] border border-[#f3e5a8] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              SycophancyGuard Active
            </span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
