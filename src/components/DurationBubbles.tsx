import { motion } from 'framer-motion'

const BUBBLES = [
  { value: 3,  size: 80,  top: 20,  left: 10,  bg: '#fbc4b5', text: '#7a3020', bgActive: '#e89a85', textActive: '#5a1c0e' },
  { value: 5,  size: 100, top: 10,  left: 100, bg: '#b8ddb5', text: '#2d5a2a', bgActive: '#88c884', textActive: '#1a4018' },
  { value: 10, size: 90,  top: 10,  left: 210, bg: '#a8d0d4', text: '#1a5050', bgActive: '#78b8bc', textActive: '#0d3535' },
  { value: 7,  size: 80,  top: 140, left: 55,  bg: '#d8e498', text: '#4a5818', bgActive: '#bcd060', textActive: '#2e380a' },
  { value: 15, size: 80,  top: 140, left: 175, bg: '#c4b8e8', text: '#3a2870', bgActive: '#a098d8', textActive: '#241858' },
]

interface Props {
  selected: number
  onSelect: (val: number) => void
}

export default function DurationBubbles({ selected, onSelect }: Props) {
  return (
    <div className="relative w-[310px] h-[235px] mx-auto">
      {BUBBLES.map(bubble => {
        const isActive = selected === bubble.value
        return (
          <motion.button
            key={bubble.value}
            className="absolute rounded-full flex flex-col items-center justify-center"
            style={{
              top: bubble.top,
              left: bubble.left,
              width: bubble.size,
              height: bubble.size,
              backgroundColor: isActive ? bubble.bgActive : bubble.bg,
              color: isActive ? bubble.textActive : bubble.text,
            }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            animate={{ scale: isActive ? 1.08 : 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            onClick={() => onSelect(bubble.value)}
          >
            <span className="text-2xl font-bold leading-none">{bubble.value}</span>
            <span className="text-xs mt-0.5 opacity-70 font-medium">mins</span>
          </motion.button>
        )
      })}
    </div>
  )
}
