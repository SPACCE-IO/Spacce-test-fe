"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import dynamic from "next/dynamic"
import StaticCardLottie from "@/public/assets/lottie/StaticCard.json"
import BackgroundSignals from "@/public/assets/lottie/BackgroundSignals.json"
import Lottielabactions from "@/public/assets/lottie/LottielabActions.json"
import Lottielabtogether from "@/public/assets/lottie/Lottielabtogether.json"
import LottieTransformation from "@/public/assets/lottie/TransformationUpdate.json"

const Lottie = dynamic(() => import("lottie-react"), { ssr: false })

gsap.registerPlugin(ScrollTrigger)

interface AnimatedCardBadgeProps {
  containerRef: React.RefObject<HTMLDivElement>
  startSectionRef: React.RefObject<HTMLDivElement>
  section2Ref: React.RefObject<HTMLDivElement>
  section2Ref1: React.RefObject<HTMLDivElement>
  section3Ref1: React.RefObject<HTMLDivElement>
  section4Ref1: React.RefObject<HTMLDivElement>
}

const AnimatedCardBadge: React.FC<AnimatedCardBadgeProps> = ({
  containerRef,
  startSectionRef,
  section2Ref,
  section2Ref1,
  section3Ref1,
  section4Ref1,
}) => {
  const badgeRef = useRef<HTMLDivElement>(null)
  const backgroundRef = useRef<HTMLDivElement>(null)
  const lottieContainerRef = useRef<HTMLDivElement>(null)
  const [currentAnimation, setCurrentAnimation] = useState<string>("transformation")
  const [showBackground, setShowBackground] = useState(false)

  useEffect(() => {
    if (
      !badgeRef.current ||
      !containerRef.current ||
      !startSectionRef.current ||
      !section2Ref1.current ||
      !section2Ref.current ||
      !section3Ref1.current ||
      !section4Ref1.current
    ) {
      console.warn("Some refs are not available yet")
      return
    }

    const badge = badgeRef.current
    const container = containerRef.current
    const heroSection = startSectionRef.current
    const section1 = section2Ref1.current
    const section2 = section2Ref.current
    const section3 = section3Ref1.current
    const section4 = section4Ref1.current

    console.log("Setting up animations with sections:", {
      heroSection,
      section1,
      section2,
      section3,
      section4,
    })

    // Initial animation
    const tl1 = gsap.timeline({
      scrollTrigger: {
        trigger: heroSection,
        scroller: container,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    })

    tl1.fromTo(
      badge,
      {
        x: "-50%",
        y: "-80%",
        top: "50%",
        left: "50%",
      },
      {
        x: "0%",
        y: "-50%",
      },
    )

    // Sections animation
    const tl2 = gsap.timeline({
      scrollTrigger: {
        trigger: section1,
        scroller: container,
        start: "top bottom",
        end: () => `+=${section1.offsetHeight + section2.offsetHeight + section3.offsetHeight + section4.offsetHeight}`,
        scrub: true,
        onUpdate: (self) => {
          const progress = self.progress
          console.log(`Scroll progress: ${progress.toFixed(2)}`)

          if (progress < 0.30) {
            setCurrentAnimation("static")
            setShowBackground(false)
          } else if (progress < 0.6) {
            setCurrentAnimation("labactions")
            setShowBackground(false)
          } else if (progress < 0.80 && progress < 0.90) {
            setCurrentAnimation("labtogether")
            setShowBackground(false)
          } else {
            setCurrentAnimation("static")
            setShowBackground(true)
          }
        },
      },
    })

    // Add some subtle movements to the badge during scrolling
    tl2
      .to(badge, { duration: 0.25 })

    // Clean up
    return () => {
      console.log("Cleaning up ScrollTrigger instances")
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [containerRef, startSectionRef, section2Ref, section2Ref1, section3Ref1, section4Ref1])

  const renderLottieAnimation = () => {
    switch (currentAnimation) {
      case "transformation":
        return (
          <Lottie animationData={LottieTransformation} loop={false} onComplete={() => setCurrentAnimation("static")} />
        )
      case "labactions":
        return <Lottie animationData={Lottielabactions} loop={true} />
      case "labtogether":
        return <Lottie animationData={Lottielabtogether} loop={true} />
      case "static":
      default:
        return <Lottie animationData={StaticCardLottie} loop={true} />
    }
  }

  return (
    <div
      ref={badgeRef}
      className="fixed z-40 pointer-events-none"
      style={{
        width: "600px",
        height: "600px",
        top: "30%",
        left: "50%"
      }}
    >
      {showBackground && (
        <div
          ref={backgroundRef}
          className="absolute inset-0 z-0"
          style={{
            width: "100%",
            height: "100%",
            transform: "scale(1.5)",
          }}
        >
          <Lottie animationData={BackgroundSignals} loop={true} />
        </div>
      )}
      <div ref={lottieContainerRef} className="absolute inset-0 z-10">
        {renderLottieAnimation()}
      </div>
    </div>
  )
}

export default AnimatedCardBadge

