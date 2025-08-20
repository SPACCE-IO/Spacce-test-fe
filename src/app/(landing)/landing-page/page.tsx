"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollArea } from "@/src/components/ui/scroll-area";
import AnimatedCardBadge from "@/src/components/AnimatedCard";
import Navbar from "@/src/components/navbar";
import Hero from "@/src/components/hero";
import LandingContent from "@/src/components/landing-content";
import Journey from "@/src/components/journey";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const LandingPage = () => {
  const mainRef = useRef<HTMLDivElement>(null!);
  const sectionHero = useRef<HTMLDivElement>(null!);
  const lastSection = useRef<HTMLDivElement>(null!);
  const containerRef = useRef<HTMLDivElement>(null!);
  const section1 = useRef<HTMLDivElement>(null!);
  const section2 = useRef<HTMLDivElement>(null!);
  const section3 = useRef<HTMLDivElement>(null!);
  const section4 = useRef<HTMLDivElement>(null!);

  useEffect(() => {
    if (!containerRef.current) return;

    const sections = [
      sectionHero,
      section1,
      section2,
      section3,
      section4,
      lastSection,
    ];

    const ctx = gsap.context(() => {
      sections.forEach((sectionRef) => {
        if (!sectionRef.current) return;

        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top center",
          end: "bottom center",
          onEnter: () => {
            if (containerRef.current && sectionRef.current) {
              gsap.to(containerRef.current, {
                duration: 0.5,
                scrollTo: { y: sectionRef.current, autoKill: false },
                ease: "power2.inOut",
              });
            }
          },
          onEnterBack: () => {
            if (containerRef.current && sectionRef.current) {
              gsap.to(containerRef.current, {
                duration: 0.5,
                scrollTo: { y: sectionRef.current, autoKill: false },
                ease: "power2.inOut",
              });
            }
          },
        });
      });
    }, mainRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={mainRef} className="h-screen overflow-hidden bg-white ">
      <AnimatedCardBadge
        containerRef={containerRef}
        startSectionRef={sectionHero}
        section2Ref={section2}
        section2Ref1={section1}
        section3Ref1={section3}
        section4Ref1={section4}

        // startSectionRef={sectionHero}
        // section2Ref={section2}
        // section2Ref1={section1}
        // section3Ref1={section3}
        // section4Ref1={section4}
      />
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar variant="login" />
      </div>

      <div
        ref={containerRef}
        className="h-full overflow-y-auto snap-y snap-mandatory"
      >
        <div ref={sectionHero} className="min-h-screen snap-start">
          <Hero />
        </div>

        <div ref={section1} className="min-h-screen snap-start">
          <LandingContent
            heading={true}
            title="Why Renew Your Citizenship"
            description="Your renewal signals commitment to leadership and secures your voice in key decisions. It's a meaningful rite of passage in our organisation."
          />
        </div>

        <div ref={section2} className="min-h-screen snap-start">
          <LandingContent
            title="Actions Signal Leadership"
            description="Each step you take sends clear signals to leadership about your commitment to our strategy and purpose. Make your engagement visible."
          />
        </div>

        <div ref={section3} className="min-h-screen snap-start">
          <LandingContent
            title="Build Our Future Together"
            description="Join fellow members in shaping what's next. Your engagement matters."
          />
        </div>

        <div ref={section4} className="min-h-screen snap-start">
          <LandingContent
            title="Send The Right Signal"
            description="By participating, you're bringing life to our community. By choosing silence, you risk a different message: a signal of disengagement."
          />
        </div>
        <div ref={lastSection} className="relative z-40 h-max snap-start">
          <ScrollArea className="h-screen snap-y snap-mandatory">
            <div className="h-[130vh] snap-proximity">
              <Journey />
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};
export default LandingPage;
