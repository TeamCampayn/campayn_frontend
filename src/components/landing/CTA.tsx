import { ArrowUpRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { LineReveal, Reveal } from './motion-primitives'

export function CTA() {
  return (
    <section className="px-3 py-4 md:px-4">
      <div className="relative overflow-hidden rounded-[2rem] bg-[#030303] px-6 py-16 text-white md:px-12 md:py-24 border border-zinc-800/80">

        {/* Left Decorative Gold Circles (fading gradient) */}
        <svg
          className="absolute -left-16 -top-16 h-72 w-72 md:h-[28rem] md:w-[28rem] pointer-events-none select-none z-0"
          viewBox="0 0 400 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="0" cy="0" r="140" stroke="url(#gold-left)" strokeWidth="2.5" />
          <circle cx="0" cy="0" r="200" stroke="url(#gold-left)" strokeWidth="2" />
          <circle cx="0" cy="0" r="260" stroke="url(#gold-left)" strokeWidth="1.5" />
          <defs>
            <linearGradient id="gold-left" x1="0" y1="0" x2="300" y2="300" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FACC15" stopOpacity="0.9" />
              <stop offset="35%" stopColor="#EAB308" stopOpacity="0.6" />
              <stop offset="70%" stopColor="#A16207" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>

        {/* Right Decorative Gold Circles (fading gradient) */}
        <svg
          className="absolute -right-16 -bottom-16 h-72 w-72 md:h-[28rem] md:w-[28rem] pointer-events-none select-none z-0"
          viewBox="0 0 400 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="400" cy="400" r="140" stroke="url(#gold-right)" strokeWidth="2.5" />
          <circle cx="400" cy="400" r="200" stroke="url(#gold-right)" strokeWidth="2" />
          <circle cx="400" cy="400" r="260" stroke="url(#gold-right)" strokeWidth="1.5" />
          <defs>
            <linearGradient id="gold-right" x1="400" y1="400" x2="100" y2="100" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FACC15" stopOpacity="0.9" />
              <stop offset="35%" stopColor="#EAB308" stopOpacity="0.6" />
              <stop offset="70%" stopColor="#A16207" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>

        <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-start justify-between gap-10 md:flex-row md:items-center">
          <h2 className="font-sans font-bold text-white text-4xl sm:text-6xl md:text-[5rem] leading-[1.05] tracking-tight">
            <motion.span
              className="block text-white"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              Let&apos;s Make
            </motion.span>
            <motion.span
              className="block text-white"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              Your Product Viral
            </motion.span>
          </h2>

          <Reveal delay={0.15} className="max-w-md space-y-6">
            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed font-sans">
              Strengthen your brand&apos;s impact in the digital world with
              a professional team and original content. Join us for
              customized solutions.
            </p>
            <div>
              <a
                href="/auth"
                className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-[#0d0d0f] hover:bg-[#131316] hover:border-zinc-700 px-6 py-2.5 text-sm font-medium text-[#f4f4f5] transition-all"
              >
                Let&apos;s Talk
                <ArrowUpRight className="size-4 text-zinc-400" />
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}


