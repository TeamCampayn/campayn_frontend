"use client"

import * as React from "react"
import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, ArrowRight } from "lucide-react"

const TESTIMONIALS = [
  {
    id: "testimonial-1",
    name: "Manasi Sawant",
    profession: "CMO, Wow Skin Science",
    description:
      "Campayn transformed our creator marketing strategy. The AI matching connected us with perfect micro-influencers who drove 300% higher engagement than traditional campaigns.",
    rating: 5,
    companyLogo: "/company-logos/wow-skin-science.png",
    logoBg: "#fef08a",
  },
  {
    id: "testimonial-2",
    name: "Harsh Jha",
    profession: "Co-Founder, Flabs",
    description:
      "The local reach feature helped us tap into Tier 2 cities we never could access before. Our sales increased by 150% in just 3 months using Campayn's creator network.",
    rating: 4.5,
    companyLogo: "/company-logos/flabs.png",
    logoBg: "#e0f2fe",
  },
  {
    id: "testimonial-3",
    name: "Shivendra Sharma",
    profession: "Founder, JASTRO",
    description:
      "Finally, a platform that understands the Indian market! The ROI tracking and authentic creator partnerships have made our campaigns 5x more effective than agency work.",
    rating: 5,
    companyLogo: "/company-logos/jastro.png",
    logoBg: "#dcfce7",
  },
  {
    id: "testimonial-4",
    name: "Vinaya T",
    profession: "Founder, Glodemi",
    description:
      "Campayn's trust system and verified creator network gave us confidence in every partnership. Our brand safety improved while reaching 10x more potential customers.",
    rating: 4.5,
    companyLogo: "/company-logos/glodemi.png",
    logoBg: "#fce7f3",
  },
]

const len = TESTIMONIALS.length
const wrap = (i: number) => ((i % len) + len) % len

/* Positions: -1 = left, 0 = center, 1 = right, everything else = hidden offscreen */
const bubbleVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 160 : -160,
    scale: 0.5,
    opacity: 0,
  }),
  left: {
    x: -100,
    scale: 0.55,
    opacity: 0.7,
    zIndex: 1,
    transition: { type: "spring", stiffness: 350, damping: 35, mass: 0.8 },
  },
  center: {
    x: 0,
    scale: 1,
    opacity: 1,
    zIndex: 3,
    transition: { type: "spring", stiffness: 350, damping: 35, mass: 0.8 },
  },
  right: {
    x: 100,
    scale: 0.55,
    opacity: 0.7,
    zIndex: 1,
    transition: { type: "spring", stiffness: 350, damping: 35, mass: 0.8 },
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -160 : 160,
    scale: 0.5,
    opacity: 0,
    zIndex: 0,
    transition: { type: "spring", stiffness: 350, damping: 35, mass: 0.8 },
  }),
}

/* Size classes per position */
const sizeClasses: Record<string, string> = {
  left: "w-14 h-14 sm:w-[4.5rem] sm:h-[4.5rem] p-2.5 border cursor-pointer",
  center: "w-28 h-28 sm:w-36 sm:h-36 p-4 sm:p-5 border-2 shadow-lg",
  right: "w-14 h-14 sm:w-[4.5rem] sm:h-[4.5rem] p-2.5 border cursor-pointer",
}

export const TestimonialsSection: React.FC = () => {
  const [index, setIndex] = useState(0)
  const dirRef = useRef(1) // 1 = going right, -1 = going left

  const handleNext = () => {
    dirRef.current = 1
    setIndex((prev) => wrap(prev + 1))
  }
  const handlePrev = () => {
    dirRef.current = -1
    setIndex((prev) => wrap(prev - 1))
  }

  const leftIdx = wrap(index - 1)
  const rightIdx = wrap(index + 1)
  const current = TESTIMONIALS[index]

  /* The 3 visible slots keyed by their actual testimonial id */
  const visibleSlots = [
    { idx: leftIdx, position: "left" as const },
    { idx: index, position: "center" as const },
    { idx: rightIdx, position: "right" as const },
  ]

  return (
    <section className="px-3 py-4 md:px-4">
      <div className="grain rounded-[2rem] bg-panel px-5 py-16 md:px-12 md:py-24 border border-foreground/10">
        <div className="mx-auto flex flex-col items-center">

          {/* ─── Brand-logo carousel ─── */}
          <div className="relative flex items-center justify-center mb-6 h-36 sm:h-40 w-full max-w-xs sm:max-w-sm">
            <AnimatePresence initial={false} custom={dirRef.current} mode="popLayout">
              {visibleSlots.map(({ idx, position }) => {
                const t = TESTIMONIALS[idx]
                return (
                  <motion.div
                    key={t.id}
                    custom={dirRef.current}
                    variants={bubbleVariants}
                    initial="enter"
                    animate={position}
                    exit="exit"
                    className={`absolute rounded-full overflow-hidden border-foreground/15 flex items-center justify-center shrink-0 ${sizeClasses[position]}`}
                    style={{ backgroundColor: t.logoBg }}
                    onClick={
                      position === "left"
                        ? handlePrev
                        : position === "right"
                        ? handleNext
                        : undefined
                    }
                    whileHover={
                      position !== "center"
                        ? { scale: 0.62, transition: { duration: 0.2 } }
                        : undefined
                    }
                  >
                    <img
                      src={t.companyLogo}
                      alt={t.name}
                      className="max-w-full max-h-full object-contain"
                      draggable={false}
                    />
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>

          {/* ─── Navigation & identity ─── */}
          <div className="flex items-center justify-center gap-6 sm:gap-12 w-full max-w-lg mt-4">
            <button
              onClick={handlePrev}
              className="w-10 h-10 rounded-full border border-foreground/30 flex items-center justify-center bg-card text-foreground hover:bg-foreground hover:text-background transition-colors shrink-0"
              aria-label="Previous testimonial"
            >
              <ArrowLeft className="size-4" />
            </button>

            <div className="text-center min-w-[150px] sm:min-w-[200px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <h3 className="font-display text-lg sm:text-xl font-bold tracking-tight text-foreground">
                    {current.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-foreground/60 mt-0.5">
                    {current.profession}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            <button
              onClick={handleNext}
              className="w-10 h-10 rounded-full border border-foreground/30 flex items-center justify-center bg-card text-foreground hover:bg-foreground hover:text-background transition-colors shrink-0"
              aria-label="Next testimonial"
            >
              <ArrowRight className="size-4" />
            </button>
          </div>

          {/* ─── Quote ─── */}
          <div className="mt-8 text-center max-w-4xl px-2">
            <AnimatePresence mode="wait">
              <motion.p
                key={current.id}
                className="font-display text-xl sm:text-2xl md:text-4xl text-foreground leading-snug tracking-tight"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
              >
                &ldquo;{current.description}&rdquo;
              </motion.p>
            </AnimatePresence>
          </div>

          {/* ─── Dot indicators ─── */}
          <div className="flex items-center gap-2 mt-8">
            {TESTIMONIALS.map((t, i) => (
              <button
                key={t.id}
                onClick={() => {
                  dirRef.current = i > index ? 1 : -1
                  setIndex(i)
                }}
                className={`rounded-full transition-all duration-300 ${
                  i === index
                    ? "w-8 h-2.5 bg-blue"
                    : "w-2.5 h-2.5 bg-foreground/20 hover:bg-foreground/40"
                }`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
