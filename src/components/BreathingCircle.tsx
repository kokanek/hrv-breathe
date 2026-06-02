import { motion } from 'framer-motion'
import type { Phase } from '../hooks/useBreathingCycle'

interface Props {
  phase: Phase
  isRunning: boolean
  isLoginPage?: boolean
}

export default function BreathingCircle({ phase, isRunning, isLoginPage }: Props) {
  const ease = [0.4, 0, 0.2, 1] as [number, number, number, number]

  const variants = {
    inhale: { scale: 1.45, transition: { duration: 6, ease } },
    exhale: { scale: 1,    transition: { duration: 6, ease } },
    idle:   { scale: 1,    transition: { duration: 0.5 } },
  }

  const ringVariants = {
    inhale: { scale: 1.55, opacity: 0.5, transition: { duration: 6, ease } },
    exhale: { scale: 1.05, opacity: 0.2, transition: { duration: 6, ease } },
    idle:   { scale: 1.05, opacity: 0.2, transition: { duration: 0.5 } },
  }

  const outerRingVariants = {
    inhale: { scale: 1.75, opacity: 0.3, transition: { duration: 6, ease, delay: 0.08 } },
    exhale: { scale: 1.1,  opacity: 0.1, transition: { duration: 6, ease, delay: 0.08 } },
    idle:   { scale: 1.1,  opacity: 0.1, transition: { duration: 0.5 } },
  }

  const currentState = isRunning ? phase : 'idle'

  return (
    <div className="relative flex items-center justify-center w-72 h-72">
      <motion.div
        className="absolute w-72 h-72 rounded-full"
        style={{ border: '1.5px solid rgba(100,180,160,0.25)', backgroundColor: 'rgba(168,208,212,0.12)' }}
        variants={outerRingVariants}
        animate={currentState}
        initial="idle"
      />

      <motion.div
        className="absolute w-60 h-60 rounded-full"
        style={{ border: '1.5px solid rgba(100,180,160,0.3)', backgroundColor: 'rgba(168,208,212,0.15)' }}
        variants={ringVariants}
        animate={currentState}
        initial="idle"
      />

      <motion.div
        className="relative w-44 h-44 rounded-full bg-white flex items-center justify-center"
        style={{
          boxShadow: '0 8px 40px rgba(100,180,160,0.18), 0 2px 12px rgba(0,0,0,0.06)',
          animation: isRunning ? 'breatheGlow 6s ease-in-out infinite' : 'none',
        }}
        variants={variants}
        animate={currentState}
        initial="idle"
      >
        {!isLoginPage && <span className="text-gray-700 text-xl font-semibold tracking-[0.18em] uppercase select-none">
          {isRunning ? (phase === 'inhale' ? 'Inhale' : 'Exhale') : 'Ready'}
        </span>}
      </motion.div>
    </div>
  )
}
