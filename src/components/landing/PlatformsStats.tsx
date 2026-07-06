import { Crown, Eye } from 'lucide-react'
import { LineReveal, Reveal, Stagger, StaggerItem } from './motion-primitives'

const PLATFORMS = ['Instagram', 'YouTube', 'Twitch', 'TikTok']

const STATS = [
  {
    icon: Eye,
    value: '110M+',
    label: 'Total Views Generated',
    tint: 'bg-accent text-accent-foreground',
  },
  {
    icon: Crown,
    value: '2.5M+',
    label: 'Total Leads Generated',
    tint: 'bg-blue text-ink-foreground',
  },
]

export function PlatformsStats() {
  return (
    <section className="px-3 py-4 md:px-4">
      <div className="grain rounded-[2rem] bg-panel px-5 py-14 md:px-12 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 md:grid-cols-2 md:items-start">
            <div>
              <h2 className="font-display text-4xl md:text-5xl">
                <LineReveal>Platforms</LineReveal>
                <LineReveal delay={0.08}>We Work On</LineReveal>
              </h2>
              <Reveal delay={0.15} className="mt-6 flex flex-wrap gap-3">
                {PLATFORMS.map((p) => (
                  <span
                    key={p}
                    className="rounded-full border border-foreground/80 bg-card px-5 py-2 text-sm font-semibold tracking-wide transition-colors hover:bg-ink hover:text-ink-foreground font-space"
                  >
                    {p}
                  </span>
                ))}
              </Reveal>
              <Reveal delay={0.2}>
                <p className="mt-6 max-w-md text-foreground/70">
                  The platforms we have worked on and succeeded on, and the
                  achievements we have won for our partner brands.
                </p>
              </Reveal>
            </div>

            <Stagger className="grid gap-5 sm:grid-cols-2">
              {STATS.map((s) => {
                const IconComponent = s.icon;
                return (
                  <StaggerItem key={s.value}>
                    <div className="h-full rounded-[1.5rem] border border-foreground/80 bg-card p-6">
                      <span
                        className={`mb-16 grid size-12 place-items-center rounded-xl ${s.tint}`}
                      >
                        <IconComponent className="size-6" />
                      </span>
                      <p className="font-display text-5xl md:text-6xl">
                        {s.value}
                      </p>
                      <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-foreground/60 font-space">
                        {s.label}
                      </p>
                    </div>
                  </StaggerItem>
                );
              })}
            </Stagger>
          </div>
        </div>
      </div>
    </section>
  )
}
