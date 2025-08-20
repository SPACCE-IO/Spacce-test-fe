"use client";
import { Button } from "@/src/components/ui/button";
import { ChevronUp, ChevronDown, Mouse } from "lucide-react";
import React, { useState, useRef } from "react";

interface Question {
  id: number;
  question: string;
  answer: string;
  hint?: string;
  type: "text" | "longText";
}

interface MissionTasksTextProps {
  questions: Question[];
  onSubmit: (answers: { [key: number]: string }) => void;
}

const MissionTasksText = ({ questions, onSubmit }: MissionTasksTextProps) => {
  const [activeQuestionId, setActiveQuestionId] = useState<number | null>(null);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [showHintId, setShowHintId] = useState<number | null>(null);
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

  const handleSubmit = () => {
    onSubmit(answers);
  };

  const isAllQuestionsAnswered = () => {
    return questions.every((q) => answers[q.id] && answers[q.id].trim() !== "");
  };

  return (
    <section className="w-full h-screen flex flex-col items-start justify-center pt-40">
      <div className=" container mx-auto">
        <div className="grid grid-cols-5 w-full h-[calc(100vh-12rem)]">
          <div className="col-span-3 flex flex-col h-full">
            <div
              ref={questionsContainerRef}
              className="flex-1 overflow-y-auto pr-4 space-y-6 pt-6 max-h-[calc(100vh-16rem)]"
            >
              {questions.map((question, index) => (
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
                    <div className=" pb-6 border-t pt-4">
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

            <div className="py-6 flex justify-end">
              <Button
                variant={"default"}
                className="w-[250px] h-[50px] flex items-center justify-center gap-2 bg-[#36CEF8]"
                onClick={handleSubmit}
                disabled={!isAllQuestionsAnswered()}
              >
                Submit <Mouse />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionTasksText;
