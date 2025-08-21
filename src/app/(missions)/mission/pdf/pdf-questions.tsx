"use client";
import { Button } from "@/src/components/ui/button";
import {
  ChevronUp,
  ChevronDown,
  Maximize2,
  X,
  Mouse,
  Star,
  Search,
} from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import PdfViewer from "@/src/components/mission/PdfViewer";
import { QuestionRenderer } from "@/src/components/questions/QuestionRenderer";
import { useSession } from "next-auth/react";
import { useLogResponseMutation } from "@/src/services/missionManagement";

interface Option {
  id: string;
  text: string;
  isCorrect?: boolean;
  matchPosition?: number;
}

interface ImageOption {
  id: string;
  imageUrl: string;
  altText: string;
  caption: string;
  isCorrect?: boolean;
}

interface MatchingItem {
  id: string;
  imageUrl: string;
  altText: string;
  caption: string;
  matchPosition: number;
}

interface Question {
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
  status: number; // 0 = not attempted/incorrect, 1 = correct
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

interface ApiResponse {
  note: string;
  isCorrectAnswer: boolean;
}

interface PdfQuestionsProps {
  questions: Question[];
  missionType: string;
  missionId: number;
  isMissionComplete: boolean;
  missionFile?: string;
}

const PdfQuestions = ({
  questions,
  missionType,
  missionId,
  isMissionComplete,
  missionFile,
}: PdfQuestionsProps) => {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [questionStatuses, setQuestionStatuses] = useState<{
    [key: number]: number;
  }>({});
  const [showHintId, setShowHintId] = useState<number | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<{
    [key: number]: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseMessage, setResponseMessage] = useState<string>("");
  const [showResponse, setShowResponse] = useState(false);
  const [missionStatus, setMissionStatus] = useState(1);
  const { data: session } = useSession();

  const questionsContainerRef = useRef<HTMLDivElement>(null);
  const [logResponse] = useLogResponseMutation();

  // Initialize question statuses and answers from props
  useEffect(() => {
    const initialStatuses: { [key: number]: number } = {};
    const initialAnswers: { [key: number]: string } = {};

    questions.forEach((question) => {
      initialStatuses[question.id] = question.status;

      if (question.userAnswer && question.userAnswer !== "{}") {
        try {
          const parsedAnswer =
            question.userAnswer.startsWith("{") ||
            question.userAnswer.startsWith("[")
              ? JSON.parse(question.userAnswer)
              : question.userAnswer;
          initialAnswers[question.id] =
            typeof parsedAnswer === "string"
              ? parsedAnswer
              : JSON.stringify(parsedAnswer);
        } catch {
          initialAnswers[question.id] = question.userAnswer;
        }
      }
    });

    setQuestionStatuses(initialStatuses);
    setAnswers(initialAnswers);
  }, [questions]);

  if (isMissionComplete) {
    console.log("Mission is already complete. No further actions required.");
  }

  const displayQuestions = questions?.length > 0 ? questions : [];
  const currentQuestion = displayQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === displayQuestions.length - 1;

  // Check if we can proceed to next question
  const canGoNext =
    currentQuestion &&
    (questionStatuses[currentQuestion.id] === 1 || // Already answered correctly
      !currentQuestion.isRequired || // Not required
      (answers[currentQuestion.id] &&
        answers[currentQuestion.id].trim() !== "")); // Has an answer

  // Check if current question is already answered correctly
  const isCurrentQuestionCorrect = () => {
    return questionStatuses[currentQuestion?.id] === 1;
  };

  // Submit current answer (only if not already correct)
  const submitCurrentAnswer = async () => {
    if (!currentQuestion) return false;

    const questionId = currentQuestion.id;
    const answer = answers[questionId];

    // If question is already answered correctly, don't submit again
    if (questionStatuses[questionId] === 1) {
      return true;
    }

    // Validate required questions
    if (currentQuestion.isRequired && (!answer || answer.trim() === "")) {
      setValidationErrors((prev) => ({
        ...prev,
        [questionId]: "This question is required",
      }));
      return false;
    }

    setIsSubmitting(true);
    setShowResponse(false);

    try {
      const payload = {
        questionId,
        answer: answer ? answer.trim() : "",
      };

      console.log("Submitting answer:", payload);

      const response = await logResponse({
        authToken: session?.accessToken,
        body: payload,
        id: missionId,
      }).unwrap();

      const apiResponse = response as ApiResponse;

      // Update question status based on response
      const newStatus = apiResponse.isCorrectAnswer ? 1 : 0;
      setQuestionStatuses((prev) => ({
        ...prev,
        [questionId]: newStatus,
      }));

      // Show response message
      setResponseMessage(apiResponse.note);
      setShowResponse(true);

      // Clear validation errors
      setValidationErrors((prev) => {
        const updated = { ...prev };
        delete updated[questionId];
        return updated;
      });

      // Auto-hide response message after 3 seconds
      setTimeout(() => {
        setShowResponse(false);
      }, 3000);

      return true;
    } catch (error) {
      console.error("Error submitting answer:", error);
      setResponseMessage("Failed to submit answer. Please try again.");
      setShowResponse(true);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check mission completion and redirect accordingly
  const checkMissionCompletion = () => {
    const allQuestionsCorrect = questions.every((question) => {
      return !question.hasCorrectAnswer || questionStatuses[question.id] === 1;
    });

    if (allQuestionsCorrect) {
      setMissionStatus(2);
      router.push("/congratulation");
    } else {
      setMissionStatus(1);
      router.push("/mission-fail");
    }
  };

  // Handle next question
  const handleNext = async () => {
    if (!currentQuestion) return;

    // If question is already answered correctly (status = 1), just move to next
    if (isCurrentQuestionCorrect()) {
      if (isLastQuestion) {
        checkMissionCompletion();
      } else {
        // Move to next question without submitting
        setCurrentQuestionIndex((prev) => prev + 1);
        setResponseMessage("");
        setShowResponse(false);
      }
      return;
    }

    // If question is not answered correctly, submit the answer
    const success = await submitCurrentAnswer();
    if (success) {
      if (isLastQuestion) {
        // Check if all questions are answered correctly
        checkMissionCompletion();
      } else {
        // Move to next question only if submission was successful
        setCurrentQuestionIndex((prev) => prev + 1);
        setResponseMessage("");
        setShowResponse(false);
      }
    }
  };

  // Handle previous question
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      setValidationErrors({});
      setShowResponse(false);
    }
  };

  // Allow retrying incorrect questions
  const handleRetryQuestion = () => {
    if (!currentQuestion) return;

    // Reset current question status to 0 (not attempted/incorrect)
    setQuestionStatuses((prev) => ({
      ...prev,
      [currentQuestion.id]: 0,
    }));

    // Clear the answer
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: "",
    }));

    setShowResponse(false);
    setResponseMessage("");
    setValidationErrors((prev) => {
      const updated = { ...prev };
      delete updated[currentQuestion.id];
      return updated;
    });
  };

  const toggleHint = (questionId: number) => {
    setShowHintId(showHintId === questionId ? null : questionId);
  };

  const handleAnswerChange = (questionId: number, value: string) => {
    // Only allow changes if question is not already correct
    if (questionStatuses[questionId] === 1) return;

    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));

    // Clear validation error when user provides an answer
    if (validationErrors[questionId] && value.trim() !== "") {
      setValidationErrors((prev) => {
        const updated = { ...prev };
        delete updated[questionId];
        return updated;
      });
    }
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  // Render content based on mission type
  const renderContent = () => {
    if (missionType === "PDF_MISSION") {
      return (
        <div className="w-full h-full min-h-[600px]">
          <PdfViewer toggleDrawer={()=> setIsDrawerOpen(!isDrawerOpen)} url={'https://spacce-dev-store.s3.eu-west-1.amazonaws.com/file-sample_150kB.pdf'} />
        </div>
      );
    } else if (missionType === "VIDEO_MISSION") {
      return (
        <video controls className="w-full h-full object-cover rounded-lg">
          <source src={missionFile} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      );
    } else {
      return (
        <div className="border-2 border-dashed border-gray-300 bg-gray-50 aspect-video rounded-lg flex items-center justify-center">
          <span className="text-gray-500">
            {missionType === "PDF_MISSION"
              ? "PDF Placeholder"
              : "Video Placeholder"}
          </span>
        </div>
      );
    }
  };

  const getButtonText = () => {
    if (isSubmitting) return "Submitting...";
    if (isLastQuestion) {
      return isCurrentQuestionCorrect() ? "Complete Mission" : "Submit Mission";
    }
    return isCurrentQuestionCorrect() ? "Next Question" : "Submit & Next";
  };

  if (!currentQuestion) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-gray-600 text-xl">No questions available</div>
      </div>
    );
  }

  // When drawer is open - matches the PDF viewer layout
  if (isDrawerOpen) {
    return (
      <div className="relative z-50 h-full bg-[#6B7280]/40 backdrop-blur-[2px] flex flex-col mx-auto">
        {/* Main Content */}
        <div className="flex h-full">
          {/* Left Sidebar */}
          <div className="w-96 p-8 overflow-y-auto">
            {/* Additional content can go here */}
          </div>

          {/* Center Content */}
          <div className="flex-1 flex bg-white flex-col px-12 py-8">
            <div className="flex flex-row mb-8">
              <div>
                <p className="text-gray-400 text-sm mb-2">Mission Name</p>
                <h1 className="text-2xl font-bold">Mission Task</h1>
              </div>
              <button
                onClick={toggleDrawer}
                className="p-2 hover:bg-gray-100 ml-auto rounded-lg transition-colors"
                aria-label="Close fullscreen"
              >
                <X className="w-8 h-8" />
              </button>
            </div>

            {/* Content Container */}
            <div className="flex-1 flex items-center justify-center min-h-0">
              <div className="w-full h-full max-w-4xl">{renderContent()}</div>
            </div>

            {/* Bottom Button */}
            <div className="flex justify-center mt-8">
              <Button
                onClick={toggleDrawer}
                variant={"default"}
                className="w-[250px] h-[50px] rounded-md flex items-center text-[#6C50E0] font-bold justify-center gap-2 bg-gradient-to-t from-[#EDDDFF] to-[#FCFAFF]"
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
        <div className="grid grid-cols-6 w-full pl-24">
          <div className="col-span-3 flex flex-col h-full justify-center">
            <div className="relative w-[90%]">
              {/* Content here */}
              <div className="aspect-video rounded-[15px] flex items-center justify-center relative">
                {renderContent()}
                {/* <button
                  onClick={toggleDrawer}
                  className="absolute bottom-4 right-4 p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
                  aria-label="Open fullscreen"
                >
                  <Maximize2 className="w-5 h-5" />
                </button> */}
              </div>
            </div>
          </div>

          <div className="col-span-3 flex flex-col h-full">
            <div
              ref={questionsContainerRef}
              className="flex-1 overflow-y-auto flex flex-col justify-center pr-4 space-y-6 pt-6 max-h-[calc(100vh-16rem)]"
            >
              {/* Current Question */}
              <div className={`w-full bg-white rounded-lg`}>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    {questionStatuses[currentQuestion.id] === 1 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        ✓ Correct
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-black mb-4">
                    {currentQuestion.question}
                  </h3>

                  {validationErrors[currentQuestion.id] && (
                    <p className="text-sm text-red-500 font-medium mb-4">
                      {validationErrors[currentQuestion.id]}
                    </p>
                  )}

                  {currentQuestion.hint && (
                    <div className="mb-4">
                      <button
                        onClick={() => toggleHint(currentQuestion.id)}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        {showHintId === currentQuestion.id
                          ? "Hide Hint"
                          : "Show Hint"}
                      </button>
                      {showHintId === currentQuestion.id && (
                        <p className="text-sm text-gray-600 mt-2 pl-4 border-l-2 border-blue-500">
                          {currentQuestion.hint}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Render Question Input using QuestionRenderer */}
                  <QuestionRenderer
                    question={currentQuestion}
                    value={answers[currentQuestion.id] || ""}
                    onChange={(value) =>
                      handleAnswerChange(currentQuestion.id, value)
                    }
                    disabled={isSubmitting}
                    isAnsweredCorrectly={
                      questionStatuses[currentQuestion.id] === 1
                    }
                    isSubmitting={isSubmitting}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-center mt-8 space-x-4">
        {/* Previous button */}
        {currentQuestionIndex > 0 && (
          <Button
            onClick={handlePrevious}
            variant="default"
            className="w-[200px] h-[50px] rounded-md flex items-center text-[#6C50E0] font-bold justify-center gap-2 bg-gradient-to-t from-[#EDDDFF] to-[#FCFAFF]"
            disabled={isSubmitting}
          >
            Previous
          </Button>
        )}

        {/* Next/Submit button */}
        <Button
          onClick={handleNext}
          disabled={isSubmitting || !canGoNext}
          variant="default"
          className="w-[250px] h-[50px] rounded-md flex items-center text-white font-bold justify-center gap-2 bg-gradient-to-t from-[#B276FF] to-[#7C2BDA] disabled:opacity-50"
        >
          {getButtonText()} {isLastQuestion && <Mouse />}
        </Button>
      </div>
    </section>
  );
};

export default PdfQuestions;
