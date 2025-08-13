"use client";
import { useLogResponseMutation } from "@/store/services/missionManagement";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown, Maximize2, X, Mouse, Star, Search } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuthToken } from "@/utils/auth";

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

interface MissionVideoQuestionsProps {
  questions: Question[];
  missionType: string;
  missionId: number;
  isMissionComplete: boolean;
}

const StandardQuestions = ({
  questions,
  missionId,isMissionComplete
}: MissionVideoQuestionsProps) => {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [questionStatuses, setQuestionStatuses] = useState<{ [key: number]: number }>({});
  const [showHintId, setShowHintId] = useState<number | null>(null);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<{ [key: number]: string }>({});
  const [validationErrors, setValidationErrors] = useState<{ [key: number]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseMessage, setResponseMessage] = useState<string>("");
  const [showResponse, setShowResponse] = useState(false);
  const [missionStatus, setMissionStatus] = useState(1); // Track overall mission status
  const [imageOrders, setImageOrders] = useState<{ [key: number]: any[] }>({});
  
  const questionsContainerRef = useRef<HTMLDivElement>(null);
  const token = getAuthToken();
  const [logResponse] = useLogResponseMutation();

  // Initialize question statuses and answers from props
  useEffect(() => {
    const initialStatuses: { [key: number]: number } = {};
    const initialAnswers: { [key: number]: string } = {};
    
    questions.forEach(question => {
      // Use the status from props (0 = not attempted/incorrect, 1 = correct)
      initialStatuses[question.id] = question.status;
      
      // Initialize answers from userAnswer prop
      if (question.userAnswer && question.userAnswer !== "{}") {
        try {
          // Handle JSON strings in userAnswer
          const parsedAnswer = question.userAnswer.startsWith('{') || question.userAnswer.startsWith('[') 
            ? JSON.parse(question.userAnswer) 
            : question.userAnswer;
          initialAnswers[question.id] = typeof parsedAnswer === 'string' ? parsedAnswer : JSON.stringify(parsedAnswer);
        } catch {
          // If parsing fails, use as string
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

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  
  // Check if we can proceed to next question
  const canGoNext = currentQuestion && (
    questionStatuses[currentQuestion.id] === 1 || // Already answered correctly
    !currentQuestion.isRequired || // Not required
    (answers[currentQuestion.id] && answers[currentQuestion.id].trim() !== "") // Has an answer
  );

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
      setValidationErrors(prev => ({
        ...prev,
        [questionId]: "This question is required"
      }));
      return false;
    }

    setIsSubmitting(true);
    setShowResponse(false);
    
    try {
      const payload = {
        questionId,
        answer: answer ? answer.trim() : ""
      };
      
      console.log("Submitting answer:", payload);

      const response = await logResponse({
        authToken: token,
        body: payload,
        id: missionId
      }).unwrap();

      // Handle API response
      const apiResponse = response as ApiResponse;
      
      // Update question status based on response
      const newStatus = apiResponse.isCorrectAnswer ? 1 : 0;
      setQuestionStatuses(prev => ({
        ...prev,
        [questionId]: newStatus
      }));

      // Show response message
      setResponseMessage(apiResponse.note);
      setShowResponse(true);

      // Clear validation errors
      setValidationErrors(prev => {
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

  // Handle next question
  const handleNext = async () => {
    if (!currentQuestion) return;

    // If question is already answered correctly (status = 1), just move to next
    if (isCurrentQuestionCorrect()) {
      if (isLastQuestion) {
        checkMissionCompletion();
      } else {
        // Move to next question without submitting
        setCurrentQuestionIndex(prev => prev + 1);
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
        setCurrentQuestionIndex(prev => prev + 1);
        setResponseMessage("");
        setShowResponse(false);
      }
    }
  };

  // Add this function after your existing handleDrop function

const handleDropAtPosition = (targetPosition: number, questionId: number) => {

  if (!draggedItem) {
    console.log('No dragged item found');
    return;
  }
  
  const currentQuestion = questions.find((q) => q.id === questionId);
  if (!currentQuestion?.matchingtems || !currentQuestion?.options) {
    console.log('Question or items not found');
    return;
  }
  
  // Get current order from imageOrders state or default
  let currentOrder;
  if (imageOrders[questionId]) {
    currentOrder = imageOrders[questionId].map(item => item.id);
  } else {
    // Initialize from saved answer if available
    const savedAnswer = answers[questionId];
    if (savedAnswer && savedAnswer.trim() !== '') {
      try {
        const parsedAnswer = JSON.parse(savedAnswer);
        if (Array.isArray(parsedAnswer)) {
          currentOrder = parsedAnswer.map(pair => pair.split('-')[1]);
        } else {
          currentOrder = currentQuestion.matchingtems.map(item => item.id);
        }
      } catch (e) {
        currentOrder = currentQuestion.matchingtems.map(item => item.id);
      }
    } else {
      currentOrder = currentQuestion.matchingtems.map(item => item.id);
    }
  }
  
  console.log('Current order before move:', currentOrder);
  
  // Find current position of dragged item
  const currentPosition = currentOrder.indexOf(draggedItem);
  if (currentPosition === -1) {
    console.log('Dragged item not found in current order');
    return;
  }
  
  console.log('Moving item from position', currentPosition, 'to position', targetPosition);
  
  // Adjust target position if moving item down (account for removal)
  let adjustedTargetPosition = targetPosition;
  if (currentPosition < targetPosition) {
    adjustedTargetPosition = targetPosition - 1;
  }
  
  // Don't do anything if dropping in the same position
  if (currentPosition === adjustedTargetPosition) {
    console.log('Same position, no change needed');
    setDraggedItem(null);
    return;
  }
  
  // Create new order array
  const newOrder = [...currentOrder];
  
  // Remove item from current position
  const [removedItem] = newOrder.splice(currentPosition, 1);
  
  // Insert at target position
  newOrder.splice(adjustedTargetPosition, 0, removedItem);
  
  console.log('New order after move:', newOrder);
  
  // Update the imageOrders state with the new order
  const newImageOrder = newOrder.map(id => 
    currentQuestion.matchingtems?.find(item => item.id === id)
  ).filter(Boolean);
  
  setImageOrders(prev => ({
    ...prev,
    [questionId]: newImageOrder
  }));
  
  // Create answer in the expected format ["1-A","2-B","3-C","4-D"]
  const formattedAnswer = newOrder.map((imageId, index) => {
    // Find the corresponding step number (1-based index from options)
    const stepNumber = index + 1;
    return `${stepNumber}-${imageId}`;
  });
  
  console.log('Formatted answer:', formattedAnswer);
  
  // Update the answer
  setAnswers((prev) => ({
    ...prev,
    [questionId]: JSON.stringify(formattedAnswer),
  }));
  
  setDraggedItem(null);
};

  // Check mission completion and redirect accordingly
  const checkMissionCompletion = () => {
    const allQuestionsCorrect = questions.every(question => {
      return !question.hasCorrectAnswer || questionStatuses[question.id] === 1;
    });

    if (allQuestionsCorrect) {
      // All questions correct - mission successful
      setMissionStatus(2);
      setTimeout(() => {
        router.push('/congratulation');
      }, 2000);
    } else {
      // Some questions incorrect - mission failed
      setMissionStatus(1);
      setTimeout(() => {
        router.push('/mission-fail');
      }, 2000);
    }
  };

  // Allow retrying incorrect questions
  const handleRetryQuestion = () => {
    if (!currentQuestion) return;
    
    // Reset current question status to 0 (not attempted/incorrect)
    setQuestionStatuses(prev => ({
      ...prev,
      [currentQuestion.id]: 0
    }));
    
    // Clear the answer
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: ""
    }));
    
    setShowResponse(false);
    setResponseMessage("");
    setValidationErrors(prev => {
      const updated = { ...prev };
      delete updated[currentQuestion.id];
      return updated;
    });
  };

  // Handle previous question
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setValidationErrors({});
      setShowResponse(false);
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
      setValidationErrors(prev => {
        const updated = { ...prev };
        delete updated[questionId];
        return updated;
      });
    }
  };

  const handleMultipleChoiceChange = (questionId: number, optionId: string, isChecked: boolean) => {
    // Only allow changes if question is not already correct
    if (questionStatuses[questionId] === 1) return;
    
    const currentAnswers = answers[questionId] ? answers[questionId].split(',') : [];
    let newAnswers;

    if (isChecked) {
      newAnswers = [...currentAnswers, optionId];
    } else {
      newAnswers = currentAnswers.filter(id => id !== optionId);
    }

    const newValue = newAnswers.join(',');
    setAnswers((prev) => ({
      ...prev,
      [questionId]: newValue,
    }));
  };

  const handleStarRating = (questionId: number, rating: number) => {
    // Only allow changes if question is not already correct
    if (questionStatuses[questionId] === 1) return;
    
    const ratingValue = rating.toString();
    setAnswers((prev) => ({
      ...prev,
      [questionId]: ratingValue,
    }));
  };

  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    // Only allow drag if question is not already correct
    if (questionStatuses[currentQuestion?.id] === 1) return;
    
    setDraggedItem(itemId);
    e.dataTransfer.effectAllowed = "move";
  };

  // Add this function after your existing handleDrop function


  const handleDrop = (e: React.DragEvent, targetPosition: number, questionId: number) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Only allow drop if question is not already correct
    if (questionStatuses[questionId] === 1) return;
    
    if (!draggedItem) return;
    
    const currentQuestion = questions.find((q) => q.id === questionId);
    
    if (currentQuestion?.questionTypeId === 5 && currentQuestion.matchingtems) {
      let currentOrder;
      const savedOrder = answers[questionId];
      
      if (savedOrder && savedOrder.trim() !== '') {
        currentOrder = savedOrder.split(',').filter(id => id.trim() !== '');
      } else {
        currentOrder = currentQuestion.matchingtems.map(item => item.id);
      }
      
      const currentPosition = currentOrder.indexOf(draggedItem);
      if (currentPosition === -1 || currentPosition === targetPosition) {
        setDraggedItem(null);
        return;
      }
      
      const newOrder = [...currentOrder];
      newOrder.splice(currentPosition, 1);
      newOrder.splice(targetPosition, 0, draggedItem);
      
      setAnswers((prev) => ({
        ...prev,
        [questionId]: newOrder.join(','),
      }));
    }
    
    setDraggedItem(null);
  };

  const getOrderedImages = (question: Question, questionId: number) => {
    if (!question.matchingtems) return [];
    
    const savedOrder = answers[questionId];
    if (savedOrder && savedOrder.trim() !== '') {
      try {
        const orderIds = savedOrder.split(',').filter(id => id.trim() !== '');
        const orderedItems = orderIds.map(id =>
          question.matchingtems?.find(item => item.id === id)
        ).filter(Boolean) as MatchingItem[];
        
        if (orderedItems.length === question.matchingtems.length) {
          return orderedItems;
        }
      } catch (e) {
        console.error('Error parsing saved order:', e);
      }
    }
    
    return [...question.matchingtems];
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
              isAnsweredCorrectly ? 'bg-green-50 border-green-300' : ''
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
                isAnsweredCorrectly ? 'bg-green-50 border-green-300' : ''
              }`}
              rows={4}
              value={answers[questionId] || ""}
              onChange={(e) => handleAnswerChange(questionId, e.target.value)}
              placeholder={question.placeholder || "Enter your detailed answer..."}
              maxLength={question.characterLimit}
              disabled={isSubmitting || isAnsweredCorrectly}
            />
            {question.characterLimit && (
              <div className="text-sm text-gray-500 mt-1">
                {(answers[questionId] || "").length}/{question.characterLimit} characters
              </div>
            )}
          </div>
        );

      case 3: // Multiple Choice
        return (
          <div className="space-y-2">
            {question.options?.map((option) => (
              <label key={option.id} className={`flex items-center space-x-2 cursor-pointer ${
                isAnsweredCorrectly ? 'opacity-60' : ''
              }`}>
                <input
                  type={question.allowMultipleSelection ? "checkbox" : "radio"}
                  name={`question-${questionId}`}
                  value={option.id}
                  checked={
                    question.allowMultipleSelection
                      ? (answers[questionId] || "").split(',').includes(option.id)
                      : answers[questionId] === option.id
                  }
                  onChange={(e) => {
                    if (!isSubmitting && !isAnsweredCorrectly) {
                      if (question.allowMultipleSelection) {
                        handleMultipleChoiceChange(questionId, option.id, e.target.checked);
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
              <label key={option.id} className={`cursor-pointer ${
                isAnsweredCorrectly ? 'opacity-60' : ''
              }`}>
                <div className={`border rounded-lg p-2 transition-colors ${
                  answers[questionId] === option.id ? 'border-blue-500 bg-blue-50' : ''
                }`}>
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
                      onChange={(e) => !isSubmitting && !isAnsweredCorrectly && handleAnswerChange(questionId, option.id)}
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

// Replace your case 5 in the renderQuestionInput function with this:

case 5: // Matching/Sorting
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-8">
        {/* Static Text Options - Left Column */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-700 mb-4">Steps in Order:</h4>
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
        <div className={`space-y-3 ${isAnsweredCorrectly || isSubmitting ? 'opacity-60 pointer-events-none' : ''}`}>
          <h4 className="font-medium text-gray-700 mb-4">Drag to sort in correct order:</h4>
          
          {/* Render the sorted images */}
          {(() => {
            // Use imageOrders state if available, otherwise compute from answers
            let orderedImages = [];
            
            if (!question.matchingtems) return null;
            
            if (imageOrders[questionId]) {
              orderedImages = imageOrders[questionId];
            } else {
              const savedAnswer = answers[questionId];
              
              if (savedAnswer && savedAnswer.trim() !== '') {
                try {
                  const parsedAnswer = JSON.parse(savedAnswer);
                  if (Array.isArray(parsedAnswer)) {
                    const orderedIds = parsedAnswer.map(pair => pair.split('-')[1]);
                    orderedImages = orderedIds.map(id =>
                      question.matchingtems?.find(item => item.id === id)
                    ).filter(Boolean);
                    
                    if (orderedImages.length !== question.matchingtems.length) {
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
              
              setImageOrders(prev => ({
                ...prev,
                [questionId]: orderedImages
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
                        !isAnsweredCorrectly && !isSubmitting ? 'cursor-move' : 'cursor-default'
                      } ${
                        draggedItem === item.id ? 'opacity-50 border-blue-400' : 'border-gray-200 hover:border-gray-300'
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
                        <div className="text-gray-400 ml-2">
                          ⋮⋮
                        </div>
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
                      handleDropAtPosition(orderedImages.length, questionId);
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
          <div className={`flex items-center space-x-1 ${isAnsweredCorrectly ? 'opacity-60' : ''}`}>
            {[...Array(question.maxRating || 5)].map((_, i) => (
              <button
                key={i}
                onClick={() => !isAnsweredCorrectly && !isSubmitting && handleStarRating(questionId, i + 1)}
                className={`p-1 transition-colors ${
                  i < parseInt(answers[questionId] || "0") ? 'text-yellow-400' : 'text-gray-300'
                } ${isAnsweredCorrectly || isSubmitting ? 'cursor-default' : 'cursor-pointer'}`}
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
                  const isSelected = parseInt(answers[questionId]) === ratingValue;
                  
                  return (
                    <button
                      key={ratingValue}
                      onClick={() => !isAnsweredCorrectly && !isSubmitting && handleAnswerChange(questionId, ratingValue.toString())}
                      className={`w-12 h-12 rounded-lg border font-medium text-sm transition-all duration-200 hover:scale-105 ${
                        isSelected
                          ? 'border-blue-500 bg-blue-500 text-white shadow-lg'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                      } ${isAnsweredCorrectly || isSubmitting ? 'opacity-60 cursor-default' : 'cursor-pointer'}`}
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
                onChange={(e) => !isAnsweredCorrectly && !isSubmitting && setSearchQuery(prev => ({ ...prev, [questionId]: e.target.value }))}
                className={`w-full pl-10 p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  isAnsweredCorrectly ? 'bg-green-50 border-green-300' : ''
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

  if (!currentQuestion) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-gray-600 text-xl">No questions available</div>
      </div>
    );
  }

  const getButtonText = () => {
    if (isSubmitting) return "Submitting...";
    if (isLastQuestion) {
      return isCurrentQuestionCorrect() ? "Complete Mission" : "Submit Mission";
    }
    return isCurrentQuestionCorrect() ? "Next Question" : "Submit & Next";
  };

  return (
    <section className="w-full min-h-screen flex flex-col justify-center">
      <div className="container mx-auto">
        <p className="text-gray-600 text-sm mb-2">Why I Woke Up</p>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Mission Task
        </h1>

        <div className="max-w-3xl mx-auto">
          <div
            ref={questionsContainerRef}
            className="flex-1 overflow-y-auto flex flex-col justify-center pr-4 space-y-6 pt-6 "
          >
            {/* Current Question */}
            <div className={`w-full bg-white rounded-lg ${
              questionStatuses[currentQuestion.id] === 1 ? 'border-l-4 border-green-500' : ''
            }`}>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  {questionStatuses[currentQuestion.id] === 1 && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      ✓ Correct
                    </span>
                  )}
                  {questionStatuses[currentQuestion.id] === 0 && answers[currentQuestion.id] && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      ⚠ Not Submitted
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

                {/* Show response message */}
                {showResponse && responseMessage && (
                  <div className={`mb-4 p-3 rounded-md flex justify-between items-center ${
                    responseMessage.includes('correct') || responseMessage.includes('Correct')
                      ? 'bg-green-100 text-green-800 border border-green-300'
                      : 'bg-red-100 text-red-800 border border-red-300'
                  }`}>
                    <span>{responseMessage}</span>
                    {/* Add retry button for incorrect answers */}
                    {(!responseMessage.includes('correct') && !responseMessage.includes('Correct')) && (
                      <Button
                        onClick={handleRetryQuestion}
                        variant="outline"
                        size="sm"
                        className="ml-2 text-xs"
                      >
                        Try Again
                      </Button>
                    )}
                  </div>
                )}

                {currentQuestion.hint && (
                  <div className="mb-4">
                    <button
                      onClick={() => toggleHint(currentQuestion.id)}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      {showHintId === currentQuestion.id ? "Hide Hint" : "Show Hint"}
                    </button>
                    {showHintId === currentQuestion.id && (
                      <p className="text-sm text-gray-600 mt-2 pl-4 border-l-2 border-blue-500">
                        {currentQuestion.hint}
                      </p>
                    )}
                  </div>
                )}

                {renderQuestionInput(currentQuestion)}
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

export default StandardQuestions;