import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import HomePage from './pages/HomePage'
import SessionPage from './pages/SessionPage'
import ActivityPage from './pages/ActivityPage'
import LoginPage from './pages/Login'

const ProtectedRoute = () => {
  // Look for your family app token in the local storage
  const token = localStorage.getItem('hrv_app_token');

  // If NO token is found, redirect to the public login page
  // The 'replace' prop prevents them from hitting 'back' to return to the protected page
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If the token EXISTS, render the child components (the protected pages)
  return <Outlet />;
};

export default function App() {
  return (
    <div className="h-full bg-slate-50">
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/session" element={<SessionPage />} />
          <Route path="/activity" element={<ActivityPage />} />
        </Route>
      </Routes>
    </div>
  )
}
