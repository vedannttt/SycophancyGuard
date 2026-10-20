import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import Overview from './pages/Overview'
import ChatLab from './pages/ChatLab'
import AnalyzeConversation from './pages/AnalyzeConversation'
import ResearchLab from './pages/ResearchLab'
import ModelComparison from './pages/ModelComparison'
import DatasetExplorer from './pages/DatasetExplorer'
import Explainability from './pages/Explainability'
import Evaluation from './pages/Evaluation'
import Reports from './pages/Reports'
import Settings from './pages/Settings'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Overview />} />
        <Route path="/chatlab" element={<ChatLab />} />
        <Route path="/analyze" element={<AnalyzeConversation />} />
        <Route path="/research" element={<ResearchLab />} />
        <Route path="/compare" element={<ModelComparison />} />
        <Route path="/datasets" element={<DatasetExplorer />} />
        <Route path="/explainability" element={<Explainability />} />
        <Route path="/evaluation" element={<Evaluation />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  )
}
