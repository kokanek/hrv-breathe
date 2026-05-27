import { motion } from 'framer-motion'

const BUBBLES = [
  { value: 3, top: '45%', left: '5%', size: 100 },
  { value: 5, top: '8%', left: '30%', size: 130 },
  { value: 7, top: '55%', left: '25%', size: 90 },
  { value: 10, top: '15%', left: '60%', size: 120 },
  { value: 15, top: '55%', left: '65%', size: 95 },
]

interface Props {
  selected: number
  onSelect: (val: number) => void
}

export default function DurationBubbles({ selected, onSelect }: Props) {
  return (
    <div className="relative w-full h-64 mx-auto">
      {BUBBLES.map(bubble => {
        const isActive = selected === bubble.value
        return (
          <motion.button
            key={bubble.value}
            className={`absolute rounded-full flex flex-col items-center justify-center transition-colors duration-300 ${
              isActive
                ? 'bg-emerald-800 text-white shadow-lg'
                : 'bg-emerald-50 text-emerald-900 border border-emerald-200/50'
            }`}
            style={{
              top: bubble.top,
              left: bubble.left,
              width: bubble.size,
              height: bubble.size,
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={{ scale: isActive ? 1.08 : 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            onClick={() => onSelect(bubble.value)}
          >
            <span className="text-2xl font-bold leading-none">{bubble.value}</span>
            <span className="text-xs mt-0.5 opacity-70">mins</span>
          </motion.button>
        )
      })}
    </div>
  )
}
