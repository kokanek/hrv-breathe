import type { SessionData } from '../utils/api'

function getDurationColor(durationSeconds: number) {
  const minutes = durationSeconds / 60
  if (minutes < 5) return 'bg-blue-100 text-blue-700'
  if (minutes < 10) return 'bg-green-100 text-green-700'
  if (minutes <= 15) return 'bg-amber-100 text-amber-700'
  return 'bg-purple-100 text-purple-700'
}

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60)
  return `${m} Min${m !== 1 ? 's' : ''}`
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

interface Props {
  session: SessionData
}

export default function ActivityItem({ session }: Props) {
  const colorClass = getDurationColor(session.durationSeconds)

  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
      <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
        <svg className="w-6 h-6 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
        </svg>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="font-medium text-gray-900 text-sm">Breathing Session</p>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colorClass}`}>
            {formatDuration(session.durationSeconds)}
          </span>
        </div>
        <p className="text-xs text-gray-400 mt-0.5">{formatDate(session.createdAt)}</p>
        {session.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {session.tags.map(tag => (
              <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-[11px]">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
