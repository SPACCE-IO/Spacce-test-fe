"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import MissionBadge from "./mission-badge"

gsap.registerPlugin(ScrollTrigger)

interface AnimatedMissionBadgeProps {
  containerRef: React.RefObject<HTMLDivElement>
  startSectionRef: React.RefObject<HTMLDivElement>
  section2Ref: React.RefObject<HTMLDivElement>
  section3Ref: React.RefObject<HTMLDivElement>
  mission: string
  missionStatus: string
}

const AnimatedMissionBadge: React.FC<AnimatedMissionBadgeProps> = ({
  containerRef,
  startSectionRef,
  section2Ref,
  section3Ref,
  missionStatus,
  mission,
}) => {
  const badgeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (
      !badgeRef.current ||
      !containerRef.current ||
      !startSectionRef.current ||
      !section2Ref.current ||
      !section3Ref.current
    )
      return

    const badge = badgeRef.current
    const container = containerRef.current
    const startSection = startSectionRef.current
    const section2 = section2Ref.current
    const section3 = section3Ref.current

    // Initial animation
    const tl1 = gsap.timeline({
      scrollTrigger: {
        trigger: startSection,
        scroller: container,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    })

    // CHANGED: Modified to move to top-left instead of bottom-right
    tl1.fromTo(
      badge,
      {
        x: "-50%",
        y: "-70%",
        scale: 0.9,
        top: "50%",
        left: "50%",
      },
      {
        x: "-50%", // Keep centered horizontally, then we'll adjust
        y: "-50%", // Keep centered vertically, then we'll adjust
        scale: 0.3,
        top: "80px", // Move to top (80px from top)
        left: "80px", // Move to left (80px from left)
      },
    )

    // Second and third section animation
    const tl2 = gsap.timeline({
      scrollTrigger: {
        trigger: section2,
        scroller: container,
        start: "top bottom",
        end: () => `+=${section2.offsetHeight + section3.offsetHeight}`,
        scrub: true,
      },
    })

    // Move badge to left side of section2, roughly where the text would be
    tl2.to(badge, {
      y: "-50%", // Keep transform centered
      x: "-50%", // Keep transform centered
      top: "25%", // Move up a bit more
      left: "25%", // Move a bit to the right
      ease: "none",
    })
    
    tl2.to(badge, {
      y: "-50%", // Keep transform centered
      x: "-50%", // Keep transform centered
      top: "-10%", // Move up and off screen with the page
      left: "25%", // Keep same horizontal position
      opacity: 0, // Fade out as it moves up
      ease: "none",
    })

    // Clean up
    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill())
    }
  }, [containerRef, startSectionRef, section2Ref, section3Ref])

  return (
    <div ref={badgeRef} className="fixed z-50 pointer-events-none" style={{ top: "50%", left: "50%" }}>
      <div className="pointer-events-none">
        <MissionBadge mission={mission} missionStatus={missionStatus} width={300} height={447.22} />
      </div>
    </div>
  )
}

export default AnimatedMissionBadge