import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const TAGS = [
  'pain relief',
  'watery eyes',
  'headache',
  'stress relief',
  'focus',
  'sleep prep',
  'anxiety',
  'energize',
  'calm',
]

interface Props {
  onSave: (tags: string[]) => void
  onSkip: () => void
  elapsedSeconds: number
}

export default function TagSelector({ onSave, onSkip, elapsedSeconds }: Props) {
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set())

  const toggle = (tag: string) => {
    setSelectedTags(prev => {
      const next = new Set(prev)
      if (next.has(tag)) next.delete(tag)
      else next.add(tag)
      return next
    })
  }

  const minutes = Math.floor(elapsedSeconds / 60)
  const seconds = elapsedSeconds % 60

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="w-full max-w-lg bg-white rounded-t-3xl p-6 pb-10"
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        >
          <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6" />

          <h2 className="text-2xl font-bold text-emerald-900 mb-1">Session Complete</h2>
          <p className="text-gray-500 mb-6">
            {minutes}m {seconds.toString().padStart(2, '0')}s of mindful breathing
          </p>

          <p className="text-sm font-medium text-gray-600 mb-3">How do you feel?</p>
          <div className="flex flex-wrap gap-2 mb-8">
            {TAGS.map(tag => (
              <button
                key={tag}
                onClick={() => toggle(tag)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedTags.has(tag)
                    ? 'bg-emerald-800 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={onSkip}
              className="flex-1 py-3.5 rounded-2xl text-gray-500 font-medium border border-gray-200"
            >
              Skip
            </button>
            <button
              onClick={() => onSave(Array.from(selectedTags))}
              className="flex-1 py-3.5 rounded-2xl bg-emerald-800 text-white font-semibold shadow-lg"
            >
              Save Session
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
