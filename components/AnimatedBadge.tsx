"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import { gsap } from "gsap"

interface BadgeInterface {
  amplitude: number
  revealType: string
  children: React.ReactNode
  triggerAnimation: number // New prop to trigger animation
}

const AnimatedBadge = ({ amplitude = 10, revealType = "fadeUp", children, triggerAnimation }: BadgeInterface) => {
  const badgeRef = useRef(null)
  const timelineRef = useRef<gsap.core.Timeline | null>(null)

  useEffect(() => {
    const badge = badgeRef.current

    // Kill the previous timeline if it exists
    if (timelineRef.current) {
      timelineRef.current.kill()
    }

    // Create a new timeline
    const timeline = gsap.timeline()
    timelineRef.current = timeline

    // Reset initial state based on animation type
    switch (revealType) {
      case "fadeUp":
        gsap.set(badge, {
          scale: 0.5,
          opacity: 0,
          y: 50,
        })
        break
      case "zoomPop":
        gsap.set(badge, {
          scale: 0.6,
          opacity: 0,
          y: 0,
        })
        break
      case "dropBounce":
        gsap.set(badge, {
          scale: 1,
          opacity: 0,
          y: -60,
        })
        break
    }

    // Different reveal animations
    switch (revealType) {
      case "fadeUp":
        timeline.to(badge, {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power2.out",
        })
        break

      case "zoomPop":
        timeline
          .to(badge, {
            scale: 1.2,
            opacity: 1,
            duration: 0.6,
            ease: "power2.out",
          })
          .to(badge, {
            scale: 1,
            duration: 0.4,
            ease: "power1.inOut",
          })
        break

      case "dropBounce":
        timeline
          .to(badge, {
            opacity: 1,
            duration: 0.1,
          })
          .to(badge, {
            y: 10,
            duration: 0.6,
            ease: "power2.in",
          })
          .to(badge, {
            y: 0,
            duration: 0.3,
            ease: "power2.out",
          })
          .to(badge, {
            y: 5,
            duration: 0.2,
            ease: "power2.in",
          })
          .to(badge, {
            y: 0,
            duration: 0.15,
            ease: "power2.out",
          })
        break
    }

    // Add floating animation after reveal
    timeline.to(badge, {
      y: `-=${amplitude}`,
      duration: 1.5,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      delay: 0.2,
    })

    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill()
      }
    }
  }, [revealType, amplitude, triggerAnimation]) // Now triggerAnimation is used in the dependency array

  return <div ref={badgeRef}>{children}</div>
}

export default AnimatedBadge

