import { LineReveal, Reveal, Stagger, StaggerItem } from './motion-primitives'

const TEAM = [
  { name: 'Jane Cooper', role: 'Campaign Manager', img: '/images/team-1.png' },
  { name: 'Robert Fox', role: 'Head of Campaigns', img: '/images/team-2.png' },
  { name: 'Jacob Jones', role: 'Head of Global Talent', img: '/images/team-3.png' },
  { name: 'Jenny Wilson', role: 'Team Lead, LATAM', img: '/images/team-4.png' },
]

export function Team() {
  return (
    <section className="px-3 py-4 md:px-4">
      <div className="grain rounded-[2rem] bg-panel px-5 py-14 md:px-12 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <h2 className="font-display text-4xl md:text-6xl">
              <LineReveal>Our Team</LineReveal>
            </h2>
            <Reveal delay={0.12}>
              <p className="mt-5 text-foreground/70">
                We like to work with people who understand the importance of
                good communication, for brands that have good things to show and
                believe in what they&apos;re doing.
              </p>
            </Reveal>
          </div>

          <Stagger className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TEAM.map((m) => (
              <StaggerItem key={m.name}>
                <div className="group overflow-hidden rounded-[1.5rem] border border-foreground/10 bg-card">
                  <div className="overflow-hidden">
                    <img
                      src={m.img || '/placeholder.svg'}
                      alt={m.name}
                      className="aspect-square w-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <p className="text-lg font-semibold">{m.name}</p>
                    <p className="text-sm text-foreground/60">{m.role}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  )
}
