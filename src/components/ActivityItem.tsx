import type { SessionData } from '../utils/api'

function getDurationStyle(durationSeconds: number): { backgroundColor: string; color: string } {
  const minutes = durationSeconds / 60
  if (minutes < 5) return { backgroundColor: '#fbd4cc', color: '#7a3020' }   // rose — matches 3min bubble
  if (minutes < 10) return { backgroundColor: '#c8e8c5', color: '#2d5a2a' }  // sage green — matches 5min bubble
  if (minutes <= 15) return { backgroundColor: '#c0e0e4', color: '#1a5050' } // teal — matches 10min bubble
  return { backgroundColor: '#d8cef4', color: '#3a2870' }                    // lavender — matches 15min bubble
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
  const durationStyle = getDurationStyle(session.durationSeconds)

  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
      <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: '#f0f8f5' }}>
        <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
        </svg>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="font-medium text-gray-800 text-sm">Breathing Session</p>
          <span className="px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0" style={durationStyle}>
            {formatDuration(session.durationSeconds)}
          </span>
        </div>
        <p className="text-xs text-gray-400 mt-0.5">{formatDate(session.createdAt)}</p>
        {session.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {session.tags.map(tag => (
              <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full text-[11px]">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
