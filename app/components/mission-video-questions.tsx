"use client";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown, Maximize2, X, Mouse } from "lucide-react";
import React, { useState, useRef } from "react";

interface Question {
  id: number;
  question: string;
  answer: string;
  hint?: string;
  type: "text" | "longText";
}

interface MissionVideoQuestionsProps {
  questions: Question[];
  onSubmit: (answers: { [key: number]: string }) => void;
}

const MissionVideoQuestions = ({
  questions,
  // onSubmit,
}: MissionVideoQuestionsProps) => {
  const [activeQuestionId, setActiveQuestionId] = useState<number | null>(null);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [showHintId, setShowHintId] = useState<number | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const questionsContainerRef = useRef<HTMLDivElement>(null);

  const handleQuestionClick = (questionId: number) => {
    setActiveQuestionId(activeQuestionId === questionId ? null : questionId);

    setTimeout(() => {
      const questionElement = document.getElementById(`question-${questionId}`);
      if (questionElement && questionsContainerRef.current) {
        const containerRect =
          questionsContainerRef.current.getBoundingClientRect();
        const elementRect = questionElement.getBoundingClientRect();

        if (elementRect.bottom > containerRect.bottom) {
          questionElement.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }
    }, 100);
  };

  const toggleHint = (questionId: number) => {
    setShowHintId(showHintId === questionId ? null : questionId);
  };

  const handleAnswerChange = (questionId: number, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  // Sample questions for demo
  const sampleQuestions = questions.length > 0 ? questions : [
    {
      id: 1,
      question: "What is the main topic of this video?",
      answer: "",
      hint: "Think about the key themes discussed in the introduction.",
      type: "text" as const,
    },
    {
      id: 2,
      question: "Describe the key takeaways from this session.",
      answer: "",
      hint: "Focus on the actionable insights provided.",
      type: "longText" as const,
    },
    {
      id: 3,
      question: "How can you apply this learning in your role?",
      answer: "",
      type: "longText" as const,
    },
  ];

  // When drawer is open - matches the PDF viewer layout
  if (isDrawerOpen) {
    return (
      <div className="relative z-50 h-full bg-white  flex flex-col mx-auto ">
        {/* Header */}
        <header className="flex items-center w-full justify-between px-8 py-4 bg-white">
          <div className="flex w-full items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-black rounded"></div>
              <span className="font-bold text-lg">LOGO</span>
            </div>
            <button
              onClick={toggleDrawer}
              className="p-2 hover:bg-gray-100 ml-auto rounded-lg transition-colors"
              aria-label="Close fullscreen"
            >
              <X className="w-8 h-8" />
            </button>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex h-full">
          {/* Left Sidebar */}
          <div className="w-80 bg-[#A9A9A9] p-8 overflow-y-auto">
            <h2 className="text-xl font-bold mb-6">Leadership Blueprints</h2>
            <p className="text-sm text-gray-600 mb-4">
              Follow the link to view the relevant leadership blueprints and thereafter match the pictures and names
            </p>
            {/* <div className="flex justify-center mt-8">
              <ChevronDown className="w-8 h-8" />
            </div> */}
          </div>

          {/* Center Content */}
          <div className="flex-1 flex flex-col px-12 py-8">
            <div className="text-left mx-48 mb-8">
              <p className="text-gray-400 text-sm mb-2">Mission Name</p>
              <h1 className="text-2xl font-bold">Joining the Curious Club</h1>
            </div>

            {/* Video Container */}
            <div className="flex-1 flex items-center justify-center">
              <div className="w-full max-w-4xl">
                <div className="border-2 border-dashed border-gray-300 bg-gray-50 aspect-video rounded-lg flex items-center justify-center">
                  <span className="text-gray-500">Video Placeholder</span>
                </div>
              </div>
            </div>

            {/* Bottom Button */}
            <div className="flex justify-center mt-8">
              <Button onClick={toggleDrawer} 
              variant={"default"}
              className="w-[250px] h-[50px] flex items-center justify-center gap-2 bg-[#36CEF8]"
                    
              >
                Return to mission <Mouse />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default view when drawer is closed
  return (
    <section className="w-full h-screen flex flex-col justify-center">
      <div className="container mx-auto">
        <div className="grid grid-cols-5 w-full pl-24 h-[calc(100vh-20rem)]">
          <div className="col-span-3 flex flex-col h-full justify-center">
            <div className="relative w-[90%]">
              {/* Video here */}
              <div className="border-2 border-dashed border-black bg-gray-50 aspect-video rounded-[15px] flex items-center justify-center">
                Video Placeholder
                <button
                  onClick={toggleDrawer}
                  className="absolute bottom-4 right-4 p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
                  aria-label="Open fullscreen"
                >
                  <Maximize2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="col-span-2 flex flex-col h-full">
            <div
              ref={questionsContainerRef}
              className="flex-1 overflow-y-auto flex flex-col justify-center pr-4 space-y-6 pt-6 max-h-[calc(100vh-16rem)]"
            >
              {sampleQuestions.map((question, index) => (
                <div
                  id={`question-${question.id}`}
                  key={question.id}
                  className="w-full bg-white overflow-hidden"
                >
                  <div
                    className="p-2 cursor-pointer flex justify-between items-center hover:bg-gray-50"
                    onClick={() => handleQuestionClick(question.id)}
                  >
                    <div className="flex flex-col gap-2">
                      <span className="text-sm font-semibold text-gray-500">
                        Question {index + 1}
                      </span>
                      <h3 className="text-[13px] text-black font-bold">
                        {question.question}
                      </h3>
                    </div>
                    <span className="text-gray-500">
                      {activeQuestionId === question.id ? (
                        <ChevronUp />
                      ) : (
                        <ChevronDown />
                      )}
                    </span>
                  </div>

                  {activeQuestionId === question.id && (
                    <div className="px-6 pb-6 border-t pt-4">
                      {question.hint && (
                        <div className="mb-3">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              toggleHint(question.id);
                            }}
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                          >
                            {showHintId === question.id
                              ? "Hide Hint"
                              : "Show Hint"}
                          </button>
                          {showHintId === question.id && (
                            <p className="text-sm text-gray-600 mt-2 pl-4 border-l-2 border-blue-500">
                              {question.hint}
                            </p>
                          )}
                        </div>
                      )}
                      {question.type === "longText" ? (
                        <textarea
                          className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          rows={4}
                          value={answers[question.id] || ""}
                          onChange={(e) =>
                            handleAnswerChange(question.id, e.target.value)
                          }
                          placeholder="Enter your answer..."
                        />
                      ) : (
                        <input
                          type="text"
                          className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={answers[question.id] || ""}
                          onChange={(e) =>
                            handleAnswerChange(question.id, e.target.value)
                          }
                          placeholder="Enter your answer..."
                        />
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionVideoQuestions;