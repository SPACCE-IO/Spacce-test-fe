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

  const sampleQuestions0 = [
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
            {/* <p className="text-black opacity-30 font-bold">Mission Name</p> */}
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
            missionName="Meet a Legend Badge"
            title=""
            missionInstruction="Have a look at the infographic / pdf to get a better idea on how to submit your tested concept. Your task today is to schedule time in your diary over the next 6 months to work on this. Please schedule a minimum of 2 hours a month. This msision is your initaition into our curious club. Get ready to innovate, learn and grow"
            handleButtonScroll={() => handleButtonScroll(section4Ref)}
          />
        </div>
        <div ref={section4Ref} className="snap-start h-screen">
          <MissionVideoQuestions
            questions={sampleQuestions0}
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


const sampleQuestions = [
  // OPEN-ENDED QUESTIONS (Survey/Poster missions)
  
  // Short Answer (S) - Open-ended
  {
    questionTypeId: "S",
    description: "Basic information gathering",
    question: "What is your favorite color?",
    hint: "Enter a single word or short phrase",
    sequence: 1,
    hasCorrectAnswer: false, // Open-ended
    correctAnswer: null,
    userAnswer: "",
    isRequired: true,
    characterLimit: 50,
    placeholder: "e.g., Blue, Red, Green",
  },

  // Long Answer (L) - Open-ended
  {
    questionTypeId: "L",
    description: "Detailed feedback collection",
    question: "Describe your experience with our customer service team.",
    hint: "Please provide detailed feedback about your interaction",
    sequence: 2,
    missionType: "survey",
    hasCorrectAnswer: false, // Open-ended
    correctAnswer: null,
    userAnswer: "",
    isRequired: true,
    points: 0,
    characterLimit: 500,
    placeholder: "Share your detailed thoughts and experiences...",
  },

  // QUESTIONS WITH CORRECT ANSWERS (Quiz/Assessment missions)
  
  // Multiple Choice (M) - Has correct answer
  {
    questionTypeId: "M",
    description: "Knowledge assessment",
    question: "Which of the following are programming languages?",
    hint: "Select all that apply",
    sequence: 3,
    hasCorrectAnswer: true, // Has definitive correct answers
    correctAnswer: ["1", "2", "4"], // IDs of correct options
    userAnswer: "",
    isRequired: true,
    options: [
      { id: "1", text: "JavaScript", isCorrect: true },
      { id: "2", text: "Python", isCorrect: true },
      { id: "3", text: "HTML", isCorrect: false },
      { id: "4", text: "Java", isCorrect: true },
      { id: "5", text: "CSS", isCorrect: false }
    ],
    allowMultipleSelection: true,
  },

  // Image Choice (P) - Has correct answer
  {
    questionTypeId: "P",
    description: "Visual identification",
    question: "Which of these animals is a mammal?",
    hint: "Look carefully at each image and select the correct answer",
    sequence: 4,
    hasCorrectAnswer: true, // Has correct answer
    correctAnswer: ["1"], // ID of correct image option
    userAnswer: "",
    isRequired: true,
    imageOptions: [
      { id: "1", imageUrl: "/images/cat.jpg", altText: "Cat", caption: "Cat", isCorrect: true },
      { id: "2", imageUrl: "/images/fish.jpg", altText: "Fish", caption: "Fish", isCorrect: false },
      { id: "3", imageUrl: "/images/bird.jpg", altText: "Bird", caption: "Bird", isCorrect: false },
      { id: "4", imageUrl: "/images/snake.jpg", altText: "Snake", caption: "Snake", isCorrect: false }
    ],
  },

  // Sorting (W) - Has correct answer
  {
    questionTypeId: "W",
    description: "Sequence arrangement",
    question: "Arrange these steps in the correct order for making coffee:",
    hint: "Drag and drop the items to sort them in the correct sequence",
    sequence: 5,
    hasCorrectAnswer: true, // Has correct order
    correctAnswer: ["2", "4", "5", "3", "1"], // Correct order by item IDs
    userAnswer: "",
    isRequired: true,
    sortingItems: [
      { id: "1", text: "Serve coffee", correctOrder: 5 },
      { id: "2", text: "Grind coffee beans", correctOrder: 1 },
      { id: "3", text: "Pour hot water", correctOrder: 4 },
      { id: "4", text: "Boil water", correctOrder: 2 },
      { id: "5", text: "Add coffee to filter", correctOrder: 3 }
    ],
  },

  // RATING QUESTIONS (Can be either open-ended or with targets)
  
  // Star Rating (R) - Open-ended feedback
  {
    questionTypeId: "R",
    description: "Service satisfaction",
    question: "How would you rate your overall experience with our service?",
    hint: "Click on the stars to give your rating (1 = Poor, 5 = Excellent)",
    sequence: 6,
    hasCorrectAnswer: false, // Opinion-based, no correct answer
    correctAnswer: null,
    userAnswer: "",
    isRequired: true,
    maxRating: 5,
  },

  // Number Rating (N) - Open-ended feedback
  {
    questionTypeId: "N",
    description: "Likelihood assessment",
    question: "On a scale of 1 to 10, how likely are you to recommend our product to a friend?",
    hint: "1 = Not at all likely, 10 = Extremely likely",
    sequence: 7,
    hasCorrectAnswer: false, // Opinion-based, no correct answer
    correctAnswer: null,
    userAnswer: "",
    isRequired: true,
    minRating: 1,
    maxRating: 10,
  },

  // User Search (U) - Has correct answer (for assessments)
  {
    questionTypeId: "U",
    description: "Team member selection",
    question: "Who is the current CEO of the company?",
    hint: "Search and select the correct user",
    sequence: 8,
    hasCorrectAnswer: true, // Has a specific correct person
    correctAnswer: "ceo@company.com", // Email or ID of correct user
    userAnswer: "",
    isRequired: true,
    userSearchConfig: {
      searchBy: ["name", "email"],
      allowMultipleUsers: false,
    },
  },

];