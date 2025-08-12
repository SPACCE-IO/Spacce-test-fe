"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Mouse } from "lucide-react";
import AnimatedMissionBadge from "@/app/components/AnimatedMissionBadge";
import Navbar from "@/app/components/navbar";
import StartSection from "@/app/components/start-section";
import { Button } from "@/components/ui/button";
import { useLogResponseMutation } from "@/app/store/services/missionManagement";
import { getAuthToken } from "@/utils/auth";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import PdfIntro from "./pdf-intro";
import PdfQuestions from "./pdf-questions";
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
    value: string;
  }>;
  documents: MissionDocument[];
  rewards: any[];
}

interface StandardMissionComponentProps {
  mission: MissionProps;
}

const PdfMission = ({ mission }: StandardMissionComponentProps) => {
  const [activeSection, setActiveSection] = useState<number>(0);
  const totalSteps = 4;
  const containerRef = useRef<HTMLDivElement>(null!);
  const startSectionRef = useRef<HTMLDivElement>(null!);
  const section2Ref = useRef<HTMLDivElement>(null!);
  const section3Ref = useRef<HTMLDivElement>(null!);
  const section4Ref = useRef<HTMLDivElement>(null!);
  const section5Ref = useRef<HTMLDivElement>(null!);
  const router = useRouter();
  const token = getAuthToken();

  const [logResponse, logResponseProps] = useLogResponseMutation();

  // Check if mission is complete based on status
  const isMissionComplete = mission?.status === 2 || mission?.status === 1;

  const handleMissionSubmit = (answers: { [key: number]: string }) => {
    console.log("Submitted answers:", answers);
    router.push("/congratulation");
  };

  // Handle individual question submission
  const handleQuestionSubmit = async (questionId: number, answer: string) => {
    try {
      await logResponse({
        authToken: token,
        body: {
          questionId: questionId,
          answer: answer
        },
        id: questionId.toString()
      });
    } catch (error) {
      console.error("Failed to submit answer:", error);
    }
  };

  function getFileByFileName(files: { fileName: string; name: string }[], fileName: string) {
    return files?.find(file => file.fileName === fileName) || null;
  }

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




  // Show loading if mission data is not available
  if (!mission) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading mission...</div>
      </div>
    );
  }

  return (
    <div className="h-screen  overflow-hidden">
      <Navbar />
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

        <div
          ref={section2Ref}
          className="snap-start h-screen flex "
        >
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
              <PdfIntro />
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
          <PdfQuestions
            questions={mission.questions}
            missionType={mission.type}
            missionFile={'/dummy.pdf'}
            missionId={mission.id}
            isMissionComplete={isMissionComplete}
          />
        </div>
      </div>
    </div>
  );
};

export default PdfMission;

interface MissionSearchProps {
  title: string,
  missionInstruction: string,
  missionName: string,
  children?: React.ReactNode
  handleButtonScroll?: ( ) => void
}

const MissionInstruction = ( { title,handleButtonScroll, missionInstruction, missionName, children }: MissionSearchProps ) => {

  return (
    <section className="relative min-h-screen justify-center -my-6 flex flex-col p-5 mx-auto container ">
       
        <div className="w-full p-10">
          {/* Mission Name */}
          <p className="text-gray-600 text-sm mb-2">Why I Woke Up</p>
          
          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Mission Task
          </h1>
          
          {/* Description */}
          <p className="text-gray-700 text-base leading-relaxed max-w-xl mb-12">
            Have a look at the infographic / pdf to get a better idea on how to submit your tested 
            concept. Your task today is to schedule time in your diary over the next 6 months to work 
            on this. Please schedule a minimum of 2 hours a month. This mission is your initiation into 
            our curious club. Get ready to innovate, learn and grow
          </p>
          
          <div className="flex absolute bottom-28 w-full mx-auto  justify-center items-center ">
                  <Button
                    variant={"default"}
              className="w-[250px] h-[50px] rounded-md flex items-center text-white font-bold justify-center gap-2 bg-gradient-to-t from-[#B276FF] to-[#7C2BDA]"
                    onClick={handleButtonScroll}
                  >
                    Start Mission <Mouse />
                  </Button>
                </div> 
        </div>
  </section>
  )
}


interface TaskPaginationSectionProps {
  title?: string;
  totalSteps?: number;
  currentStep?: number;
  onScrollUp: () => void
  onScrollDown: () => void
}

const TaskPaginationSection: React.FC<TaskPaginationSectionProps> = ({
  title,
  totalSteps,
  currentStep,
  onScrollUp, 
  onScrollDown
}) => {
  console.log("TaskPaginationSection rendered with title:", title, "totalSteps:", totalSteps, "currentStep:", currentStep);
  return (
    <div className="right-0 z-10 fixed h-[90vh] w-[122px] pt-10 pb-[60px] pr-[32px] bg-center bg-no-repeat bg-fixed bg-opacity-50">
      <p
        className={`text-[12px] ${
          title?.toLocaleLowerCase() == "congratulations" && "text-white"
        } text-colors-primarypurpurple opacity-45 text-end pb-[12px]`}
      >
        {title}
      </p>
      <div className="flex justify-end items-end gap-2 w-full">
        <div className="grid grid-flow-row gap-2 w-[37px]">
          {title !== "" && totalSteps !== undefined && currentStep !== undefined
            ? Array.from({ length: totalSteps }).map((_, index) =>
                title?.toLocaleLowerCase() === "congratulations" ? (
                  <div
                    key={index}
                    className={`h-1 w-full rounded-[1px] ${
                      index === currentStep - 1
                        ? "bg-white"
                        : "bg-white opacity-40"
                    }`}
                  ></div>
                ) : (
                  <div
                    key={index}
                    className={`h-1 w-full rounded-[1px] ${
                      index === currentStep - 1
                        ? "bg-colors-primarypurpurple opacity-45 "
                        : "bg-colors-primarypurpurple opacity-10"
                    }`}
                  ></div>
                )
              )
            : ""}
        </div>
      </div>
          {
            currentStep!== undefined &&
              currentStep > 1 && <div className="absolute z-30 bottom-10 right-10">
               <div className=" grid-cols-2 relative z-50  grid w-max flex-col justify-end items-end bg-colors-buttonNav bg-opacity-20 rounded-[4px]">
      <Button onClick={onScrollUp} className=" w-[40px] h-[40px] rounded-l-[4px] rounded-r-none bg-transparent border border-colors-buttonNav border-opacity-30 hover:bg-colors-buttonNav hover:bg-opacity-30">
        <FaCaretUp height={24} width={24} color="#5C28DF" className=" w-[40px] h-[40px] rounded-[4px] bg-transparent" />
      </Button>
      <Button onClick={onScrollDown} className=" w-[40px] h-[40px] rounded-r-[4px] rounded-l-none bg-transparent border border-colors-buttonNav border-opacity-30 hover:bg-colors-buttonNav hover:bg-opacity-30">
        <FaCaretDown height={24} width={24} color="#5C28DF" className=" w-[40px] h-[40px] rounded-[4px] bg-transparent" />
      </Button>
    </div>
              </div>
            
          }
    </div>
  );
};