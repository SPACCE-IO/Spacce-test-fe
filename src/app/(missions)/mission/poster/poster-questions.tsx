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
import { getAuthToken } from "@/src/utils/auth";
import PdfViewer from "@/src/components/PdfViewer";
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
  missionFile: string;
  isMissionComplete: boolean;
}

const PosterQuestions = ({
  questions,
  missionType,
  missionId,
  missionFile,
  isMissionComplete,
}: PdfQuestionsProps) => {
  const router = useRouter();
  const [activeQuestionId, setActiveQuestionId] = useState<number | null>(null);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [questionStatuses, setQuestionStatuses] = useState<{
    [key: number]: number;
  }>({});
  const [showHintId, setShowHintId] = useState<number | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<{ [key: number]: string }>({});
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [validationErrors, setValidationErrors] = useState<{
    [key: number]: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseMessage, setResponseMessage] = useState<string>("");
  const [showResponse, setShowResponse] = useState(false);
  const [missionStatus, setMissionStatus] = useState(1);
  const [imageOrders, setImageOrders] = useState<{ [key: number]: any[] }>({});

  const questionsContainerRef = useRef<HTMLDivElement>(null);
  const token = getAuthToken();
  const [logResponse] = useLogResponseMutation();
  const QUESTIONS_PER_PAGE = 1;

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
  const totalPages = Math.ceil(displayQuestions.length / QUESTIONS_PER_PAGE);
  const currentQuestions = displayQuestions.slice(
    currentPage * QUESTIONS_PER_PAGE,
    (currentPage + 1) * QUESTIONS_PER_PAGE
  );

  // Submit current answer (only if not already correct)
  const submitCurrentAnswer = async (questionId: number) => {
    const answer = answers[questionId];

    // If question is already answered correctly, don't submit again
    if (questionStatuses[questionId] === 1) {
      return true;
    }

    // Validate required questions
    const question = questions.find((q) => q.id === questionId);
    if (question?.isRequired && (!answer || answer.trim() === "")) {
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
        authToken: token,
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

  const validateCurrentPage = () => {
    const errors: { [key: number]: string } = {};
    let hasErrors = false;

    currentQuestions.forEach((question) => {
      if (question.isRequired && questionStatuses[question.id] !== 1) {
        const answer = answers[question.id];
        if (!answer || answer.trim() === "") {
          errors[question.id] = "This question is required";
          hasErrors = true;
        }
      }
    });

    setValidationErrors(errors);
    return !hasErrors;
  };

  // Check mission completion and redirect accordingly
  const checkMissionCompletion = () => {
    const allQuestionsCorrect = questions.every((question) => {
      return !question.hasCorrectAnswer || questionStatuses[question.id] === 1;
    });

    if (allQuestionsCorrect) {
      setMissionStatus(2);
      setTimeout(() => {
        router.push("/congratulation");
      }, 2000);
    } else {
      setMissionStatus(1);
      setTimeout(() => {
        router.push("/mission-fail");
      }, 2000);
    }
  };

  const handleNextPage = async () => {
    if (!validateCurrentPage()) return;

    // Submit answers for current page questions that haven't been submitted yet
    const submissionPromises = currentQuestions.map(async (question) => {
      const questionId = question.id;

      // If question is already answered correctly, skip submission
      if (questionStatuses[questionId] === 1) {
        return true;
      }

      // If question has an answer and is required or has content, submit it
      const answer = answers[questionId];
      if (answer && answer.trim() !== "") {
        return await submitCurrentAnswer(questionId);
      }

      // If no answer but required, validation should have caught this
      return !question.isRequired;
    });

    const results = await Promise.all(submissionPromises);
    const allSuccessful = results.every((result) => result);

    if (allSuccessful) {
      if (currentPage < totalPages - 1) {
        setCurrentPage(currentPage + 1);
        setActiveQuestionId(null);
        setResponseMessage("");
        setShowResponse(false);
      }
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      setActiveQuestionId(null);
      setValidationErrors({});
    }
  };

  const handleSubmit = async () => {
    if (!validateCurrentPage()) return;

    // Submit any unanswered questions on the current page
    const submissionPromises = currentQuestions.map(async (question) => {
      const questionId = question.id;

      // If question is already answered correctly, skip submission
      if (questionStatuses[questionId] === 1) {
        return true;
      }

      // If question has an answer, submit it
      const answer = answers[questionId];
      if (answer && answer.trim() !== "") {
        return await submitCurrentAnswer(questionId);
      }

      // If no answer but required, this should have been caught by validation
      return !question.isRequired;
    });

    const results = await Promise.all(submissionPromises);
    const allSuccessful = results.every((result) => result);

    if (allSuccessful) {
      checkMissionCompletion();
    }
  };

  // Allow retrying incorrect questions
  const handleRetryQuestion = (questionId: number) => {
    setQuestionStatuses((prev) => ({
      ...prev,
      [questionId]: 0,
    }));

    setAnswers((prev) => ({
      ...prev,
      [questionId]: "",
    }));

    setShowResponse(false);
    setResponseMessage("");
    setValidationErrors((prev) => {
      const updated = { ...prev };
      delete updated[questionId];
      return updated;
    });
  };

  const handleQuestionClick = (questionId: number) => {
    if (activeQuestionId === questionId) {
      setActiveQuestionId(null);
    } else {
      setActiveQuestionId(questionId);

      setTimeout(() => {
        const questionElement = document.getElementById(
          `question-${questionId}`
        );
        if (questionElement && questionsContainerRef.current) {
          const containerRect =
            questionsContainerRef.current.getBoundingClientRect();
          const elementRect = questionElement.getBoundingClientRect();

          if (
            elementRect.bottom > containerRect.bottom ||
            elementRect.top < containerRect.top
          ) {
            questionElement.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }
        }
      }, 150);
    }
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

  const handleMultipleChoiceChange = (
    questionId: number,
    optionId: string,
    isChecked: boolean
  ) => {
    if (questionStatuses[questionId] === 1) return;

    const currentAnswers = answers[questionId]
      ? answers[questionId].split(",")
      : [];
    let newAnswers;

    if (isChecked) {
      newAnswers = [...currentAnswers, optionId];
    } else {
      newAnswers = currentAnswers.filter((id) => id !== optionId);
    }

    const newValue = newAnswers.join(",");
    setAnswers((prev) => ({
      ...prev,
      [questionId]: newValue,
    }));
  };

  const handleStarRating = (questionId: number, rating: number) => {
    if (questionStatuses[questionId] === 1) return;

    const ratingValue = rating.toString();
    setAnswers((prev) => ({
      ...prev,
      [questionId]: ratingValue,
    }));
  };

  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    // Only allow drag if question is not already correct
    if (questionStatuses[activeQuestionId || 0] === 1) return;

    setDraggedItem(itemId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDropAtPosition = (targetPosition: number, questionId: number) => {
    console.log(
      "Drop attempted at position:",
      targetPosition,
      "with draggedItem:",
      draggedItem
    );

    if (!draggedItem) {
      console.log("No dragged item found");
      return;
    }

    const currentQuestion = questions.find((q) => q.id === questionId);
    if (!currentQuestion?.matchingtems || !currentQuestion?.options) {
      console.log("Question or items not found");
      return;
    }

    // Get current order from imageOrders state or default
    let currentOrder;
    if (imageOrders[questionId]) {
      currentOrder = imageOrders[questionId].map((item) => item.id);
    } else {
      // Initialize from saved answer if available
      const savedAnswer = answers[questionId];
      if (savedAnswer && savedAnswer.trim() !== "") {
        try {
          const parsedAnswer = JSON.parse(savedAnswer);
          if (Array.isArray(parsedAnswer)) {
            currentOrder = parsedAnswer.map((pair) => pair.split("-")[1]);
          } else {
            currentOrder = currentQuestion.matchingtems.map((item) => item.id);
          }
        } catch (e) {
          currentOrder = currentQuestion.matchingtems.map((item) => item.id);
        }
      } else {
        currentOrder = currentQuestion.matchingtems.map((item) => item.id);
      }
    }

    console.log("Current order before move:", currentOrder);

    // Find current position of dragged item
    const currentPosition = currentOrder.indexOf(draggedItem);
    if (currentPosition === -1) {
      console.log("Dragged item not found in current order");
      return;
    }

    console.log(
      "Moving item from position",
      currentPosition,
      "to position",
      targetPosition
    );

    // Adjust target position if moving item down (account for removal)
    let adjustedTargetPosition = targetPosition;
    if (currentPosition < targetPosition) {
      adjustedTargetPosition = targetPosition - 1;
    }

    // Don't do anything if dropping in the same position
    if (currentPosition === adjustedTargetPosition) {
      console.log("Same position, no change needed");
      setDraggedItem(null);
      return;
    }

    // Create new order array
    const newOrder = [...currentOrder];

    // Remove item from current position
    const [removedItem] = newOrder.splice(currentPosition, 1);

    // Insert at target position
    newOrder.splice(adjustedTargetPosition, 0, removedItem);

    console.log("New order after move:", newOrder);

    // Update the imageOrders state with the new order
    const newImageOrder = newOrder
      .map((id) => currentQuestion.matchingtems?.find((item) => item.id === id))
      .filter(Boolean);

    setImageOrders((prev) => ({
      ...prev,
      [questionId]: newImageOrder,
    }));

    // Create answer in the expected format ["1-A","2-B","3-C","4-D"]
    const formattedAnswer = newOrder.map((imageId, index) => {
      // Find the corresponding step number (1-based index from options)
      const stepNumber = index + 1;
      return `${stepNumber}-${imageId}`;
    });

    console.log("Formatted answer:", formattedAnswer);

    // Update the answer
    setAnswers((prev) => ({
      ...prev,
      [questionId]: JSON.stringify(formattedAnswer),
    }));

    setDraggedItem(null);
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  // Render content based on mission type
  const renderContent = () => {
    console.log("Rendering content for mission type:", missionType);
    if (missionType === "POSTER_MISSION") {
      return (
        <div className="w-full h-full min-h-[600px]">
          <PdfViewer url={missionFile} />
        </div>
      );
    } else if (missionType === "PDF_MISSION") {
      return (
        <div className="w-full h-full min-h-[600px]">
          <PdfViewer url={missionFile} />
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

  const renderQuestionInput = (question: Question) => {
    const questionId = question.id;
    const questionStatus = questionStatuses[questionId];
    const isAnsweredCorrectly = questionStatus === 1;

    switch (question.questionTypeId) {
      case 1: // Short Answer
        return (
          <input
            type="text"
            className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              isAnsweredCorrectly ? "bg-green-50 border-green-300" : ""
            }`}
            value={answers[questionId] || ""}
            onChange={(e) => handleAnswerChange(questionId, e.target.value)}
            placeholder={question.placeholder || "Enter your answer..."}
            maxLength={question.characterLimit}
            disabled={isSubmitting || isAnsweredCorrectly}
          />
        );

      case 2: // Long Answer
        return (
          <div>
            <textarea
              className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                isAnsweredCorrectly ? "bg-green-50 border-green-300" : ""
              }`}
              rows={4}
              value={answers[questionId] || ""}
              onChange={(e) => handleAnswerChange(questionId, e.target.value)}
              placeholder={
                question.placeholder || "Enter your detailed answer..."
              }
              maxLength={question.characterLimit}
              disabled={isSubmitting || isAnsweredCorrectly}
            />
            {question.characterLimit && (
              <div className="text-sm text-gray-500 mt-1">
                {(answers[questionId] || "").length}/{question.characterLimit}{" "}
                characters
              </div>
            )}
          </div>
        );

      case 3: // Multiple Choice
        return (
          <div className="space-y-2">
            {question.options?.map((option) => (
              <label
                key={option.id}
                className={`flex items-center space-x-2 cursor-pointer ${
                  isAnsweredCorrectly ? "opacity-60" : ""
                }`}
              >
                <input
                  type={question.allowMultipleSelection ? "checkbox" : "radio"}
                  name={`question-${questionId}`}
                  value={option.id}
                  checked={
                    question.allowMultipleSelection
                      ? (answers[questionId] || "")
                          .split(",")
                          .includes(option.id)
                      : answers[questionId] === option.id
                  }
                  onChange={(e) => {
                    if (!isSubmitting && !isAnsweredCorrectly) {
                      if (question.allowMultipleSelection) {
                        handleMultipleChoiceChange(
                          questionId,
                          option.id,
                          e.target.checked
                        );
                      } else {
                        handleAnswerChange(questionId, option.id);
                      }
                    }
                  }}
                  className="w-4 h-4"
                  disabled={isSubmitting || isAnsweredCorrectly}
                />
                <span>{option.text}</span>
              </label>
            ))}
          </div>
        );

      case 4: // Image Choice
        return (
          <div className="grid grid-cols-4 gap-4">
            {question.imageOptions?.map((option) => (
              <label
                key={option.id}
                className={`cursor-pointer ${
                  isAnsweredCorrectly ? "opacity-60" : ""
                }`}
              >
                <div
                  className={`border rounded-lg p-2 transition-colors ${
                    answers[questionId] === option.id
                      ? "border-blue-500 bg-blue-50"
                      : ""
                  }`}
                >
                  <img
                    src={option.imageUrl}
                    alt={option.altText}
                    className="w-full h-32 object-cover rounded mb-2"
                  />
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name={`question-${questionId}`}
                      value={option.id}
                      checked={answers[questionId] === option.id}
                      onChange={(e) =>
                        !isSubmitting &&
                        !isAnsweredCorrectly &&
                        handleAnswerChange(questionId, option.id)
                      }
                      className="w-4 h-4"
                      disabled={isSubmitting || isAnsweredCorrectly}
                    />
                    <span className="text-sm">{option.caption}</span>
                  </div>
                </div>
              </label>
            ))}
          </div>
        );

      case 5: // Matching/Sorting
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-8">
              {/* Static Text Options - Left Column */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-700 mb-4">
                  Steps in Order:
                </h4>
                {question.options?.map((option, index) => (
                  <div
                    key={option.id}
                    className="p-4 bg-white border-2 border-gray-200 rounded-lg min-h-[100px] flex items-center"
                  >
                    <div className="flex items-center w-full">
                      <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-4 flex-shrink-0">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-gray-800">
                          {option.text}
                        </h3>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Draggable Images - Right Column (Sortable) */}
              <div
                className={`space-y-3 ${
                  isAnsweredCorrectly || isSubmitting
                    ? "opacity-60 pointer-events-none"
                    : ""
                }`}
              >
                <h4 className="font-medium text-gray-700 mb-4">
                  Drag to sort in correct order:
                </h4>

                {/* Render the sorted images */}
                {(() => {
                  let orderedImages = [];

                  if (!question.matchingtems) return null;

                  if (imageOrders[questionId]) {
                    orderedImages = imageOrders[questionId];
                  } else {
                    const savedAnswer = answers[questionId];

                    if (savedAnswer && savedAnswer.trim() !== "") {
                      try {
                        const parsedAnswer = JSON.parse(savedAnswer);
                        if (Array.isArray(parsedAnswer)) {
                          const orderedIds = parsedAnswer.map(
                            (pair) => pair.split("-")[1]
                          );
                          orderedImages = orderedIds
                            .map((id) =>
                              question.matchingtems?.find(
                                (item) => item.id === id
                              )
                            )
                            .filter(Boolean);

                          if (
                            orderedImages.length !==
                            question.matchingtems.length
                          ) {
                            orderedImages = [...question.matchingtems];
                          }
                        } else {
                          orderedImages = [...question.matchingtems];
                        }
                      } catch (e) {
                        orderedImages = [...question.matchingtems];
                      }
                    } else {
                      orderedImages = [...question.matchingtems];
                    }

                    setImageOrders((prev) => ({
                      ...prev,
                      [questionId]: orderedImages,
                    }));
                  }

                  return (
                    <div className="space-y-2">
                      {orderedImages.map((item, index) => (
                        <div key={`${item.id}-${index}`}>
                          {/* Simple drop zone before item */}
                          {draggedItem && draggedItem !== item.id && (
                            <div
                              className="h-8 bg-blue-50 border border-dashed border-blue-300 rounded text-center text-xs text-blue-600 leading-8 mb-1"
                              onDragOver={(e) => {
                                e.preventDefault();
                                e.dataTransfer.dropEffect = "move";
                              }}
                              onDrop={(e) => {
                                e.preventDefault();
                                handleDropAtPosition(index, questionId);
                              }}
                            >
                              Drop here
                            </div>
                          )}

                          {/* Simple draggable item */}
                          <div
                            draggable={!isAnsweredCorrectly && !isSubmitting}
                            onDragStart={(e) => {
                              if (!isAnsweredCorrectly && !isSubmitting) {
                                e.dataTransfer.effectAllowed = "move";
                                setDraggedItem(item.id);
                              }
                            }}
                            onDragEnd={() => setDraggedItem(null)}
                            className={`bg-white border rounded-lg p-3 flex items-center ${
                              !isAnsweredCorrectly && !isSubmitting
                                ? "cursor-move"
                                : "cursor-default"
                            } ${
                              draggedItem === item.id
                                ? "opacity-50 border-blue-400"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                              {index + 1}
                            </div>

                            <div className="w-16 h-16 mr-3">
                              <img
                                src={item.imageUrl}
                                alt={item.altText}
                                className="w-full h-full object-cover rounded"
                                draggable={false}
                              />
                            </div>

                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-800">
                                {item.caption}
                              </p>
                            </div>

                            {!isAnsweredCorrectly && !isSubmitting && (
                              <div className="text-gray-400 ml-2">⋮⋮</div>
                            )}
                          </div>
                        </div>
                      ))}

                      {/* Final drop zone */}
                      {draggedItem && (
                        <div
                          className="h-8 bg-blue-50 border border-dashed border-blue-300 rounded text-center text-xs text-blue-600 leading-8 mt-1"
                          onDragOver={(e) => {
                            e.preventDefault();
                            e.dataTransfer.dropEffect = "move";
                          }}
                          onDrop={(e) => {
                            e.preventDefault();
                            handleDropAtPosition(
                              orderedImages.length,
                              questionId
                            );
                          }}
                        >
                          Drop here
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        );

      case 6: // Star Rating
        return (
          <div
            className={`flex items-center space-x-1 ${
              isAnsweredCorrectly ? "opacity-60" : ""
            }`}
          >
            {[...Array(question.maxRating || 5)].map((_, i) => (
              <button
                key={i}
                onClick={() =>
                  !isAnsweredCorrectly &&
                  !isSubmitting &&
                  handleStarRating(questionId, i + 1)
                }
                className={`p-1 transition-colors ${
                  i < parseInt(answers[questionId] || "0")
                    ? "text-yellow-400"
                    : "text-gray-300"
                } ${
                  isAnsweredCorrectly || isSubmitting
                    ? "cursor-default"
                    : "cursor-pointer"
                }`}
                disabled={isAnsweredCorrectly || isSubmitting}
              >
                <Star className="w-9 h-9 fill-current" />
              </button>
            ))}
          </div>
        );

      case 8: // Number Rating
        return (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {Array.from(
                { length: (question.maxRating || 10) - 1 + 1 },
                (_, index) => {
                  const ratingValue = 1 + index;
                  const isSelected =
                    parseInt(answers[questionId]) === ratingValue;

                  return (
                    <button
                      key={ratingValue}
                      onClick={() =>
                        !isAnsweredCorrectly &&
                        !isSubmitting &&
                        handleAnswerChange(questionId, ratingValue.toString())
                      }
                      className={`w-12 h-12 rounded-lg border font-medium text-sm transition-all duration-200 hover:scale-105 ${
                        isSelected
                          ? "border-blue-500 bg-blue-500 text-white shadow-lg"
                          : "border-gray-300 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50"
                      } ${
                        isAnsweredCorrectly || isSubmitting
                          ? "opacity-60 cursor-default"
                          : "cursor-pointer"
                      }`}
                      disabled={isAnsweredCorrectly || isSubmitting}
                    >
                      {ratingValue}
                    </button>
                  );
                }
              )}
            </div>
          </div>
        );

      case 7: // User Search
        return (
          <div className="space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search for users..."
                value={searchQuery[questionId] || ""}
                onChange={(e) =>
                  !isAnsweredCorrectly &&
                  !isSubmitting &&
                  setSearchQuery((prev) => ({
                    ...prev,
                    [questionId]: e.target.value,
                  }))
                }
                className={`w-full pl-10 p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  isAnsweredCorrectly ? "bg-green-50 border-green-300" : ""
                }`}
                disabled={isAnsweredCorrectly || isSubmitting}
              />
            </div>
            <div className="text-sm text-gray-500">
              Selected: {answers[questionId] || "None"}
            </div>
          </div>
        );

      default:
        return <div>Unsupported question type: {question.questionTypeId}</div>;
    }
  };

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
          <div className="col-span-3 flex flex-col h-full">
            <div
              ref={questionsContainerRef}
              className="flex-1 overflow-y-auto flex flex-col justify-center pr-4 space-y-6 pt-6 max-h-[calc(100vh-16rem)]"
            >
              {currentQuestions.map((question) => {
                const questionId = question.id;
                const hasError = validationErrors[questionId];
                const isAnsweredCorrectly = questionStatuses[questionId] === 1;

                return (
                  <div
                    id={`question-${questionId}`}
                    key={questionId}
                    className={`w-full bg-white overflow-hidden ${
                      isAnsweredCorrectly ? "border-l-4 border-green-500" : ""
                    }`}
                  >
                    <div
                      className={`p-2 cursor-pointer flex justify-between items-center transition-colors ${
                        activeQuestionId === questionId
                          ? "bg-blue-50 border-blue-200"
                          : "hover:bg-gray-50"
                      }`}
                      onClick={() => handleQuestionClick(questionId)}
                    >
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-gray-500">
                            Question {question.sequence} ({question.typeCode})
                          </span>
                          {question.isRequired && (
                            <span className="text-red-500 text-sm">*</span>
                          )}
                          {isAnsweredCorrectly && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              ✓ Correct
                            </span>
                          )}
                          {questionStatuses[questionId] === 0 &&
                            answers[questionId] && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                ⚠ Not Submitted
                              </span>
                            )}
                        </div>
                        <h3 className="text-[13px] text-black font-bold">
                          {question.question}
                        </h3>
                        {hasError && (
                          <p className="text-sm text-red-500 font-medium">
                            {hasError}
                          </p>
                        )}
                      </div>
                      <span className="text-gray-500">
                        {activeQuestionId === questionId ? (
                          <ChevronUp />
                        ) : (
                          <ChevronDown />
                        )}
                      </span>
                    </div>

                    {activeQuestionId === questionId && (
                      <div className="pb-6 border-t pt-4">
                        {/* Show response message for the active question */}
                        {showResponse &&
                          responseMessage &&
                          activeQuestionId === questionId && (
                            <div
                              className={`mb-4 p-3 rounded-md flex justify-between items-center ${
                                responseMessage.includes("correct") ||
                                responseMessage.includes("Correct")
                                  ? "bg-green-100 text-green-800 border border-green-300"
                                  : "bg-red-100 text-red-800 border border-red-300"
                              }`}
                            >
                              <span>{responseMessage}</span>
                              {/* Add retry button for incorrect answers */}
                              {!responseMessage.includes("correct") &&
                                !responseMessage.includes("Correct") && (
                                  <Button
                                    onClick={() =>
                                      handleRetryQuestion(questionId)
                                    }
                                    variant="outline"
                                    size="sm"
                                    className="ml-2 text-xs"
                                  >
                                    Try Again
                                  </Button>
                                )}
                            </div>
                          )}

                        {question.hint && (
                          <div className="mb-3">
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                toggleHint(questionId);
                              }}
                              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                            >
                              {showHintId === questionId
                                ? "Hide Hint"
                                : "Show Hint"}
                            </button>
                            {showHintId === questionId && (
                              <p className="text-sm text-gray-600 mt-2 pl-4 border-l-2 border-blue-500">
                                {question.hint}
                              </p>
                            )}
                          </div>
                        )}
                        {renderQuestionInput(question)}

                        {/* Submit button for individual question */}
                        {!isAnsweredCorrectly && answers[questionId] && (
                          <div className="mt-4">
                            <Button
                              onClick={() => submitCurrentAnswer(questionId)}
                              disabled={isSubmitting}
                              variant="outline"
                              size="sm"
                              className="text-xs"
                            >
                              {isSubmitting ? "Submitting..." : "Submit Answer"}
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="col-span-3 flex flex-col h-full justify-center">
            <div className="relative w-[90%]">
              {/* Content here */}
              <div className="aspect-video rounded-[15px] flex items-center justify-center relative">
                {renderContent()}
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
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-center mt-8 space-x-4">
        {/* Previous button */}
        {currentPage > 0 && (
          <Button
            onClick={handlePreviousPage}
            variant="default"
            className="w-[200px] h-[50px] rounded-md flex items-center text-[#6C50E0] font-bold justify-center gap-2 bg-gradient-to-t from-[#EDDDFF] to-[#FCFAFF]"
            disabled={isSubmitting}
          >
            Previous
          </Button>
        )}

        {/* Next/Submit button */}
        {currentPage < totalPages - 1 ? (
          <Button
            onClick={handleNextPage}
            variant="default"
            className="w-[250px] h-[50px] rounded-md flex items-center text-white font-bold justify-center gap-2 bg-gradient-to-t from-[#B276FF] to-[#7C2BDA]"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Next"}
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            variant="default"
            className="w-[250px] h-[50px] rounded-md flex items-center text-white font-bold justify-center gap-2 bg-gradient-to-t from-[#B276FF] to-[#7C2BDA]"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Complete Mission"} <Mouse />
          </Button>
        )}
      </div>
    </section>
  );
};

export default PosterQuestions;