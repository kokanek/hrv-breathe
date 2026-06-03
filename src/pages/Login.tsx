import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import BreathingCircle from '../components/BreathingCircle'
import { useBreathingCycle } from '../hooks/useBreathingCycle'

export default function Login() {

  const navigate = useNavigate()
  const { phase } = useBreathingCycle(true, true)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        throw new Error('Wrong username/password');
      }

      const data = await response.json();

      // Save the JWT token securely in the browser
      localStorage.setItem('hrv_app_token', data.token);

      // Redirect them to the main app dashboard
      navigate('/');

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="h-full relative overflow-hidden bg-white">
      {/* Breathing animation — centered in the top half, sits in the background */}
      <div className="absolute top-0 left-0 right-0 h-1/2 flex items-center justify-center pointer-events-none opacity-90">
        <BreathingCircle phase={phase} isRunning={true} isLoginPage={true} />
      </div>

      {/* Soft fade so the form reads cleanly over the animation */}
      <div className="absolute inset-x-0 top-1/3 bottom-0 bg-linear-to-b from-transparent via-white/80 to-white pointer-events-none" />

      {/* Content — login form anchored to the bottom half */}
      <div className="absolute inset-x-0 bottom-0 top-1/3 z-10 flex flex-col justify-center px-6">
        <h1 className="text-[2rem] leading-tight font-bold tracking-tight text-gray-900 mb-4">
          Breath Bubbles
        </h1>

        {/* <h1 className="text-[1rem] leading-tight font-bold tracking-tight text-gray-500 mb-2">
          Log in to sync progress
        </h1> */}

        <form onSubmit={handleLogin} className="flex flex-col gap-3">
          <div className="rounded-2xl border border-gray-200 bg-white px-4 py-3 focus-within:border-gray-900 transition-colors">
            <label className="block text-xs font-medium text-gray-400 mb-0.5">Email</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="you@example.com"
              autoComplete="username"
              className="w-full bg-transparent text-lg text-gray-900 placeholder-gray-300 outline-none"
            />
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white px-4 py-3 focus-within:border-gray-900 transition-colors">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-medium text-gray-400 mb-0.5">Password</label>
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword((s) => !s)}
                className="text-sm font-semibold text-gray-900 underline underline-offset-2"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              className="w-full bg-transparent text-lg text-gray-900 placeholder-gray-300 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-3 w-full py-4 rounded-full bg-gray-900 text-white font-semibold text-lg shadow-sm active:scale-[0.99] transition-transform flex items-center justify-center gap-2 disabled:opacity-70 disabled:active:scale-100"
          >
            {loading ? (
              <>
                <span className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Logging in…
              </>
            ) : (
              'Log in'
            )}
          </button>

          {/* Always-present container reserves space so the button stays put */}
          <p className="mt-1 h-5 text-center text-sm font-medium text-red-500">
            {error}
          </p>
        </form>
      </div>
    </div>
  )
}
