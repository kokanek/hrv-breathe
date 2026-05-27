import { motion } from 'framer-motion'
import type { Phase } from '../hooks/useBreathingCycle'

interface Props {
  phase: Phase
  isRunning: boolean
}

export default function BreathingCircle({ phase, isRunning }: Props) {
  const variants = {
    inhale: {
      scale: 1.5,
      transition: { duration: 6, ease: [0.4, 0, 0.2, 1] },
    },
    exhale: {
      scale: 1,
      transition: { duration: 6, ease: [0.4, 0, 0.2, 1] },
    },
    idle: {
      scale: 1,
      transition: { duration: 0.5 },
    },
  }

  const ringVariants = {
    inhale: {
      scale: 1.6,
      opacity: 0.3,
      transition: { duration: 6, ease: [0.4, 0, 0.2, 1] },
    },
    exhale: {
      scale: 1.1,
      opacity: 0.1,
      transition: { duration: 6, ease: [0.4, 0, 0.2, 1] },
    },
    idle: {
      scale: 1.1,
      opacity: 0.1,
      transition: { duration: 0.5 },
    },
  }

  const outerRingVariants = {
    inhale: {
      scale: 1.8,
      opacity: 0.15,
      transition: { duration: 6, ease: [0.4, 0, 0.2, 1], delay: 0.1 },
    },
    exhale: {
      scale: 1.2,
      opacity: 0.05,
      transition: { duration: 6, ease: [0.4, 0, 0.2, 1], delay: 0.1 },
    },
    idle: {
      scale: 1.2,
      opacity: 0.05,
      transition: { duration: 0.5 },
    },
  }

  const currentState = isRunning ? phase : 'idle'

  return (
    <div className="relative flex items-center justify-center w-72 h-72">
      <motion.div
        className="absolute w-72 h-72 rounded-full bg-white/10"
        variants={outerRingVariants}
        animate={currentState}
        initial="idle"
      />

      <motion.div
        className="absolute w-60 h-60 rounded-full bg-white/15"
        variants={ringVariants}
        animate={currentState}
        initial="idle"
      />

      <motion.div
        className="relative w-44 h-44 rounded-full bg-white/25 backdrop-blur-md border border-white/30 flex items-center justify-center"
        style={{ animation: isRunning ? 'breatheGlow 6s ease-in-out infinite' : 'none' }}
        variants={variants}
        animate={currentState}
        initial="idle"
      >
        <span className="text-white text-xl font-semibold tracking-[0.2em] uppercase select-none">
          {isRunning ? (phase === 'inhale' ? 'Inhale' : 'Exhale') : 'Ready'}
        </span>
      </motion.div>
    </div>
  )
}
