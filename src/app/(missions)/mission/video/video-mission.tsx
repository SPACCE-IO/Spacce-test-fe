"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Mouse, VideoIcon, X } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import VideoIntro from "./video-intro";
import VideoQuestions from "./video-questions";
import AnimatedMissionBadge from "@/src/components/AnimatedMissionBadge";
import Navbar from "@/src/components/navbar";
import StartSection from "@/src/components/start-section";
import { useSession } from "next-auth/react";
import MissionInstruction from "@/src/components/mission/MissionInstruction";
import { useLogResponseMutation } from "@/src/services/missionManagement";
import TaskPaginationSection from "@/src/components/mission/TaskPaginationSection";

// Define interfaces based on your API response
interface MissionDocument {
  name: string;
  url: {
    fileName: string;
    contentType: string;
    url: string;
  };
}

interface MissionQuestion {
  id: number;
  questionTypeId: number;
  typeCode: string;
  description: string;
  hint: string;
  question: string;
  sequence: number;
  hasCorrectAnswer: boolean;
  isRequired: boolean;
  points: number;
  placeholder: string;
  userAnswer: string;
  status: number;
  correctAnswer: string | null;
  characterLimit?: number;
  options?: Array<{
    id: string;
    text: string;
    isCorrect: boolean;
  }>;
  imageOptions?: Array<{
    id: string;
    altText: string;
    caption: string;
    imageUrl: string;
    isCorrect: boolean;
  }>;
  maxRating?: number;
  allowMultipleSelection?: boolean;
  matchingtems?: Array<{
    id: string;
    altText: string;
    caption: string;
    imageUrl: string;
  }>;
}

interface MissionProps {
  id: number;
  workspaceId: number;
  type: string;
  name: string;
  languageId: number;
  description: string;
  instruction: string;
  createdOn: number;
  questions: MissionQuestion[];
  status: number;
  report?: {
    email: string;
    reportTypeId: number;
  };
  iconUrl?: {
    fileName: string;
    contentType: string;
    url: string;
  };
  tags: string[];
  typeSpecificInfo: Array<{
    name: string;
  }>;
  documents: MissionDocument[];
  rewards: any[];
}

interface VideoMissionComponentProps {
  mission: MissionProps;
}

const VideoMission = ({ mission }: VideoMissionComponentProps) => {
  const [activeSection, setActiveSection] = useState<number>(0);
  const totalSteps = 4;
  const containerRef = useRef<HTMLDivElement>(null!);
  const startSectionRef = useRef<HTMLDivElement>(null!);
  const section2Ref = useRef<HTMLDivElement>(null!);
  const section3Ref = useRef<HTMLDivElement>(null!);
  const section4Ref = useRef<HTMLDivElement>(null!);
  const section5Ref = useRef<HTMLDivElement>(null!);
  const router = useRouter();
  const { data: session } = useSession();

  const [logResponse, logResponseProps] = useLogResponseMutation();

  // Check if mission is complete based on status
  const isMissionComplete = mission?.status === 2 || mission?.status === 1;

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
      sectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleClose = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    router.push("/dashboard?tab=current-mission");
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

  // Show loading if mission data is not available
  if (!mission) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading mission...</div>
      </div>
    );
  }

  return (
    <div className="h-screen relative overflow-hidden">
      <button
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleClose(e);
        }}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleClose(e);
        }}
        className={`fixed z-[9999] pointer-events-auto cursor-pointer hover:opacity-80 transition-opacity bg-transparent border-none p-2 ${
          activeSection != 1
            ? "text-white top-5 right-5"
            : "text-black top-4 left-4"
        }`}
        type="button"
        aria-label="Close mission"
        style={{ zIndex: 9999, pointerEvents: 'auto' }}
      >
        <X size={32} />
      </button>
      <AnimatedMissionBadge
        mission={mission.type}
        missionStatus={isMissionComplete ? "complete" : "incomplete"}
        containerRef={containerRef}
        startSectionRef={startSectionRef}
        section2Ref={section2Ref}
        section3Ref={section3Ref}
      />

      <TaskPaginationSection
        title={getTaskTitle(activeSection)}
        totalSteps={totalSteps}
        currentStep={activeSection}
        onScrollUp={() => scrollToSection("up")}
        onScrollDown={() => scrollToSection("down")}
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
                <div className="row-span-1 w-full h-full flex flex-col items-center justify-center pb-11">
                  <h1 className="text-white text-[36px] font-semibold">
                    {mission.name}
                  </h1>
                </div>
                <div className="flex justify-center items-center">
                  <Button
                    variant={"default"}
                    className="w-[250px] h-[50px]  rounded-md flex items-center text-[#6C50E0] font-bold justify-center gap-2 bg-gradient-to-t from-[#EDDDFF] to-[#FCFAFF]"
                    onClick={() => handleButtonScroll(section2Ref)}
                  >
                    See introduction <Mouse />
                  </Button>
                </div>
              </div>
            </div>
          </StartSection>
        </div>

        <div ref={section2Ref} className="snap-start h-screen flex ">
          <div className="container mx-auto py-16 mt-[85px] flex flex-col items-center">
            <h1 className="text-erify-dark max-w-[800px] text-[40px] font-bold text-center py-5">
              {mission.name}
            </h1>
            <p className="text-center text-[25px] font-light w-[45%]">
              {mission.description}
            </p>
            <p className="pt-10 pb-12 flex items-center gap-2">
              <Button
                variant={"default"}
                className="w-[250px] h-[50px] rounded-md flex items-center text-white font-bold justify-center gap-2 bg-gradient-to-t from-[#B276FF] to-[#7C2BDA]"
                onClick={() => handleButtonScroll(section3Ref)}
              >
                See instructions <Mouse />
              </Button>
            </p>
            <div className="flex justify-center items-center w-full rounded-[15px] overflow-hidden relative">
              <VideoIntro />
            </div>
          </div>
        </div>

        <div ref={section3Ref} className="snap-start h-screen">
          <MissionInstruction
            missionName={mission.name}
            title={mission.description}
            missionInstruction={mission.instruction}
            handleButtonScroll={() => handleButtonScroll(section4Ref)}
          />
        </div>
        <div ref={section4Ref} className="snap-start h-screen">
          <VideoQuestions
            questions={mission.questions}
            missionType={mission.type}
            missionFile={"/sample.mp4"}
            missionId={mission.id}
            isMissionComplete={isMissionComplete}
          />
        </div>
      </div>
    </div>
  );
};

export default VideoMission;
