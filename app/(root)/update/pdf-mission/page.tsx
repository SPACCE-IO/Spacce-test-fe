"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Mouse } from "lucide-react";
import AnimatedMissionBadge from "@/app/components/AnimatedMissionBadge";
import EndSectionGradient from "@/app/components/end-section-gradient";
import MissionBadge from "@/app/components/mission-badge";
import Navbar from "@/app/components/navbar";
import ScrollSection from "@/app/components/ScrollSection";
import StartSection from "@/app/components/start-section";
import TaskPaginationSection from "@/app/components/TaskPaginationSection";
import TitleTopSectionV2 from "@/app/components/TitleTop-v2";
import { Button } from "@/components/ui/button";
import MissionInstruction from "@/app/components/mission-instruction";
import MissionVideoQuestions from "@/app/components/mission-video-questions";

const MissionPdf = () => {
  const [activeSection, setActiveSection] = useState<number>(0);
  const totalSteps = 4;
  const containerRef = useRef<HTMLDivElement>(null!);
  const startSectionRef = useRef<HTMLDivElement>(null!);
  const section2Ref = useRef<HTMLDivElement>(null!);
  const section3Ref = useRef<HTMLDivElement>(null!);
  const section4Ref = useRef<HTMLDivElement>(null!);
  const section5Ref = useRef<HTMLDivElement>(null!);
  const router = useRouter();

  const sampleQuestions = [
    {
      id: 1,
      question: "What inspired your colleague to join the company?",
      answer: "",
      type: "longText" as const,
      hint: "Consider asking about their initial motivations and what drew them to the company",
    },
    {
      id: 2,
      question:
      "What has been their most significant achievement or proudest moment at the company?",
      answer: "",
      type: "longText" as const,
      hint: "Think about specific projects, initiatives, or milestones they've accomplished",
    },
    {
      id: 3,
      question: "How has their role evolved over the years?",
      answer: "",
      type: "longText" as const,
      hint: "Consider changes in responsibilities, skills, and growth opportunities",
    }
  ];

  const handleMissionSubmit = (answers: { [key: number]: string }) => {
    console.log("Submitted answers:", answers);
    router.push("/congratulation");
    // Handle the submission logic here
  };

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

  const handleButtonScroll = (sectionRef: React.RefObject<HTMLDivElement>) => {
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: 'smooth' });
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
        return "Mission  Instruction";
      case 3:
        return "Mission Task";
      default:
        return "";
    }
  };
  const getMissionSubTitle = (sectionIndex: number): string => {
    switch (sectionIndex) {
      case 1:
        return "";
      case 2:
        return "Insights";
      case 3:
        return "Why I wake up";
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

      <TitleTopSectionV2
        title={getMissionTitle(activeSection)}
        subTitle={getMissionSubTitle(activeSection)}
      />

      <div
        ref={containerRef}
        className="h-full overflow-hidden snap-y snap-mandatory pt-16"
        onWheel={(e) => e.preventDefault()}
      >
        <div ref={startSectionRef} className="snap-start h-screen">
          <StartSection>
            <div className="h-full w-full pt-[220px] ">
              <div className="h-full w-full grid grid-rows-3">
                <div className="row-span-2"></div>
                <div className="row-span-1 w-full h-full flex flex-col items-center justify-center pb-7">
                  <p className="text-white text-[16px] font-semibold">
                    Mission Name
                  </p>
                  <h1 className="text-white text-[36px] font-semibold">
                    Meet a Legend
                  </h1>
                </div>
                <div className="flex justify-center items-center">
                  <Button
                    variant={"default"}
                    className="w-[250px] h-[50px] flex items-center justify-center gap-2 bg-[#36CEF8]"
                    onClick={() => handleButtonScroll(section2Ref)}
                  >
                    See introduction <Mouse />
                  </Button>
                </div>
              </div>
            </div>
          </StartSection>
        </div>

        <div
          ref={section2Ref}
          className="snap-start h-screen flex justify-center items-center"
        >
          <div className="container mx-auto py-16 flex flex-col items-center">
            <p className="text-black opacity-30 font-bold">Mission Name</p>
            <h1 className="text-erify-dark text-[56px] font-bold text-center py-5">
              Meet a Legend
            </h1>
            <p className="text-center text-[25px] font-light w-[45%]">
              The employee goes through the various leadership blueprints where
              each of the leader&apos;s goals and ambitions are depicted. The
              employee then links the various blueprints to the leaders​
            </p>
            <p className="pt-10 pb-12 flex items-center gap-2">
              <Button
                variant={"default"}
                className="w-[250px] h-[50px] flex items-center justify-center gap-2 bg-[#36CEF8]"
                onClick={() => handleButtonScroll(section3Ref)}
              >
                See instructions <Mouse />
              </Button>
            </p>
            <div className="flex justify-center items-center border border-dashed border-black bg-neutral-100 aspect-square h-[320px] rounded-[15px]">
              Meet a Legend Badge
            </div>
          </div>
        </div>

        <div ref={section3Ref} className="snap-start h-screen">
          <MissionInstruction
            missionName=""
            title=""
            missionInstruction="Have a look at the infographic / pdf to get a better idea on how to submit your tested concept. Your task today is to schedule time in your diary over the next 6 months to work on this. Please schedule a minimum of 2 hours a month. This msision is your initaition into our curious club. Get ready to innovate, learn and grow"
            handleButtonScroll={() => handleButtonScroll(section4Ref)}
          />
        </div>
        <div ref={section4Ref} className="snap-start h-screen">
          <MissionVideoQuestions
            questions={sampleQuestions}
            onSubmit={handleMissionSubmit}
          />
        </div>
        {/* <div ref={section5Ref} className="snap-end">
          <EndSectionGradient>
            <div className=" container mx-auto flex flex-col items-center justify-center gap-10 ">
              <MissionBadge mission="poster" missionStatus="complete" />
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
        </div> */}
      </div>
    </div>
  );
};

export default MissionPdf;
