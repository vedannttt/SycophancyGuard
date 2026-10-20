import Dexie, { type Table } from 'dexie'

export interface ChatMessage { id?: number; role: 'user' | 'assistant'; content: string; createdAt: number; analysis?: any }
export interface ChatSession { id?: number; title: string; createdAt: number; updatedAt: number; messages: ChatMessage[]; pinned?: boolean }
export interface AnalysisRecord { id?: number; createdAt: number; label: string; confidence: number }
export interface ExperimentRecord { id?: number; createdAt: number; name: string; data: any }
export interface DatasetRow { id?: number; group: number; prompt: string; response: string; label: string; pressure: string }
export interface AppSetting { key: string; value: any }

class SGDb extends Dexie {
  chats!: Table<ChatSession>
  analyses!: Table<AnalysisRecord>
  experiments!: Table<ExperimentRecord>
  datasets!: Table<DatasetRow>
  settings!: Table<AppSetting>
  constructor() {
    super('sycophancyguard')
    this.version(1).stores({
      chats: '++id,title,createdAt,updatedAt,pinned',
      analyses: '++id,createdAt,label',
      experiments: '++id,createdAt,name',
      datasets: '++id,label,pressure,group',
      settings: 'key',
    })
  }
}
export const db = new SGDb()
