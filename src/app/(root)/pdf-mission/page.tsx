"use client";
import AnimatedMissionBadge from "@/app/components/AnimatedMissionBadge";
import EndSectionGradient from "@/app/components/end-section-gradient";
import MissionBadge from "@/app/components/mission-badge";
import MissionPDFView from "@/app/components/mission-pdf-vew";
import MissionSearch from "@/app/components/mission-search";
import MissionSearchPdf from "@/app/components/mission-search-pdf";
import Navbar from "@/app/components/navbar";
import PdfPerspectiveView from "@/app/components/pdf-perspective-view";
import ScrollSection from "@/app/components/ScrollSection";
import StartSection from "@/app/components/start-section";
import TaskPaginationSection from "@/app/components/TaskPaginationSection";
import TitleTopSection from "@/app/components/TitleTop";
import { Button } from "@/src/components/ui/button";
import { Mouse } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";

const PdfMission = () => {
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

        <div ref={section2Ref} className="snap-start h-screen">
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
            <div className="flex justify-center items-center w-full rounded-[15px] overflow-hidden relative">
              <PdfPerspectiveView pdfSrc="/dummy.pdf" />
            </div>
          </div>
        </div>

        <div ref={section3Ref} className="snap-start h-screen">
          <MissionSearchPdf
            title="Mission Title"
            missionDescription="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur."
          ></MissionSearchPdf>
        </div>

        <div ref={section4Ref} className="snap-start h-screen">
          <MissionPDFView
            missionTitle="Mission Title"
            pdfSrc="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
          ></MissionPDFView>
        </div>

        <div ref={section5Ref} className="snap-start h-screen">
          <MissionSearch
            title="Mission Title"
            missionDescription="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur."
          ></MissionSearch>
        </div>

        <div ref={section6Ref} className="snap-start h-screen">
          <MissionPDFView
            missionTitle="Mission Title"
            pdfSrc="/dummy.pdf"
          ></MissionPDFView>
        </div>

        <div ref={section7Ref} className="snap-end">
          <EndSectionGradient>
            <div className=" container mx-auto flex flex-col items-center justify-center gap-10">
              <MissionBadge mission="pdf" missionStatus="complete" />
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

export default PdfMission;
