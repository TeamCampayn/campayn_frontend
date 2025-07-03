"use client"

import React, { useState, useEffect, useRef } from "react"

// Types
interface WaitlistFormProps {
  title?: string
  subtitle?: string
  placeholder?: string
  buttonText?: {
    idle: string
    loading: string
    success: string
  }
  logo?: string
  theme?: "light" | "dark" | "system"
}

type FormState = "idle" | "loading" | "success" | "error"
type ActiveTab = "waitlist" | "manifesto"

// Mesh Gradient Background Component
const MeshGradient: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationId: number
    let time = 0

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const animate = () => {
      time += 0.005

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Create multiple gradient layers for mesh effect
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2

      // First gradient (blue to cyan)
      const gradient1 = ctx.createRadialGradient(
        centerX + Math.sin(time) * 200,
        centerY + Math.cos(time) * 150,
        0,
        centerX + Math.sin(time) * 200,
        centerY + Math.cos(time) * 150,
        Math.max(canvas.width, canvas.height) * 0.8,
      )
      gradient1.addColorStop(0, `rgba(0, 28, 128, ${0.4 + Math.sin(time) * 0.1})`)
      gradient1.addColorStop(1, `rgba(26, 199, 255, ${0.2 + Math.cos(time + 1) * 0.1})`)

      // Second gradient (cyan to green)
      const gradient2 = ctx.createRadialGradient(
        centerX + Math.sin(time + 2) * 250,
        centerY + Math.cos(time + 1.5) * 200,
        0,
        centerX + Math.sin(time + 2) * 250,
        centerY + Math.cos(time + 1.5) * 200,
        Math.max(canvas.width, canvas.height) * 0.6,
      )
      gradient2.addColorStop(0, `rgba(4, 255, 177, ${0.3 + Math.sin(time + 2) * 0.1})`)
      gradient2.addColorStop(1, `rgba(26, 199, 255, ${0.2 + Math.cos(time + 2) * 0.1})`)

      // Third gradient (pink/magenta)
      const gradient3 = ctx.createRadialGradient(
        centerX + Math.sin(time + 4) * 180,
        centerY + Math.cos(time + 3) * 160,
        0,
        centerX + Math.sin(time + 4) * 180,
        centerY + Math.cos(time + 3) * 160,
        Math.max(canvas.width, canvas.height) * 0.7,
      )
      gradient3.addColorStop(0, `rgba(255, 31, 241, ${0.3 + Math.sin(time + 3) * 0.1})`)
      gradient3.addColorStop(1, `rgba(0, 28, 128, ${0.2 + Math.cos(time + 3) * 0.1})`)

      // Apply gradients with blend modes
      ctx.globalCompositeOperation = "screen"

      ctx.fillStyle = gradient1
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = gradient2
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = gradient3
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      animationId = requestAnimationFrame(animate)
    }

    resize()
    animate()
    window.addEventListener("resize", resize)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener("resize", resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        background: "#001c80",
      }}
    />
  )
}

// GitHub Icon Component
const GitHubIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ display: "inline-block" }}>
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
)

// Theme Switcher Component
const ThemeSwitcher: React.FC<{ theme: "light" | "dark" | "system"; setTheme: (theme: "light" | "dark" | "system") => void }> = ({ theme, setTheme }) => {
  const options = ["dark", "system", "light"] as const

  return (
    <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
      {options.map((option, i) => (
        <React.Fragment key={option}>
          <button
            onClick={() => setTheme(option)}
            style={{
              fontSize: "12px",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: theme === option ? "rgb(28, 32, 36)" : "rgb(139, 141, 152)",
              fontWeight: theme === option ? "500" : "300",
              textTransform: "capitalize",
            }}
          >
            {option}
          </button>
          {i < options.length - 1 && <span style={{ fontSize: "12px", color: "rgb(176, 180, 186)" }}>/</span>}
        </React.Fragment>
      ))}
    </div>
  )
}

// Loading Spinner Component
const LoadingSpinner: React.FC = () => (
  <div
    style={{
      width: "16px",
      height: "16px",
      border: "2px solid currentColor",
      borderTop: "2px solid transparent",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
    }}
  />
)

// Tab Navigation Component
const TabNavigation: React.FC<{ activeTab: ActiveTab; setActiveTab: (tab: ActiveTab) => void }> = ({
  activeTab,
  setActiveTab,
}) => {
  return (
    <div style={{ display: "flex", gap: "2px", marginBottom: "24px" }}>
      <button
        onClick={() => setActiveTab("waitlist")}
        style={{
          padding: "8px 16px",
          fontSize: "14px",
          fontWeight: "500",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          backgroundColor: activeTab === "waitlist" ? "rgba(var(--gray-12), 0.1)" : "transparent",
          color: activeTab === "waitlist" ? "rgb(var(--slate-12))" : "rgb(var(--slate-10))",
          transition: "all 0.2s ease",
        }}
      >
        Waitlist
      </button>
      <button
        onClick={() => setActiveTab("manifesto")}
        style={{
          padding: "8px 16px",
          fontSize: "14px",
          fontWeight: "500",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          backgroundColor: activeTab === "manifesto" ? "rgba(var(--gray-12), 0.1)" : "transparent",
          color: activeTab === "manifesto" ? "rgb(var(--slate-12))" : "rgb(var(--slate-10))",
          transition: "all 0.2s ease",
        }}
      >
        Manifesto
      </button>
    </div>
  )
}

// Manifesto Content Component
const ManifestoContent: React.FC = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", textAlign: "left" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <h2
          style={{
            fontSize: "20px",
            fontWeight: "600",
            color: "rgb(var(--slate-12))",
            margin: 0,
            textAlign: "center",
          }}
        >
          Our Manifesto
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <p
            style={{
              color: "rgb(var(--slate-11))",
              margin: 0,
              fontSize: "15px",
              lineHeight: "1.6",
            }}
          >
            We believe in empowering creators to build authentic connections with brands. In a world of generic influencer marketing, we champion genuine partnerships that resonate with real audiences.
          </p>

          <p
            style={{
              color: "rgb(var(--slate-11))",
              margin: 0,
              fontSize: "15px",
              lineHeight: "1.6",
            }}
          >
            Our mission is to revolutionize creator-brand collaborations. We're not just another influencer platform; we're building the future of authentic content creation, one meaningful partnership at a time.
          </p>

          <div
            style={{
              backgroundColor: "rgba(var(--gray-12), 0.05)",
              padding: "16px",
              borderRadius: "12px",
              borderLeft: "3px solid rgb(var(--slate-9))",
            }}
          >
            <p
              style={{
                color: "rgb(var(--slate-12))",
                margin: 0,
                fontSize: "14px",
                fontStyle: "italic",
                lineHeight: "1.5",
              }}
            >
              "Every creator deserves fair compensation and creative freedom. Every brand deserves authentic representation. This is the foundation of everything we build."
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <h3
              style={{
                fontSize: "16px",
                fontWeight: "600",
                color: "rgb(var(--slate-12))",
                margin: 0,
              }}
            >
              What We Stand For:
            </h3>

            <ul
              style={{
                margin: 0,
                paddingLeft: "20px",
                color: "rgb(var(--slate-11))",
                fontSize: "14px",
                lineHeight: "1.6",
              }}
            >
              <li style={{ marginBottom: "8px" }}>
                <strong>Creator First:</strong> Your creative vision and fair compensation come first
              </li>
              <li style={{ marginBottom: "8px" }}>
                <strong>Authentic Partnerships:</strong> Meaningful brand collaborations, not just transactions
              </li>
              <li style={{ marginBottom: "8px" }}>
                <strong>Transparent Process:</strong> Clear communication and fair terms for everyone
              </li>
              <li style={{ marginBottom: "8px" }}>
                <strong>Community Growth:</strong> Supporting creators in building sustainable careers
              </li>
            </ul>
          </div>

          <p
            style={{
              color: "rgb(var(--slate-11))",
              margin: 0,
              fontSize: "15px",
              lineHeight: "1.6",
            }}
          >
            Join our creator community today. Together, we'll build something extraordinary—authentic content that connects, partnerships that matter, and a platform that truly serves creators.
          </p>
        </div>
      </div>
    </div>
  )
}

// Main Waitlist Component
const WaitlistComponent: React.FC<WaitlistFormProps> = ({
  title = "Join our waitlist",
  subtitle = "Be the first to know when we launch something extraordinary. We're building the future of digital experiences, and we want you to be part of it from day one.",
  placeholder = "Enter your email",
  buttonText = {
    idle: "Join",
    loading: "Joining...",
    success: "Joined!",
  },
  logo,
  theme: initialTheme = "system",
}) => {
  const [email, setEmail] = useState("")
  const [state, setState] = useState<FormState>("idle")
  const [error, setError] = useState<string>()
  const [theme, setTheme] = useState(initialTheme)
  const [activeTab, setActiveTab] = useState<ActiveTab>("waitlist")
  const errorTimeout = useRef<NodeJS.Timeout | null>(null)

  // Handle system theme
  useEffect(() => {
    const updateTheme = () => {
      if (theme === "system") {
        const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches
        document.documentElement.className = isDark ? "dark" : "light"
      } else {
        document.documentElement.className = theme
      }
    }

    updateTheme()

    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
      mediaQuery.addEventListener("change", updateTheme)
      return () => mediaQuery.removeEventListener("change", updateTheme)
    }
  }, [theme])

  // Auto-reset success state
  useEffect(() => {
    if (state === "success") {
      const resetTimeout = setTimeout(() => {
        setState("idle")
        setEmail("")
      }, 2000)
      return () => clearTimeout(resetTimeout)
    }
  }, [state])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (state === "success" || state === "loading") return

    if (errorTimeout.current) {
      clearTimeout(errorTimeout.current)
      setError(undefined)
      setState("idle")
    }

    if (!email.trim()) {
      setState("error")
      setError("Please enter your email")
      errorTimeout.current = setTimeout(() => {
        setError(undefined)
        setState("idle")
      }, 3000)
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setState("error")
      setError("Please enter a valid email")
      errorTimeout.current = setTimeout(() => {
        setError(undefined)
        setState("idle")
      }, 3000)
      return
    }

    // UI demo - just show loading then success
    setState("loading")
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setState("success")
  }

  return (
    <section style={{ position: "relative", overflow: "hidden" }}>
      <MeshGradient />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px 20px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "600px",
            backgroundColor: "rgba(var(--gray-1), 0.85)",
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow:
              "0px 170px 48px 0px rgba(18, 18, 19, 0.00), 0px 109px 44px 0px rgba(18, 18, 19, 0.01), 0px 61px 37px 0px rgba(18, 18, 19, 0.05), 0px 27px 27px 0px rgba(18, 18, 19, 0.09), 0px 7px 15px 0px rgba(18, 18, 19, 0.10)",
          }}
        >
          {/* Main Content */}
          <div
            style={{
              padding: "32px",
              paddingBottom: "16px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "16px",
              textAlign: "center",
            }}
          >
            {/* Logo */}
            {logo && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  width: "128px",
                  height: "auto",
                  marginBottom: "16px",
                }}
              >
                <img
                  src={logo || "/placeholder.svg"}
                  alt="Logo"
                  style={{
                    maxWidth: "100%",
                    height: "auto",
                    objectFit: "contain",
                  }}
                />
              </div>
            )}

            {/* Tab Navigation */}
            <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* Content */}
            <div style={{ display: "flex", flexDirection: "column", gap: "32px", width: "100%" }}>
              {activeTab === "waitlist" ? (
                <>
                  {/* Heading */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <h1
                      style={{
                        fontSize: "28px",
                        fontWeight: "600",
                        color: "rgb(var(--slate-12))",
                        margin: 0,
                        lineHeight: "1.2",
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {title}
                    </h1>
                    <p
                      style={{
                        color: "rgb(var(--slate-10))",
                        margin: 0,
                        fontSize: "16px",
                        lineHeight: "1.6",
                        letterSpacing: "-0.01em",
                        maxWidth: "480px",
                        marginLeft: "auto",
                        marginRight: "auto",
                      }}
                    >
                      {subtitle}
                    </p>
                  </div>

                  {/* Form */}
                  <div style={{ padding: "0 4px", width: "100%" }}>
                    <form
                      onSubmit={handleSubmit}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                        width: "100%",
                        position: "relative",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          position: "relative",
                        }}
                      >
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder={placeholder}
                          disabled={state === "loading"}
                          style={{
                            flex: 1,
                            fontSize: "14px",
                            paddingLeft: "16px",
                            paddingRight: "112px",
                            paddingTop: "8px",
                            paddingBottom: "8px",
                            height: "44px",
                            backgroundColor: "rgba(var(--gray-11), 0.05)",
                            borderRadius: "22px",
                            color: "rgb(var(--gray-12))",
                            border: "1px solid rgba(var(--gray-11), 0.1)",
                            outline: "none",
                            transition: "all 0.2s ease",
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = "rgba(var(--gray-11), 0.2)"
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = "rgba(var(--gray-11), 0.1)"
                          }}
                        />
                        <button
                          type="submit"
                          disabled={state === "loading"}
                          style={{
                            position: "absolute",
                            height: "32px",
                            paddingLeft: "14px",
                            paddingRight: "14px",
                            backgroundColor: "rgb(var(--gray-12))",
                            color: "rgb(var(--gray-1))",
                            fontSize: "14px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            right: "6px",
                            borderRadius: "16px",
                            fontWeight: "500",
                            display: "flex",
                            gap: "4px",
                            alignItems: "center",
                            border: "none",
                            cursor: state === "loading" ? "not-allowed" : "pointer",
                            opacity: state === "loading" ? 0.7 : 1,
                            transition: "all 0.2s ease",
                          }}
                        >
                          {state === "loading" ? (
                            <>
                              {buttonText.loading}
                              <LoadingSpinner />
                            </>
                          ) : state === "success" ? (
                            buttonText.success
                          ) : (
                            buttonText.idle
                          )}
                        </button>
                      </div>

                      <div style={{ width: "100%", height: "8px" }} />

                      {error && (
                        <p
                          style={{
                            position: "absolute",
                            fontSize: "12px",
                            color: "#ff0000",
                            top: "100%",
                            transform: "translateY(-50%)",
                            paddingLeft: "8px",
                            margin: 0,
                          }}
                        >
                          {error}
                        </p>
                      )}
                    </form>
                  </div>
                </>
              ) : (
                <ManifestoContent />
              )}
            </div>
          </div>

          {/* Footer */}
          <footer
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              padding: "12px 32px",
              fontSize: "14px",
              backgroundColor: "rgba(var(--gray-12), 0.07)",
              overflow: "hidden",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <p
                style={{
                  fontSize: "12px",
                  color: "rgb(var(--slate-10))",
                  margin: 0,
                }}
              >
                © 2025 Your Company. All rights reserved.
              </p>
              <a
                href="https://github.com/moazamtech"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  color: "rgb(var(--slate-10))",
                  textDecoration: "none",
                  fontSize: "12px",
                  transition: "color 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "rgb(var(--slate-12))"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "rgb(var(--slate-10))"
                }}
              >
                <GitHubIcon />
                moazamtech
              </a>
            </div>
            <ThemeSwitcher theme={theme} setTheme={setTheme} />
          </footer>
        </div>
      </div>
    </section>
  )
}

export default WaitlistComponent