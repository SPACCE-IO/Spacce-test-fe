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
import { Button } from "@/src/components/ui/button";
// import MissionInstruction from "@/app/components/mission-instruction";
import { missionsDummy } from "@/src/utils/question-types";
import PdfPerspectiveView from "@/app/components/pdf-perspective-view";
import PDFMissionQuestions from "./PDFMissionQuestions";

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

  const handleMissionSubmit = (answers: { [key: number]: string }) => {
    console.log("Submitted answers:", answers);
    router.push("/congratulation");
    // Handle the submission logic here
  };
  const mission = missionsDummy[5];

  const handleClick = () => {
    router.push("/dashboard?tab=current-mission");
  };

  function getFileByFileName(
    files: { fileName: string; name: string }[],
    fileName: string
  ) {
    return files?.find((file) => file.fileName === fileName) || null;
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
      sectionRef.current.scrollIntoView({ behavior: "smooth" });
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
        return "Meet a Legend";
      case 3:
        return "Meet a Legend";
      default:
        return "";
    }
  };

  return (
    <div className="h-screen overflow-hidden">
      <Navbar />
      <AnimatedMissionBadge
        mission={mission.missionType}
        missionStatus={mission.isComplete ? "complete" : "incomplete"}
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
                  {/* <p className="text-white text-[16px] font-semibold">
                    Mission Name
                  </p> */}
                  <h1 className="text-white text-[36px] font-semibold">
                    {mission.missionName}
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
          className="snap-start h-screen flex justify-center items-center"
        >
          <div className="container mx-auto py-16 flex flex-col items-center">
            {/* <p className="text-black opacity-30 font-bold">Mission Name</p> */}
            <h1 className="text-erify-dark text-[56px] font-bold text-center py-5">
              {mission.missionName}
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
              <PdfPerspectiveView pdfSrc="/dummy.pdf" />
            </div>
          </div>
        </div>

        <div ref={section3Ref} className="snap-start h-screen">
          <MissionInstruction
            missionName={mission.missionName}
            title={mission.description}
            missionInstruction={mission.instruction}
            handleButtonScroll={() => handleButtonScroll(section4Ref)}
          />
        </div>
        <div ref={section4Ref} className="snap-start h-screen">
          <PDFMissionQuestions
            questions={mission.questions}
            onSubmit={handleMissionSubmit}
            missionType={mission.missionType.missionType}
            fileUrl={
              getFileByFileName(mission.documents, "MISSION_PDF")?.name ?? ""
            }
          />
        </div>
      </div>
    </div>
  );
};

export default MissionPdf;

interface MissionSearchProps {
  title: string;
  missionInstruction: string;
  missionName: string;
  children?: React.ReactNode;
  handleButtonScroll?: () => void;
}

const MissionInstruction = ({
  title,
  handleButtonScroll,
  missionInstruction,
  missionName,
  children,
}: MissionSearchProps) => {
  return (
    <section className="relative min-h-screen justify-center -my-6 flex flex-col p-5 mx-auto container ">
      {/* <div className="flex flex-col gap-10 items-start align-top justify-start ">
      <p className=" text-black opacity-30" >Mission Name: {missionName}</p>
      <h2 className=" text-black opacity-30 text-[36px] font-semibold py-5">
        {title}
      </h2>
    </div> */}
      {children}

      <div className="grid grid-cols-5 mb-10 gap-10 text-2xl font-light">
        <div className="col-span-4">
          <div className="grid grid-cols-6">
            <p className="col-span-6">{missionInstruction}</p>
          </div>
        </div>
      </div>
      <div className="flex absolute bottom-28 w-full mx-auto  justify-center items-center ">
        <Button
          variant={"default"}
          className="w-[250px] h-[50px] rounded-md flex items-center text-white font-bold justify-center gap-2 bg-gradient-to-t from-[#B276FF] to-[#7C2BDA]"
          onClick={handleButtonScroll}
        >
          Start Mission <Mouse />
        </Button>
      </div>
    </section>
  );
};
