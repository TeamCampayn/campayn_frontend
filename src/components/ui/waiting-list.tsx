
"use client"

import React, { useState, useEffect, useRef } from "react"
import { toast } from 'sonner';

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
      gradient1.addColorStop(0, `rgba(250, 204, 21, ${0.06 + Math.sin(time) * 0.03})`)
      gradient1.addColorStop(1, `rgba(161, 98, 7, ${0.02 + Math.cos(time + 1) * 0.01})`)

      // Second gradient (cyan to green)
      const gradient2 = ctx.createRadialGradient(
        centerX + Math.sin(time + 2) * 250,
        centerY + Math.cos(time + 1.5) * 200,
        0,
        centerX + Math.sin(time + 2) * 250,
        centerY + Math.cos(time + 1.5) * 200,
        Math.max(canvas.width, canvas.height) * 0.6,
      )
      gradient2.addColorStop(0, `rgba(210, 252, 21, ${0.04 + Math.sin(time + 2) * 0.02})`)
      gradient2.addColorStop(1, `rgba(100, 116, 20, ${0.02 + Math.cos(time + 2) * 0.01})`)

      // Third gradient (pink/magenta)
      const gradient3 = ctx.createRadialGradient(
        centerX + Math.sin(time + 4) * 180,
        centerY + Math.cos(time + 3) * 160,
        0,
        centerX + Math.sin(time + 4) * 180,
        centerY + Math.cos(time + 3) * 160,
        Math.max(canvas.width, canvas.height) * 0.7,
      )
      gradient3.addColorStop(0, `rgba(234, 179, 8, ${0.05 + Math.sin(time + 3) * 0.02})`)
      gradient3.addColorStop(1, `rgba(3, 3, 3, ${0.03 + Math.cos(time + 3) * 0.01})`)

      // Apply gradients with blend modes
      ctx.globalCompositeOperation = "source-over"

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
        background: "#030303",
      }}
    />
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
          backgroundColor: activeTab === "waitlist" ? "rgba(255, 255, 255, 0.1)" : "transparent",
          color: activeTab === "waitlist" ? "#e2e8f0" : "#94a3b8",
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
          backgroundColor: activeTab === "manifesto" ? "rgba(255, 255, 255, 0.1)" : "transparent",
          color: activeTab === "manifesto" ? "#e2e8f0" : "#94a3b8",
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
            color: "#e2e8f0",
            margin: 0,
            textAlign: "center",
          }}
        >
          Our Manifesto
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <p
            style={{
              color: "#cbd5e1",
              margin: 0,
              fontSize: "15px",
              lineHeight: "1.6",
            }}
          >
            We believe in empowering creators to build authentic connections with brands. In a world of generic influencer marketing, we champion genuine partnerships that resonate with real audiences.
          </p>

          <p
            style={{
              color: "#cbd5e1",
              margin: 0,
              fontSize: "15px",
              lineHeight: "1.6",
            }}
          >
            Our mission is to revolutionize creator-brand collaborations. We're not just another influencer platform; we're building the future of authentic content creation, one meaningful partnership at a time.
          </p>

          <div
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              padding: "16px",
              borderRadius: "12px",
              borderLeft: "3px solid #64748b",
            }}
          >
            <p
              style={{
                color: "#e2e8f0",
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
                color: "#e2e8f0",
                margin: 0,
              }}
            >
              What We Stand For:
            </h3>

            <ul
              style={{
                margin: 0,
                paddingLeft: "20px",
                color: "#cbd5e1",
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
              color: "#cbd5e1",
              margin: 0,
              fontSize: "15px",
              lineHeight: "1.6",
            }}
          >
            Join our creator community today. Together, we'll build something extraordinary: authentic content that connects, partnerships that matter, and a platform that truly serves creators.
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
}) => {
  const [email, setEmail] = useState("")
  const [state, setState] = useState<FormState>("idle")
  const [error, setError] = useState<string>()
  const [activeTab, setActiveTab] = useState<ActiveTab>("waitlist")
  const errorTimeout = useRef<NodeJS.Timeout | null>(null)

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

    setState("loading")
    
    try {
      const response = await fetch('https://mailing-service-zeta.vercel.app/api/generic-mail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          heading: 'Waitlist Form'
        }),
      });

      if (response.ok) {
        setState("success")
        toast.success('Successfully joined the waitlist!')
      } else {
        setState("error")
        setError("Failed to join waitlist. Please try again.")
        toast.error('Failed to join waitlist. Please try again.')
        errorTimeout.current = setTimeout(() => {
          setError(undefined)
          setState("idle")
        }, 3000)
      }
    } catch (error) {
      console.error('Waitlist submission error:', error);
      setState("error")
      setError("Failed to join waitlist. Please try again.")
      toast.error('Failed to join waitlist. Please try again.')
      errorTimeout.current = setTimeout(() => {
        setError(undefined)
        setState("idle")
      }, 3000)
    }
  }

  return (
    <>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
      
      <section className="px-3 pb-4 pt-2 md:px-4" style={{ position: "relative", overflow: "hidden" }}>
        <MeshGradient />

        <div
          style={{
            position: "relative",
            zIndex: 1,
            minHeight: "70vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "48px 20px",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "600px",
              backgroundColor: "rgba(5, 5, 8, 0.55)",
              borderRadius: "24px",
              overflow: "hidden",
              boxShadow:
                "0px 60px 48px 0px rgba(0, 0, 0, 0.3), 0px 27px 27px 0px rgba(0, 0, 0, 0.15), 0px 7px 15px 0px rgba(0, 0, 0, 0.1)",
              backdropFilter: "blur(24px)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            {/* Main Content */}
            <div
              style={{
                padding: "32px",
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
                          fontWeight: "700",
                          color: "#ffffff",
                          margin: 0,
                          lineHeight: "1.15",
                          letterSpacing: "-0.03em",
                          fontFamily: "inherit",
                        }}
                      >
                        {title}
                      </h1>
                      <p
                        style={{
                          color: "#94a3b8",
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
                              backgroundColor: "rgba(255, 255, 255, 0.05)",
                              borderRadius: "22px",
                              color: "#e2e8f0",
                              border: "1px solid rgba(255, 255, 255, 0.1)",
                              outline: "none",
                              transition: "all 0.2s ease",
                            }}
                            onFocus={(e) => {
                              e.target.style.borderColor = "rgba(255, 255, 255, 0.2)"
                            }}
                            onBlur={(e) => {
                              e.target.style.borderColor = "rgba(255, 255, 255, 0.1)"
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
                              backgroundColor: "#e2e8f0",
                              color: "#1e293b",
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
                              color: "#f87171",
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
          </div>
        </div>
      </section>
    </>
  )
}

export default WaitlistComponent
