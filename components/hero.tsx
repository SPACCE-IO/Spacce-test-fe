"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"

import localFont from "next/font/local"
import { Mouse } from "lucide-react"

const myFont = localFont({ 
  src:"../fonts/Satoshi-Medium.woff",
  variable: "--font-satoshi-medium"
})
const myFontLight = localFont({ 
  src:"../fonts/Satoshi-Light.woff",
  variable: "--font-satoshi-light"
})



export default function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial animation
      gsap.from(cardRef.current, {
        y: 100,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      })

      // Scroll animation
      gsap.to(cardRef.current, {
        y: -50,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={sectionRef}
      className={`min-h-screen relative flex flex-col items-center justify-center text-white bg-gradient-custom-2 ${myFont.className}`}>
      <div ref={cardRef} className="relative mb-8 z-1">
        {/* <img
          src="/placeholder.svg?height=300&width=200"
          alt="ID Card"
          className="rounded-lg shadow-2xl"
        /> */}
      </div>
      <h1 className="text-[65px] hero-mask leading-[78px] pt-[200px] font-bold text-center mb-4 relative z-20">
        <span className="">Renew</span> Your Organisational
        <br />
        Citizenship
      </h1>
      <p className={`text-[14px] text-gray-300 text-center max-w-2xl mb-12 ${myFontLight.className}`}>
        Your voice shapes our future through meaningful engagement and active participation.
      </p>
      <div className="flex-row items-center justify-center gap-4">
        <div className="flex justify-center items-center">
        <Mouse className="animate-bounce"/>
        </div>
        <span className="text-sm text-gray-400">Scroll for more</span>
      </div>
    </div>
  )
}

