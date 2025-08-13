"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import localFont from "next/font/local";
import GradientText from "./text-purple-gradient";
// import BackgroundSignals from "@/public/assets/lottie/BackgroundSignals.json";
// import dynamic from "next/dynamic";
// import StaticCardLottie from "@/public/assets/lottie/StaticCard.json";
// import StaticCard from "@/public/assets/card.svg";
// import Image from "next/image";

const myFont = localFont({ src: "../fonts/Satoshi-Medium.woff" });
const myFontRegular = localFont({ src: "../fonts/Satoshi-Regular.woff" });

// const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

gsap.registerPlugin(ScrollTrigger);

const content = [
  {
    title: "Why Renew Your Citizenship",
    description:
      "Your renewal signals commitment to leadership and secures your voice in key decisions. It's a meaningful rite of passage in our organisation.",
  },
  {
    title: "Actions Signal Leadership",
    description:
      "Each step you take sends clear signals to leadership about your commitment to our strategy and purpose. Make your engagement visible.",
  },
  {
    title: "Build Our Future Together",
    description:
      "Join fellow members in shaping what's next. Your engagement matters.",
  },
  {
    title: "Send The Right Signal",
    description:
      "By participating, you're bringing life to our community. By choosing silence, you risk a different message: a signal of disengagement.",
  },
];

export default function WhyRenew() {
  // const [isMounted, setIsMounted] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const graphicRef = useRef<HTMLDivElement>(null);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // setIsMounted(true);
    const ctx = gsap.context(() => {
      // Animate content sections
      contentRefs.current.forEach((ref, index) => {
        gsap.from(ref, {
          opacity: 0,
          y: 50,
          scrollTrigger: {
            trigger: ref,
            start: "top center+=100",
            end: "bottom center",
            toggleActions: "play none none reverse",
          },
          duration: 0.8,
          delay: index * 0.2,
        });
      });

      // Sticky graphic
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom bottom-=100%",
        pin: graphicRef.current,
        pinSpacing: false,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className={`bg-white ${myFont.className}`}>
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2">
        <div>
          {content.map((item, index) => (
            <div
              key={index}
              // ref={(el) => (contentRefs.current[index] = el)}
              className="min-h-screen flex items-center p-8 "
            >
              <div className="">
                <GradientText
                  className={` font-bold mb-4 ${
                    index === 0
                      ? "text-[56px] leading-[72.8px]"
                      : "text-[34px] leading-[44.2px]"
                  }`}
                >
                  {item.title}
                </GradientText>
                <p
                  className={`text-gray-600 text-[24px] leading-[36px] font-medium ${myFontRegular.className}`}
                >
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div> 
      </div>
    </section>
  );
}
