'use client'

import { motion } from 'framer-motion'

const BRANDS = [
  'WOW Skin Science',
  'Flabs',
  'JASTRO',
  'Glodemi',
]

export function Brands() {
  return (
    <section className="px-3 py-4 md:px-4">
      <div className="grain rounded-[2rem] bg-panel px-5 py-14 md:px-12 md:py-16 border border-foreground/10">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1fr_1.4fr] md:items-center">
          
          {/* Heading with smooth reveal animation triggered on mount */}
          <h2 className="font-display text-4xl md:text-5xl !leading-[1.15] text-zinc-900">
            <span className="block overflow-hidden py-1">
              <motion.span
                className="block"
                initial={{ y: '110%' }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                50+ Brands
              </motion.span>
            </span>
            <span className="block overflow-hidden py-1">
              <motion.span
                className="block text-blue"
                initial={{ y: '110%' }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              >
                have worked with us.
              </motion.span>
            </span>
          </h2>

          {/* Staggered brand card entries on mount */}
          <motion.div 
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.08 } }
            }}
            className="grid grid-cols-2 gap-4 sm:grid-cols-4"
          >
            {BRANDS.map((b) => (
              <motion.div
                key={b}
                variants={{
                  hidden: { opacity: 0, y: 15 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
                }}
                className="grid h-20 place-items-center rounded-2xl border border-zinc-200/80 bg-white font-heading text-sm sm:text-base md:text-lg font-bold text-zinc-800 text-center px-3 leading-snug transition-all duration-300 hover:scale-[1.03] hover:shadow-sm hover:border-zinc-300 hover:text-zinc-950"
              >
                {b}
              </motion.div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  )
}
