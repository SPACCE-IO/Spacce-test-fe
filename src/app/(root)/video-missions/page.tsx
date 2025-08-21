"use client";
import type React from "react";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Mouse } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import Navbar from "@/app/components/navbar";
import StartSection from "@/app/components/start-section";
import VideoPerspectiveView from "@/app/components/video-perspective-view";
import MissionVideoBig from "@/app/components/mission-video-big";
import MissionSearch from "@/app/components/mission-search";
import EndSectionGradient from "@/app/components/end-section-gradient";
import MissionVideoSmall from "@/app/components/mission-video-small";
import TaskPaginationSection from "@/app/components/TaskPaginationSection";
import ScrollSection from "@/app/components/ScrollSection";
import AnimatedMissionBadge from "@/app/components/AnimatedMissionBadge";
import MissionBadge from "@/app/components/mission-badge";
import TitleTopSection from "@/app/components/TitleTop";

const VideoMissions: React.FC = () => {
  const [activeSection, setActiveSection] = useState<number>(0);
  const totalSteps = 6;
  const containerRef = useRef<HTMLDivElement>(null!);
  const startSectionRef = useRef<HTMLDivElement>(null!);
  const section2Ref = useRef<HTMLDivElement>(null!);
  const section3Ref = useRef<HTMLDivElement>(null!);
  const section4Ref = useRef<HTMLDivElement>(null);
  const section5Ref = useRef<HTMLDivElement>(null);
  const section6Ref = useRef<HTMLDivElement>(null);
  const section7Ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleClick = () => {
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
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, options);

    const sections = [
      startSectionRef.current,
      section2Ref.current,
      section3Ref.current,
      section4Ref.current,
      section5Ref.current,
      section6Ref.current,
      section7Ref.current,
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
        return "Task 02";
      case 4:
        return "Task 03";
      case 5:
        return "Task 04";
      case 6:
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
      case 3:
        return "Mission Title 02";
      case 3:
        return "Mission Title 03";
      case 4:
        return "Mission Title 04";
      case 5:
        return "Mission Title 05";
      default:
        return "";
    }
  };

  return (
    <div className={`h-screen overflow-hidden`}>
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

        <div ref={section2Ref} className="snap-start h-screen">
          <div className=" py-16 items-center flex flex-col ">
            <h1 className="text-erify-dark text-4xl font-bold text-center py-5">
              Mission Title
            </h1>
            <p className="text-center text-[25px] font-light">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut <br />
              et massa mi. Aliquam in hendrerit urna. Pellentesque sit <br />{" "}
              amet sapien fringilla, mattis ligula consectetur.
            </p>

            <p className="pt-10">Use Scrollbar to start</p>
            <div className="">
              <Mouse />
            </div>

            <div className="flex justify-center items-center">
              <div className="flex justify-center items-center">
                <VideoPerspectiveView videoSrc="/sample.mp4" />
              </div>
            </div>
          </div>
        </div>

        <div ref={section3Ref} className="snap-start h-screen">
          <MissionVideoSmall
            title=""
            description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris"
            videoSrc="/sample.mp4"
          ></MissionVideoSmall>
        </div>
        <div ref={section4Ref} className="snap-start h-screen">
          <MissionVideoBig
            missionTitle=""
            missionDescription="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur."
            videoSrc="/sample.mp4"
          ></MissionVideoBig>
        </div>
        <div ref={section5Ref} className="snap-start h-screen">
          <MissionSearch
            title=""
            missionDescription="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur."
          ></MissionSearch>
        </div>
        <div ref={section6Ref} className="snap-start h-screen">
          <MissionVideoBig
            missionTitle=""
            missionDescription="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur."
            videoSrc="/sample.mp4"
          ></MissionVideoBig>
        </div>
        <div ref={section7Ref} className="snap-end">
          <EndSectionGradient>
            <div className=" container mx-auto flex flex-col items-center justify-center gap-10">
              <MissionBadge mission="two-minute" missionStatus="complete" />
              <div
                className="flex flex-col items-center justify-center gap-6 pt-10
             "
              >
                <h2 className=" text-erify-dark text-[24px] font-semibold py-5">
                  Congratulations
                </h2>
                <p className=" text-center text-[24px] font-light">
                  You’ve left a mark and sent a signal. You are one step closer
                  to renewing <br /> your IBMer Multi-pass. Keep up the
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

export default VideoMissions;
