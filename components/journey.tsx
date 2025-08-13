"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";
import localFont from "next/font/local";
import { useRouter } from "next/navigation";
import Footer from "@/app/components/spacce-footer"


const myFont = localFont({ src: "../fonts/Satoshi-Medium.woff" });
const myFontRegular = localFont({ src: "../fonts/Satoshi-Regular.woff" });

gsap.registerPlugin(ScrollTrigger);

const tabs = [
  {
    id: 1,
    title: "First Lorem ipsum dolor sit amet",
    content: "First consectetur adipiscing elit.",
  },
  {
    id: 2,
    title: "Second Lorem ipsum dolor sit amet",
    content: "Second consectetur adipiscing elit.",
  },
  {
    id: 3,
    title: "Third Lorem ipsum dolor sit amet",
    content: "Third consectetur adipiscing elit.",
  },
];

const TAB_DURATION = 5000; // 5 seconds per tab

export default function Journey() {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const mockupRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  const router = useRouter();

  const handleClick = () => {
    router.push("/dashboard");
  };

  const goToNextTab = useCallback(() => {
    setActiveTabIndex((prevIndex) => {
      const nextIndex = (prevIndex + 1) % tabs.length;
      console.log(`Moving from tab ${prevIndex + 1} to tab ${nextIndex + 1}`);
      return nextIndex;
    });
    setProgress(0);
    lastTimeRef.current = null;
  }, []);

  const animate = useCallback(
    (time: number) => {
      if (lastTimeRef.current !== null) {
        const deltaTime = time - lastTimeRef.current;
        setProgress((prevProgress) => {
          const newProgress = prevProgress + (deltaTime / TAB_DURATION) * 100;
          if (newProgress >= 100) {
            goToNextTab();
            return 0;
          }
          return newProgress;
        });
      }
      lastTimeRef.current = time;
      animationRef.current = requestAnimationFrame(animate);
    },
    [goToNextTab]
  );

  const startAnimation = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    lastTimeRef.current = null;
    setProgress(0);
    animationRef.current = requestAnimationFrame(animate);
  }, [animate]);

  useEffect(() => {
    console.log(`Active tab changed to: ${activeTabIndex + 1}`);
  }, [activeTabIndex]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      startAnimation();
    }, sectionRef);

    return () => {
      ctx.revert();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [startAnimation]);

  return (
    <section
      ref={sectionRef}
      className={`h-[170vh] relative w-full items-center pt-[192px] flex px-8 text-white bg-gradient-custom-bottom-welcome ${myFontRegular.className}`}
    >
      <div className="w-[1312px] mx-auto text-center">
        <h2
          className={`text-[65px] leading-[78px] hero-mask font-bold mb-16 ${myFont.className}`}
        >
          How to start your
          <br />
          transformative journey
        </h2>

        <div className="w-[75%] items-center justify-center mx-auto">
          <div ref={mockupRef} className="relative">
            <div className="aspect-video w-full rounded-[30px] mx-auto bg-[#9F52E2] p-10 shadow-2xl overflow-hidden flex items-center justify-center">
              <div className="w-full h-full bg-white rounded-[15px] mx-auto flex items-center justify-center">
                <p className="text-center text-black text-[18px]">
                  Tutorial Placeholder (video or image)
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {tabs.map((tab, index) => (
              <div
                key={tab.id}
                className={`p-6 transition-colors cursor-pointer relative ${
                  activeTabIndex === index ? "text-white" : "text-gray-400"
                }`}
                onClick={() => {
                  setActiveTabIndex(index);
                  startAnimation();
                }}
              >
                <p className="text-[16px]">{tab.title}</p>
                <p className="text-[16px] mb-2">{tab.content}</p>
                <div className="w-full h-1 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-50 ease-linear ${
                      activeTabIndex === index ? "bg-white" : "bg-gray-500"
                    }`}
                    style={{
                      width: `${activeTabIndex === index ? progress : 0}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className=" flex justify-center items-center pb-20">
          <div className=" w-[201px] h-[51px] p-[3px] bg-gradient-to-b from-[#DDD4FF] to-[#C0B1FF] rounded-[8px] ">
            <Button
              variant={"outline"}
              onClick={handleClick}
              className="w-full h-full rounded-[8px] text-[#6C50E0] text-[18px] font-bold"
            >
              Start the Journey
            </Button>
          </div>
        </div>

        <Footer />
      </div>
    </section>
  );
}
