'use client'

import { motion, type Variants } from 'framer-motion'
import type { ReactNode } from 'react'

const easeOut = [0.16, 1, 0.3, 1] as const

export function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
  mount = false,
}: {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
  mount?: boolean
}) {
  const anim = mount
    ? { animate: { opacity: 1, y: 0 } }
    : {
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: '-80px' },
      }
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      {...anim}
      transition={{ duration: 0.8, delay, ease: easeOut }}
    >
      {children}
    </motion.div>
  )
}

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
}
const item: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: easeOut } },
}

export function Stagger({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <motion.div
      className={className}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <motion.div className={className} variants={item}>
      {children}
    </motion.div>
  )
}

/** Big display line that clips up on scroll, mimicking the Framer template. */
export function LineReveal({
  children,
  className,
  delay = 0,
  mount = false,
}: {
  children: ReactNode
  className?: string
  delay?: number
  mount?: boolean
}) {
  const anim = mount
    ? { animate: { y: '0%' } }
    : {
        whileInView: { y: '0%' },
        viewport: { once: true, margin: '-40px' },
      }
  return (
    <span className="block overflow-hidden">
      <motion.span
        className={className}
        style={{ display: 'block' }}
        initial={{ y: '110%' }}
        {...anim}
        transition={{ duration: 0.9, delay, ease: easeOut }}
      >
        {children}
      </motion.span>
    </span>
  )
}
