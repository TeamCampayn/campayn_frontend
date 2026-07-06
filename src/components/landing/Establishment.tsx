import { LineReveal, Stagger, StaggerItem } from './motion-primitives'

const STATS = [
  { value: '50+', label: 'Customers' },
  { value: '150M+', label: 'Impressions' },
  { value: '100+', label: 'Successful Campaigns' },
  { value: '20', label: 'Long-term Customers' },
]

export function Establishment() {
  return (
    <section className="px-3 py-4 md:px-4">
      <div className="rounded-[2rem] bg-ink px-5 py-14 text-ink-foreground md:px-12 md:py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display max-w-3xl text-3xl md:text-5xl">
            <LineReveal>Since our establishment in</LineReveal>
            <LineReveal delay={0.08}>
              April 2021 we have{' '}
              <span className="text-accent">managed</span>
            </LineReveal>
          </h2>

          <Stagger className="mt-14 grid grid-cols-2 gap-8 md:grid-cols-4">
            {STATS.map((s) => (
              <StaggerItem key={s.label}>
                <p className="font-display text-5xl md:text-7xl">{s.value}</p>
                <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-ink-foreground/50 font-space">
                  {s.label}
                </p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  )
}
