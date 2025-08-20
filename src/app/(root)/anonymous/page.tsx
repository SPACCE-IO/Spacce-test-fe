"use client";
import AnimatedMissionBadge from "@/app/components/AnimatedMissionBadge";
import EndSectionGradient from "@/app/components/end-section-gradient";
import MissionBadge from "@/app/components/mission-badge";
import MissionPlaceholder from "@/app/components/mission-placeholder";
import Navbar from "@/app/components/navbar";
import ScrollSection from "@/app/components/ScrollSection";
import StartSection from "@/app/components/start-section";
import TaskPaginationSection from "@/app/components/TaskPaginationSection";
import TitleTopSection from "@/app/components/TitleTop";
import { Button } from "@/src/components/ui/button";
import { Mouse } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { useEffect, useState, useRef } from "react";

const AnonymousReview = () => {
  const [activeSection, setActiveSection] = useState<number>(0);
  const totalSteps = 3;

  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null!);
  const startSectionRef = useRef<HTMLDivElement>(null!);
  const section2Ref = useRef<HTMLDivElement>(null!);
  const section3Ref = useRef<HTMLDivElement>(null!);
  const section4Ref = useRef<HTMLDivElement>(null);

  const handleClick = (): void => {
    router.push("/dashboard?tab=current-mission");
  };

  const scrollToSection = (direction: "up" | "down") => {
    if (containerRef.current) {
      const container = containerRef.current;
      const currentScroll = container.scrollTop;
      const viewportHeight = container.clientHeight;

      container.scrollTo({
        top:
          currentScroll +
          (direction === "down" ? viewportHeight : -viewportHeight),
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const options = {
      root: containerRef.current,
      rootMargin: "0px",
      threshold: 0.5,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionIndex = Number(
            entry.target.getAttribute("data-section-index")
          );
          setActiveSection(sectionIndex);
          console.log("Active section:", sectionIndex);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, options);

    const sections = [
      startSectionRef.current,
      section2Ref.current,
      section3Ref.current,
      section4Ref.current,
    ];

    sections.forEach((section, index) => {
      if (section) {
        section.setAttribute("data-section-index", index.toString());
        observer.observe(section);
      }
    });

    return () => {
      sections.forEach((section) => {
        if (section) observer.unobserve(section);
      });
    };
  }, []);

  const getTaskTitle = (sectionIndex: number): string => {
    switch (sectionIndex) {
      case 1:
        return "Introduction";
      case 2:
        return "Task 01";
      case 3:
        return "Congratulations";
      default:
        return "";
    }
  };

  const getMissionTitle = (sectionIndex: number): string => {
    switch (sectionIndex) {
      case 1:
        return "";
      case 2:
        return "Mission Title 01";
      default:
        return "";
    }
  };

  return (
    <div className="h-screen overflow-hidden">
      <Navbar />
      <AnimatedMissionBadge
        mission="standard"
        missionStatus="incomplete"
        containerRef={containerRef}
        startSectionRef={startSectionRef}
        section2Ref={section2Ref}
        section3Ref={section3Ref}
      />
      <TaskPaginationSection
        title={getTaskTitle(activeSection)}
        totalSteps={totalSteps}
        currentStep={activeSection}
      >
        <ScrollSection
          onScrollUp={() => scrollToSection("up")}
          onScrollDown={() => scrollToSection("down")}
        />
      </TaskPaginationSection>

      <TitleTopSection title={getMissionTitle(activeSection)} />

      <div
        ref={containerRef}
        className="h-full overflow-y-auto snap-y snap-mandatory"
      >
        <div ref={startSectionRef} className="snap-start h-screen">
          <StartSection />
        </div>

        <section
          ref={section2Ref}
          className="h-screen justify-center flex snap-start"
        >
          <div className=" container mx-auto py-16 justify-center items-center flex flex-col">
            <h1 className=" text-erify-dark text-4xl font-bold text-center py-5">
              Mission Title
            </h1>
            <p className=" text-center text-[25px] font-light">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut <br />{" "}
              et massa mi. Aliquam in hendrerit urna. Pellentesque sit <br />{" "}
              amet sapien fringilla, mattis ligula consectetur.
            </p>

            <p className="pt-10"> Use Scrollbar to start</p>
            <div className="pb-12">
              <Mouse />
            </div>

            {/* Placeholder and badge */}

            <div className="w-[472px] h-[472px] flex items-center justify-center border-dashed border rounded-[15px]">
              <p>Anonymous Badge</p>
            </div>
          </div>
        </section>

        <div ref={section3Ref} className="snap-start h-screen">
          <MissionPlaceholder />
        </div>

        <div ref={section4Ref} className="snap-end">
          <EndSectionGradient>
            <div className=" container mx-auto flex flex-col items-center justify-center gap-10">
              <MissionBadge mission="anonymous" missionStatus="complete" />
              <div
                className="flex flex-col items-center justify-center gap-6 pt-10
             "
              >
                <h2 className=" text-erify-dark text-[24px] font-semibold py-5">
                  Congratulations
                </h2>
                <p className=" text-center text-[24px] font-light">
                  You&apos;ve left a mark and sent a signal. You are one step
                  closer to renewing <br /> your IBMer Multi-pass. Keep up the
                  signaling
                </p>
                <Button variant={"primary"} onClick={handleClick}>
                  See Progress
                </Button>
              </div>
            </div>
          </EndSectionGradient>
        </div>
      </div>
    </div>
  );
};

export default AnonymousReview;
