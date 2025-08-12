"use client";
import AnimatedMissionBadge from "@/app/components/AnimatedMissionBadge";
import EndSectionGradient from "@/app/components/end-section-gradient";
import { ImageCard } from "@/app/components/image-card";
import MissionBadge from "@/app/components/mission-badge";
import MissionSearchPlaceholder from "@/app/components/mission-search-placeholder";
import Navbar from "@/app/components/navbar";
import ScrollSection from "@/app/components/ScrollSection";
import StartSection from "@/app/components/start-section";
import TaskPaginationSection from "@/app/components/TaskPaginationSection";
import { Button } from "@/components/ui/button";
import { Mouse } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { useEffect, useState, useRef } from "react";
import profile1 from "@/public/assets/profilepics/profile1.svg";
import profile2 from "@/public/assets/profilepics/profile2.svg";
import profile3 from "@/public/assets/profilepics/profile3.svg";
import profile4 from "@/public/assets/profilepics/profile4.svg";
import profile5 from "@/public/assets/profilepics/profile5.svg";
import TitleTopSection from "@/app/components/TitleTop";

const TwoMinuteAppreciation = () => {
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

  const profiles = [
    {
      imageUrl: profile1,
      title: "Profile 1",
    },
    {
      imageUrl: profile2,
      title: "Profile 2",
    },
    {
      imageUrl: profile3,
      title: "Profile 3",
    },
    {
      imageUrl: profile4,
      title: "Profile 4",
    },
    {
      imageUrl: profile5,
      title: "Profile 5",
    },
  ];
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

        <div
          ref={section2Ref}
          className="snap-start h-screen justify-center flex"
        >
          <div className=" h-full container mx-auto py-16 justify-center items-center flex flex-col">
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
            {/* <div className="flex justify-center items-center border border-dashed border-black bg-neutral-100 w-[1312px] h-[472px] rounded-[15px]"></div>
             */}

            <div className="flex justify-center items-center w-full max-w-[1312px] h-[472px] rounded-[15px] overflow-hidden -top-14 relative">
              <div className="grid grid-cols-5">
                {profiles.map((profile, index) => (
                  <ImageCard
                    key={index}
                    imageUrl={profile.imageUrl}
                    title={profile.title}
                    index={index}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div ref={section3Ref} className="snap-start h-screen">
          <MissionSearchPlaceholder
            varient="text"
            missionDescription="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur."
          ></MissionSearchPlaceholder>
        </div>

        <div ref={section4Ref} className="snap-start h-screen">
          <MissionSearchPlaceholder
            missionDescription="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur."
            varient="image"
          ></MissionSearchPlaceholder>
        </div>

        <div ref={section5Ref} className="snap-start h-screen">
          <MissionSearchPlaceholder
            missionDescription="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur."
            varient="image"
            option={true}
          ></MissionSearchPlaceholder>
        </div>

        <div ref={section6Ref} className="snap-start h-screen">
          <MissionSearchPlaceholder
            missionDescription="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur."
            varient="image"
            option={true}
          ></MissionSearchPlaceholder>
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

export default TwoMinuteAppreciation;
