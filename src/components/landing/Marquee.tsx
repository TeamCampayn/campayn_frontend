import { Sparkle } from 'lucide-react'

const ITEMS = [
  'Influencer Marketing',
  'Commercial Video Production',
  'Influencer Management',
  'Paid Media',
  'Model Management',
]

export function Marquee() {
  const row = [...ITEMS, ...ITEMS]
  return (
    <section className="px-3 py-4 md:px-4">
      <div className="marquee-mask overflow-hidden rounded-full bg-ink py-5 text-ink-foreground">
        <div className="animate-marquee flex w-max items-center gap-8 whitespace-nowrap">
          {row.map((item, i) => (
            <div key={i} className="flex items-center gap-8">
              <span className="text-lg font-semibold uppercase tracking-wide md:text-2xl font-space">
                {item}
              </span>
              <Sparkle className="size-5 fill-accent text-accent animate-spin" style={{ animationDuration: '6s' }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
