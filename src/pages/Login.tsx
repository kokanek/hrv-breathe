import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import BreathingCircle from '../components/BreathingCircle'
import { useBreathingCycle } from '../hooks/useBreathingCycle'

export default function Login() {

  const navigate = useNavigate()
  const { phase } = useBreathingCycle(true, true)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()
    // implement call to login endpoint here
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        throw new Error('Invalid username or password');
      }

      const data = await response.json();

      // Save the JWT token securely in the browser
      localStorage.setItem('hrv_app_token', data.token);

      // Redirect them to the main app dashboard
      navigate('/');

    } catch (error) {
      console.log(error instanceof Error ? error.message : error);
    }

  }

  return (
    <div className="h-full relative overflow-hidden">
      {/* Pastel gradient background */}
      <div className="absolute inset-0 gradient-bg" />

      {/* Decorative dots */}
      <div className="absolute top-[18%] right-[14%] w-2 h-2 rounded-full" style={{ backgroundColor: 'rgba(168,208,212,0.5)' }} />
      <div className="absolute top-[32%] left-[12%] w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'rgba(251,196,181,0.6)' }} />
      <div className="absolute bottom-[32%] right-[18%] w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'rgba(184,221,181,0.55)' }} />
      <div className="absolute bottom-[20%] left-[16%] w-2 h-2 rounded-full" style={{ backgroundColor: 'rgba(216,228,152,0.5)' }} />
      <div className="absolute top-[55%] right-[10%] w-1 h-1 rounded-full" style={{ backgroundColor: 'rgba(196,184,232,0.6)' }} />

      {/* Page heading */}
      <h1
        className="absolute top-32 left-0 right-0 z-20 text-center text-6xl font-bold leading-[1.05] pointer-events-none"
        style={{ fontFamily: '"Elms Sans", sans-serif' }}
      >
        <span className="block text-2xl font-medium tracking-[0.45em] pl-[0.45em] text-teal-600/50">
          HRV
        </span>
        <span className="block bg-linear-to-br from-emerald-400 to-rose-300 bg-clip-text text-transparent drop-shadow-sm">
          BREATHE
        </span>
      </h1>

      {/* Breathing animation background */}
      <div className="absolute top-12 left-6 flex items-center justify-center pointer-events-none">
        <BreathingCircle phase={phase} isRunning={true} isLoginPage={true} />
      </div>

      {/* Content — centered login form */}
      <div className="absolute top-2/3 left-0 right-0 z-10 flex items-center justify-center px-6 transform -translate-y-1/2">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-xs flex flex-col items-center gap-4"
        >
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            autoComplete="username"
            className="w-full py-4 px-5 rounded-xl bg-white/5 border border-white/40 text-gray-800 placeholder-gray-500 shadow-lg outline-none focus:ring-2 focus:ring-white/60"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoComplete="current-password"
            className="w-full py-4 px-5 rounded-xl bg-white/5 border border-white/40 text-gray-800 placeholder-gray-500 shadow-lg outline-none focus:ring-2 focus:ring-white/60"
          />
          <button
            type="submit"
            className="w-48 py-4 rounded-xl bg-gray-800 text-white font-semibold text-lg flex items-center justify-center gap-2 shadow-lg"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  )
}
