"use client";
import React, { useRef, useEffect, useState } from "react";
// import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/src/components/ui/button";
import Badge1 from "@/public/floating/badge_01.svg";
import Badge2 from "@/public/floating/badge_02.svg";
import Badge3 from "@/public/floating/badge_03.svg";
import Badge4 from "@/public/floating/badge_04.svg";
import Badge5 from "@/public/floating/badge_05.svg";
import Badge6 from "@/public/floating/badge_06.svg";
import Badge7 from "@/public/floating/badge_07.svg";
import Badge8 from "@/public/floating/badge_08.svg";
import Badge9 from "@/public/floating/badge_09.svg";
import Badge10 from "@/public/floating/badge_10.svg";
import Badge11 from "@/public/floating/badge_11.svg";
// import Background from "@/public/assets/backgroundCircles.svg";
import Badge13 from "@/public/floating/badge_13.svg";
import Image from "next/image";
import Navbar from "@/app/components/navbar";
import StaticCard from "@/public/assets/card.svg";
import dynamic from "next/dynamic";
// import StaticCardLottie from "@/public/assets/lottie/StaticCard.json";
import BackgroundSignals from "@/public/assets/lottie/BackgroundSignals.json";
import { useRouter } from "next/navigation";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

const FinalCongrats = () => {
  const router = useRouter();

  const handleOnClick = () => {
    router.push("/dashboard?tab=showcase");
  };

  // const circle = useRef(null);
  const startSection = useRef(null);
  const endSection = useRef(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    gsap.registerPlugin(ScrollTrigger);

    // Animation for the circle's appearance and movement
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "[data-section-1]",
        endTrigger: "[data-section-2]",
        scrub: true,
        markers: false,
        start: "20% bottom",
        end: "bottom 40%",
      },
    });

    tl.fromTo(
      "[data-scrub-2]",
      {
        opacity: 1,
        scale: 1,
        yPercent: 100,
        left: "10%",
        xPercent: -50,
      },
      {
        opacity: 1,
        scale: 1,
        yPercent: -50,
        left: "50%",
        top: "50%",
        duration: 0.5,
      }
    )
      .fromTo(
        "[data-scrub]",
        {
          opacity: 1,
          scale: 1,
          yPercent: 100,
          left: "20%",
          xPercent: -50,
        },
        {
          opacity: 1,
          scale: 1,
          yPercent: -50,
          left: "50%",
          top: "50%",
          duration: 1,
        },
        0
      )
      .fromTo(
        "[data-scrub-3]",
        {
          opacity: 1,
          scale: 1,
          yPercent: 100,
          left: "90%",
          xPercent: -50,
        },
        {
          opacity: 1,
          scale: 1,
          yPercent: -50,
          left: "50%",
          top: "50%",
          duration: 1,
        },
        0
      )
      .fromTo(
        "[data-scrub-4]",
        {
          opacity: 1,
          scale: 1,
          yPercent: 280,
          left: "80%",
          xPercent: -50,
        },
        {
          opacity: 1,
          scale: 1,
          yPercent: -50,
          left: "50%",
          top: "50%",
          duration: 1,
        },
        0
      )
      .fromTo(
        "[data-scrub-5]",
        {
          opacity: 1,
          scale: 1,
          yPercent: 440,
          left: "10%",
          xPercent: -50,
        },
        {
          opacity: 1,
          scale: 1,
          yPercent: -50,
          left: "50%",
          top: "50%",
          duration: 1,
        },
        0
      )
      .fromTo(
        "[data-scrub-6]",
        {
          opacity: 1,
          scale: 1,
          yPercent: 220,
          left: "40%",
          xPercent: -50,
        },
        {
          opacity: 1,
          scale: 1,
          yPercent: -50,
          left: "50%",
          top: "50%",
          duration: 1,
        },
        0
      )
      .fromTo(
        "[data-scrub-7]",
        {
          opacity: 1,
          scale: 1,
          yPercent: 266,
          left: "110%",
          xPercent: -50,
        },
        {
          opacity: 1,
          scale: 1,
          yPercent: -50,
          left: "50%",
          top: "50%",
          duration: 1,
        },
        0
      )
      .fromTo(
        "[data-scrub-8]",
        {
          opacity: 1,
          scale: 1,
          yPercent: 470,
          left: "65%",
          xPercent: -50,
        },
        {
          opacity: 1,
          scale: 1,
          yPercent: -50,
          left: "50%",
          top: "50%",
          duration: 1,
        },
        0
      )
      .fromTo(
        "[data-scrub-9]",
        {
          opacity: 1,
          scale: 1,
          yPercent: 300,
          left: "50%",
          xPercent: -50,
        },
        {
          opacity: 1,
          scale: 1,
          yPercent: -50,
          left: "50%",
          top: "50%",
          duration: 1,
        },
        0
      )
      .fromTo(
        "[data-scrub-10]",
        {
          opacity: 1,
          scale: 1,
          yPercent: 500,
          left: "40%",
          xPercent: -50,
        },
        {
          opacity: 1,
          scale: 1,
          yPercent: -50,
          left: "50%",
          top: "50%",
          duration: 1,
        },
        0
      )
      .fromTo(
        "[data-scrub-11]",
        {
          opacity: 1,
          scale: 1,
          yPercent: 650,
          left: "90%",
          xPercent: -50,
        },
        {
          opacity: 1,
          scale: 1,
          yPercent: -50,
          left: "50%",
          top: "50%",
          duration: 1,
        },
        0
      )
      .fromTo(
        "[data-scrub-12]",
        {
          opacity: 1,
          scale: 1,
          yPercent: 800,
          left: "35%",
          xPercent: -50,
        },
        {
          opacity: 1,
          scale: 1,
          yPercent: -50,
          left: "50%",
          top: "50%",
          duration: 1,
        },
        0
      );
  }, []);

  // if (!isMounted) {
  //   return null; // or a loading spinner
  // }

  return (
    <div className=" bg-gradient-custom-center">
      <Navbar />
      <section className="w-screen h-screen bg-transparent text-white flex items-center justify-center flex-col gap-[64px] container mx-auto ">
        <div className="w-[444px] h-[268.16px] rounded-[10px]">
          {/* <div className=" absolute z-10 bottom-1 rounded-[10px]"> */}
          <Image src={StaticCard} alt="staticCard" />
          {/* <Lottie animationData={StaticCardLottie} loop={true} /> */}
        </div>
        <p className="text-[40px] w-[800px] h-[120px] text-center">
          Lorem ipsum dolor sit ament, consectetur adipiscing elit. Aliquam in
          hendrerit urna.
        </p>
      </section>
      <main data-wrap>
        <section
          data-section-1
          className="w-screen h-screen bg-transparent text-white flex items-center justify-center flex-col container mx-auto"
        >
          <p className="text-[40px] w-[800px] h-[120px] text-center">
            Lorem ipsum dolor sit ament, consectetur adipiscing elit. Aliquam in
            hendrerit urna.
          </p>
        </section>
        <section
          ref={startSection}
          data-section-2
          className="w-screen h-screen bg-transparent text-white grid grid-rows-2 "
        >
          <div className="bg-[#1a1a1a] w-full h-full container mx-auto flex items-center justify-end flex-col">
            <div className=" z-20 relative w-[444px] h-[268.16px] rounded-[10px] pb-[64px]">
              {/* <Lottie animationData={StaticCardLottie} loop={true} height={268.16} width={444} /> */}

              <Image src={StaticCard} alt="staticCard" />
            </div>
          </div>
          <div className="z-20 relative bg-[#1a1a1a] container mx-auto flex items-center justify-start flex-col pt-[64px]">
            <p className="text-[40px] w-[800px] h-[120px] text-center">
              Lorem ipsum dolor sit ament, consectetur adipiscing elit. Aliquam
              in hendrerit urna.
            </p>
          </div>
        </section>
        <section
          ref={endSection}
          data-section-3
          className="w-screen h-screen z-30 relative bg-[#1a1a1a] text-white flex items-center justify-center flex-col container mx-auto"
        >
          <div className="">
            <div>
              {isMounted && (
                <Lottie
                  animationData={BackgroundSignals}
                  alt="card"
                  loop={true}
                  reversed={true}
                  height={268.26}
                  width={444}
                />
              )}
            </div>
            <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
              {/* {isMounted && (
                <Lottie animationData={StaticCardLottie} alt="card" loop={true} reversed={true} height={268.26} width={444} />
              )

              } */}
              <Image src={StaticCard} alt="staticCard" />
            </div>
          </div>
        </section>
      </main>

      {/* Badges Here */}
      <div>
        <div
          data-scrub
          className="fixed bottom-0 left-[20%] h-[120px] text-xs flex items-center justify-center"
        >
          <Image src={Badge1} width={100} height={112.25} alt="badge" />
        </div>
        <div
          data-scrub-2
          className="fixed bottom-0 left-[20%] h-[120px] text-xs flex items-center justify-center"
        >
          <Image src={Badge2} width={100} height={112.25} alt="badge" />
        </div>

        <div
          data-scrub-3
          className="fixed bottom-0 left-[20%] h-[120px] text-xs flex items-center justify-center"
        >
          <Image src={Badge3} width={100} height={112.25} alt="badge" />
        </div>

        <div
          data-scrub-4
          className="fixed bottom-0 left-[20%] h-[120px] text-xs flex items-center justify-center"
        >
          <Image src={Badge4} width={100} height={112.25} alt="badge" />
        </div>

        <div
          data-scrub-5
          className="fixed bottom-0 left-[20%] h-[120px] text-xs flex items-center justify-center"
        >
          <Image src={Badge5} width={100} height={112.25} alt="badge" />
        </div>

        <div
          data-scrub-6
          className="fixed bottom-0 left-[20%] h-[120px] text-xs flex items-center justify-center"
        >
          <Image src={Badge6} width={100} height={112.25} alt="badge" />
        </div>

        <div
          data-scrub-7
          className="fixed bottom-0 left-[20%] h-[120px] text-xs flex items-center justify-center"
        >
          <Image src={Badge7} width={100} height={112.25} alt="badge" />
        </div>

        <div
          data-scrub-8
          className="fixed bottom-0 left-[20%] h-[120px] text-xs flex items-center justify-center"
        >
          <Image src={Badge8} width={100} height={112.25} alt="badge" />
        </div>

        <div
          data-scrub-9
          className="fixed bottom-0 left-[20%] h-[120px] text-xs flex items-center justify-center"
        >
          <Image src={Badge9} width={100} height={112.25} alt="badge" />
        </div>

        <div
          data-scrub-10
          className="fixed bottom-0 left-[20%] h-[120px] text-xs flex items-center justify-center"
        >
          <Image src={Badge10} width={100} height={112.25} alt="badge" />
        </div>

        <div
          data-scrub-11
          className="fixed bottom-0 left-[20%] h-[120px] text-xs flex items-center justify-center"
        >
          <Image src={Badge11} width={100} height={112.25} alt="badge" />
        </div>

        <div
          data-scrub-12
          className="fixed bottom-0 left-[20%] h-[120px] text-xs flex items-center justify-center"
        >
          <Image src={Badge13} width={100} height={112.25} alt="badge" />
        </div>
      </div>

      <section className="w-screen h-screen text-white flex items-center justify-start z-20 relative flex-col container mx-auto">
        <div className="h-1/2 bg-[#1a1a1a] w-full flex items-center justify-end flex-col">
          <p className="text-[40px] w-[800px] h-[120px] text-center">
            Lorem ipsum dolor sit ament, consectetur adipiscing elit. Aliquam in
            hendrerit urna.
          </p>
        </div>
        <div className="w-full bg-[#1a1a1a] flex items-center justify-start flex-col pt-[64px]">
          <Button variant={"primary"} onClick={handleOnClick}>
            Return Home
          </Button>
        </div>
      </section>
    </div>
  );
};

export default FinalCongrats;
