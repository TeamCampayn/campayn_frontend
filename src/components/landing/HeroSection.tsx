'use client'

import { motion } from 'framer-motion'
import { ArrowDown } from 'lucide-react'
import { LineReveal, Reveal } from './motion-primitives'
import { PillButton } from './pill-button'

export const HeroSection = () => {
  return (
    <section className="px-3 pt-24 md:px-4">
      <div className="grain relative overflow-hidden rounded-[2rem] bg-panel px-5 pb-16 pt-14 md:px-12 md:pb-24 md:pt-20">
        <div className="mx-auto max-w-6xl">
          <h1 className="font-display text-[10vw] sm:text-[9vw] md:text-[6.5rem] leading-[0.92]">
            <LineReveal mount>YOUR BRAND DESERVES</LineReveal>
            <LineReveal mount delay={0.08}>
              BETTER THAN AN AGENCY.
            </LineReveal>
            <div className="flex items-center gap-4 flex-wrap md:flex-nowrap">
              <ScrollToggle />
              <LineReveal mount delay={0.16} className="text-blue">
                IT DESERVES CAMPAYN
              </LineReveal>
            </div>
          </h1>

          <div className="mt-12 flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
            <Reveal mount delay={0.2} className="max-w-xl">
              <PillButton variant="accent" icon={false} href="/auth" className="mb-6">
                Get a free strategy call
              </PillButton>
              <p className="text-base leading-relaxed text-foreground/70 md:text-lg">
                We connect brands with the right creators — on Instagram,
                YouTube, TikTok, and Twitch. Strategy, execution, and reporting
                included.
              </p>
            </Reveal>

            <Reveal mount delay={0.28}>
              <img
                src="/images/object-stack.png"
                alt="Campayn 3D brand mark"
                className="w-28 h-28 object-contain md:w-40 md:h-40"
              />
            </Reveal>
          </div>
        </div>

        {/* Scroll-for-details capsule, top right */}
        <Reveal
          mount
          delay={0.3}
          className="pointer-events-none absolute right-6 top-24 hidden md:block"
        >
          <div className="flex items-center gap-3 rounded-full border border-foreground/80 bg-card px-5 py-3">
            <span className="text-sm font-medium">Scroll for details</span>
            <motion.span
              className="grid size-9 place-items-center rounded-full bg-ink text-ink-foreground"
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ArrowDown className="size-4" />
            </motion.span>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function ScrollToggle() {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.6 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.2, duration: 0.6 }}
      className="hidden h-[0.85em] w-[1.7em] shrink-0 items-center rounded-full border border-foreground/80 bg-card p-[0.12em] md:inline-flex"
    >
      <motion.span
        className="grid size-[0.6em] place-items-center rounded-full bg-blue"
        animate={{ rotate: 360 }}
        transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
      >
        <span className="block size-[0.18em] rounded-full bg-card" />
      </motion.span>
    </motion.span>
  )
}
