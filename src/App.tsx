import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import SessionPage from './pages/SessionPage'
import ActivityPage from './pages/ActivityPage'

export default function App() {
  return (
    <div className="h-full bg-slate-50">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/session" element={<SessionPage />} />
        <Route path="/activity" element={<ActivityPage />} />
      </Routes>
    </div>
  )
}
