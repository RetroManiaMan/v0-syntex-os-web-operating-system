"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

interface ScreensaverProps {
  onExit: () => void
}

export default function Screensaver({ onExit }: ScreensaverProps) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; speed: number }>>(
    [],
  )

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    // Generate floating particles
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 4 + 2,
      speed: Math.random() * 2 + 1,
    }))
    setParticles(newParticles)
  }, [])

  const handleInteraction = () => {
    onExit()
  }

  return (
    <div
      className="fixed inset-0 z-[9998] bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 cursor-pointer"
      onClick={handleInteraction}
      onMouseMove={handleInteraction}
      onKeyDown={handleInteraction}
      tabIndex={0}
    >
      {/* Floating particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-white/20"
          style={{
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            x: [particle.x, particle.x + 100, particle.x - 100, particle.x],
            y: [particle.y, particle.y - 100, particle.y + 100, particle.y],
          }}
          transition={{
            duration: 20 + Math.random() * 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
      ))}

      {/* Time display */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white">
          <motion.div
            className="text-8xl font-thin mb-4"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
          >
            {currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </motion.div>
          <motion.div
            className="text-2xl opacity-60"
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
          >
            {currentTime.toLocaleDateString([], {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </motion.div>
        </div>
      </div>

      {/* Hint text */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white/50 text-center">
        <p>Move mouse or press any key to wake up</p>
      </div>
    </div>
  )
}
