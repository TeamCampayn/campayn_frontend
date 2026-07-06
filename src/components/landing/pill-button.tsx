'use client'

import { ArrowUpRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '../../lib/utils'

type Variant = 'accent' | 'ink' | 'outline'

export function PillButton({
  children,
  variant = 'accent',
  href = '#',
  className,
  icon = true,
}: {
  children: ReactNode
  variant?: Variant
  href?: string
  className?: string
  icon?: boolean
}) {
  const styles: Record<Variant, string> = {
    accent:
      'bg-accent text-accent-foreground border border-foreground/85 hover:bg-blue hover:text-ink-foreground',
    ink: 'bg-ink text-ink-foreground border border-ink hover:bg-blue hover:text-ink-foreground',
    outline:
      'bg-transparent text-foreground border border-foreground/25 hover:bg-ink hover:text-ink-foreground hover:border-ink',
  }
  return (
    <a
      href={href}
      className={cn(
        'group inline-flex items-center gap-2 rounded-full px-6 py-3 text-xs font-semibold uppercase tracking-wider transition-colors duration-300',
        styles[variant],
        className,
      )}
    >
      {children}
      {icon && (
        <span className="grid size-6 place-items-center rounded-full bg-foreground/10 transition-transform duration-300 group-hover:rotate-45 group-hover:bg-foreground/20">
          <ArrowUpRight className="size-3.5" />
        </span>
      )}
    </a>
  )
}
