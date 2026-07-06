import { Sparkle, Instagram, Linkedin, Youtube } from 'lucide-react'
import { Link } from 'react-router-dom'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="px-3 pb-4 pt-2 md:px-4">
      <div className="grain rounded-[2rem] bg-zinc-950 px-6 py-8 md:px-12 md:py-10 border border-zinc-800/80 shadow-xl relative overflow-hidden">
        {/* Subtle grid accent background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        <div className="mx-auto max-w-6xl relative z-10">
          <div className="grid gap-8 md:grid-cols-[1.5fr_1fr] md:items-start md:justify-between">
            {/* Left Brand Area */}
            <div className="max-w-md">
              <div className="flex items-center gap-2">
                <span className="font-display text-2xl font-bold text-white tracking-tight">Campayn <span className="text-[#d2fc15] font-light"></span></span>
                <Sparkle className="size-5 fill-[#d2fc15] text-[#d2fc15]" />
              </div>
              <p className="mt-2 text-zinc-400 text-sm leading-relaxed">
                Subscribe to our newsletter.
              </p>

              <a
                href="mailto:contact@campayn.in"
                className="mt-2 font-heading text-base font-bold text-white hover:text-[#d2fc15] transition-colors block"
              >
                contact@campayn.in
              </a>

              {/* Lime/Volt Circular Social Buttons */}
              <div className="flex gap-2.5 mt-5">
                {[
                  { icon: Instagram, href: 'https://instagram.com/campayn', label: 'Instagram' },
                  { icon: Youtube, href: 'https://youtube.com', label: 'YouTube' },
                  { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
                ].map((s, i) => {
                  const Icon = s.icon;
                  return (
                    <a
                      key={i}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      className="grid size-10 place-items-center rounded-full bg-[#d2fc15] text-black transition-all hover:bg-white hover:scale-105 duration-200 shadow-sm"
                    >
                      <Icon className="size-4.5" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Right Nav Links Area */}
            <div className="flex flex-col md:items-end justify-between h-full min-h-[100px] md:mt-2">
              {/* Primary Links with dividers */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm font-semibold uppercase tracking-wider text-zinc-400">
                <Link to="/" className="hover:text-white transition-colors">Home</Link>
                <span className="text-zinc-800">|</span>
                <Link to="/about" className="hover:text-white transition-colors">About Us</Link>
                <span className="text-zinc-800">|</span>
                <Link to="/creators" className="hover:text-white transition-colors">Creators</Link>
                <span className="text-zinc-800">|</span>
                <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
              </div>

              {/* Legal Sublinks */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-zinc-500 mt-4 md:mt-0 md:justify-end">
                <Link to="/terms" className="hover:text-zinc-300 transition-colors">Terms & Conditions</Link>
                <span className="text-zinc-800">•</span>
                <Link to="/privacy" className="hover:text-zinc-300 transition-colors">Privacy Policy</Link>
                <span className="text-zinc-800">•</span>
                <Link to="/shipping" className="hover:text-zinc-300 transition-colors">Shipping Policy</Link>
                <span className="text-zinc-800">•</span>
                <Link to="/refunds" className="hover:text-zinc-300 transition-colors">Refund Policy</Link>
                <span className="text-zinc-800">•</span>
                <Link to="/data-deletion" className="hover:text-zinc-300 transition-colors">Data Deletion</Link>
              </div>
            </div>
          </div>

          {/* Bottom Copyright */}
          <div className="mt-8 border-t border-zinc-900 pt-5 text-xs text-zinc-500 flex flex-col sm:flex-row sm:justify-between gap-4">
            <div>
              ©{currentYear} Campayn. All rights reserved.
            </div>
            <div>
              Crafted with <span className="text-[#d2fc15]">♥</span> by Campayn Team.
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
