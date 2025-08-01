"use client";
import PdfViewer from "@/app/components/PdfViewer";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown, Maximize2, X, Mouse, Star, Search } from "lucide-react";
import React, { useState, useRef } from "react";

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

interface UserSearchConfig {
  searchBy: string[];
  allowMultipleUsers: boolean;
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
  status: number;
  correctAnswer: string | null;
  // Additional properties based on question type
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

interface MissionVideoQuestionsProps {
  questions: Question[];
  onSubmit: (answers: { [key: number]: string }) => void;
  missionType: string;
}

const StandardQuestions = ({
  questions,
  onSubmit,
}: MissionVideoQuestionsProps) => {
  const [activeQuestionId, setActiveQuestionId] = useState<number | null>(null);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [showHintId, setShowHintId] = useState<number | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<{ [key: number]: string }>({});
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [validationErrors, setValidationErrors] = useState<{ [key: number]: string }>({});
  const questionsContainerRef = useRef<HTMLDivElement>(null);
  const QUESTIONS_PER_PAGE = 3;

  // Use provided questions or sample questions for demo
   const displayQuestions = questions?.length > 0 ? questions : []


  const totalPages = Math.ceil(displayQuestions.length / QUESTIONS_PER_PAGE);
  const currentQuestions = displayQuestions.slice(
    currentPage * QUESTIONS_PER_PAGE,
    (currentPage + 1) * QUESTIONS_PER_PAGE
  );

  const validateCurrentPage = () => {
    const errors: { [key: number]: string } = {};
    let hasErrors = false;

    currentQuestions.forEach((question, index) => {
      const questionId = currentPage * QUESTIONS_PER_PAGE + index + 1;
      
      if (question.isRequired) {
        const answer = answers[questionId];
        if (!answer || answer.trim() === "") {
          errors[questionId] = "This question is required";
          hasErrors = true;
        }
      }
    });

    setValidationErrors(errors);
    return !hasErrors;
  };

  const handleNextPage = () => {
    if (validateCurrentPage()) {
      if (currentPage < totalPages - 1) {
        setCurrentPage(currentPage + 1);
        setActiveQuestionId(null); // Reset active question
      }
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      setActiveQuestionId(null); // Reset active question
      setValidationErrors({}); // Clear validation errors
    }
  };

  const handleQuestionClick = (questionId: number) => {
    // Always close the current question if clicking the same one, otherwise open the new one
    if (activeQuestionId === questionId) {
      setActiveQuestionId(null);
    } else {
      setActiveQuestionId(questionId);
      
      // Scroll to the question after a brief delay to allow for DOM updates
      setTimeout(() => {
        const questionElement = document.getElementById(`question-${questionId}`);
        if (questionElement && questionsContainerRef.current) {
          const containerRect = questionsContainerRef.current.getBoundingClientRect();
          const elementRect = questionElement.getBoundingClientRect();

          if (elementRect.bottom > containerRect.bottom || elementRect.top < containerRect.top) {
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
    const currentAnswers = answers[questionId] ? answers[questionId].split(',') : [];
    let newAnswers;

    if (isChecked) {
      newAnswers = [...currentAnswers, optionId];
    } else {
      newAnswers = currentAnswers.filter(id => id !== optionId);
    }

    setAnswers((prev) => ({
      ...prev,
      [questionId]: newAnswers.join(','),
    }));
  };

  const handleStarRating = (questionId: number, rating: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: rating.toString(),
    }));
  };

  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    setDraggedItem(itemId);
    e.dataTransfer.effectAllowed = "move";
  };

  
  // Add these helper functions to your component

// Handle dropping an image onto a text option
const handleMatchingDrop = (e: React.DragEvent, optionId: string, questionId: number) => {
  e.preventDefault();
  if (draggedItem) {
    // Get current matches or initialize empty object
    const currentMatches = answers[questionId] ? JSON.parse(answers[questionId]) : {};
    
    // Remove the dragged item from any existing match
    Object.keys(currentMatches).forEach(key => {
      if (currentMatches[key] === draggedItem) {
        delete currentMatches[key];
      }
    });
    
    // Add new match
    currentMatches[optionId] = draggedItem;
    
    // Save updated matches
    setAnswers((prev) => ({
      ...prev,
      [questionId]: JSON.stringify(currentMatches),
    }));
    
    setDraggedItem(null);
  }
};

// Get which image is matched to a specific option
const getMatchedImageForOption = (questionId: number, optionId: string): string | null => {
  if (!answers[questionId]) return null;
  
  try {
    const matches = JSON.parse(answers[questionId]);
    return matches[optionId] || null;
  } catch {
    return null;
  }
};

// Check if an image is already matched to any option
const isImageMatched = (questionId: number, imageId: string): boolean => {
  if (!answers[questionId]) return false;
  
  try {
    const matches = JSON.parse(answers[questionId]);
    return Object.values(matches).includes(imageId);
  } catch {
    return false;
  }
};

// Reset all matches for a question
const handleResetMatching = (questionId: number) => {
  setAnswers((prev) => ({
    ...prev,
    [questionId]: JSON.stringify({}),
  }));
};

  const handleSubmit = () => {
    if (validateCurrentPage()) {
      const filteredAnswers = Object.fromEntries(
        Object.entries(answers).filter(([_, answer]) => answer.trim() !== "")
      );
      console.log("Submitted answers:", filteredAnswers);
      onSubmit(filteredAnswers);
    }
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };
// Updated helper functions for vertical ordering approach




// First, make sure these helper functions are updated (replace the existing ones):

// Get ordered images for vertical sorting
const getOrderedImages = (question: Question, questionId: number) => {
  if (!question.matchingtems) return [];
  
  const savedOrder = answers[questionId];
  if (savedOrder && savedOrder.trim() !== '') {
    try {
      const orderIds = savedOrder.split(',').filter(id => id.trim() !== '');
      const orderedItems = orderIds.map(id => 
        question.matchingtems?.find(item => item.id === id)
      ).filter(Boolean) as MatchingItem[];
      
      // If we have all items in the saved order, return them
      if (orderedItems.length === question.matchingtems.length) {
        return orderedItems;
      }
    } catch (e) {
      console.error('Error parsing saved order:', e);
    }
  }
  
  // Return default order if no saved order or parsing failed
  return [...question.matchingtems];
};

// Updated drag and drop handler specifically for matching questions
const handleDrop = (e: React.DragEvent, targetPosition: number, questionId: number) => {
  e.preventDefault();
  e.stopPropagation();
  
  console.log('DROP EVENT - draggedItem:', draggedItem, 'targetPosition:', targetPosition);
  
  if (!draggedItem) {
    console.log('No dragged item, returning');
    return;
  }
  
  // Find the current question
  const currentQuestion = displayQuestions.find((_, index) => currentPage * QUESTIONS_PER_PAGE + index + 1 === questionId);
  
  if (currentQuestion?.questionTypeId === 5 && currentQuestion.matchingtems) {
    // Get current order or initialize with default order
    let currentOrder;
    const savedOrder = answers[questionId];
    
    if (savedOrder && savedOrder.trim() !== '') {
      currentOrder = savedOrder.split(',').filter(id => id.trim() !== '');
    } else {
      currentOrder = currentQuestion.matchingtems.map(item => item.id);
    }
    
    console.log('Current order before drop:', currentOrder);
    
    // Find current position of dragged item
    const currentPosition = currentOrder.indexOf(draggedItem);
    if (currentPosition === -1) {
      console.log('Dragged item not found in current order');
      return;
    }
    
    // Don't do anything if dropping at the same position
    if (currentPosition === targetPosition) {
      console.log('Dropping at same position, no change needed');
      setDraggedItem(null);
      return;
    }
    
    // Create new order array
    const newOrder = [...currentOrder];
    
    // Remove item from current position
    newOrder.splice(currentPosition, 1);
    
    // Insert at new position
    newOrder.splice(targetPosition, 0, draggedItem);
    
    console.log('New order after drop:', newOrder);
    
    // Save the new order
    setAnswers((prev) => ({
      ...prev,
      [questionId]: newOrder.join(','),
    }));
  }
  
  // Clear dragged item
  setDraggedItem(null);
};

// Fix the handleDragOver function
const handleDragOver = (e: React.DragEvent) => {
  e.preventDefault();
  e.stopPropagation();
  e.dataTransfer.dropEffect = "move";
};

// Reset the order to default
const handleResetOrder = (questionId: number) => {
  const currentQuestion = displayQuestions.find((_, index) => currentPage * QUESTIONS_PER_PAGE + index + 1 === questionId);
  if (currentQuestion?.matchingtems) {
    // Reset to original order
    const originalOrder = currentQuestion.matchingtems.map((item) => item.id);
    setAnswers((prev) => ({
      ...prev,
      [questionId]: originalOrder.join(','),
    }));
    console.log(`Question ${questionId} reset to original order:`, originalOrder.join(','));
  }
};


  const renderQuestionInput = (question: Question, index: number) => {
    const questionId = index + 1;

    switch (question.questionTypeId) {
      case 1: // Short Answer
        return (
          <input
            type="text"
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={answers[questionId] || ""}
            onChange={(e) => handleAnswerChange(questionId, e.target.value)}
            placeholder={question.placeholder || "Enter your answer..."}
            maxLength={question.characterLimit}
          />
        );

      case 2: // Long Answer
        return (
          <div>
            <textarea
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
              value={answers[questionId] || ""}
              onChange={(e) => handleAnswerChange(questionId, e.target.value)}
              placeholder={question.placeholder || "Enter your detailed answer..."}
              maxLength={question.characterLimit}
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
              <label key={option.id} className="flex items-center space-x-2 cursor-pointer">
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
                    if (question.allowMultipleSelection) {
                      handleMultipleChoiceChange(questionId, option.id, e.target.checked);
                    } else {
                      handleAnswerChange(questionId, option.id);
                    }
                  }}
                  className="w-4 h-4"
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
              <label key={option.id} className="cursor-pointer">
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
                      onChange={(e) => handleAnswerChange(questionId, option.id)}
                      className="w-4 h-4"
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
        <div className="space-y-3">
          <h4 className="font-medium text-gray-700 mb-4">Drag to sort in correct order:</h4>
          <div className="space-y-2">
            {/* Drop zone at the top */}
            <div
              className={`transition-all duration-200 ${
                draggedItem ? 'h-8 bg-blue-100 border-2 border-dashed border-blue-300 rounded opacity-70 mb-2' : 'h-0'
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
                e.dataTransfer.dropEffect = "move";
              }}
              onDrop={(e) => {
                console.log('Dropping at position: 0');
                handleDrop(e, 0, questionId);
              }}
            >
              {draggedItem && (
                <div className="flex items-center justify-center h-full">
                  <span className="text-xs text-blue-600 font-medium">Drop here for position 1</span>
                </div>
              )}
            </div>

            {getOrderedImages(question, questionId).map((item, index) => (
              <div key={`${item.id}-${index}`} className="relative">
                <div
                  draggable
                  onDragStart={(e) => {
                    console.log('Starting drag for item:', item.id);
                    e.dataTransfer.effectAllowed = "move";
                    e.dataTransfer.setData("text/plain", item.id);
                    setDraggedItem(item.id);
                  }}
                  onDragEnd={(e) => {
                    console.log('Drag ended for item:', item.id);
                    // Don't clear draggedItem here - let the drop handler clear it
                  }}
                  className={`relative bg-white border-2 rounded-lg overflow-hidden transition-all cursor-move select-none
                    ${draggedItem === item.id 
                      ? 'border-blue-400 bg-blue-50 shadow-lg opacity-70' 
                      : 'border-gray-300 hover:border-gray-400 hover:shadow-md'
                    }`}
                  style={{ minHeight: '100px' }}
                >
                  <div className="flex items-center p-3">
                    {/* Position indicator */}
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-700 mr-3 flex-shrink-0">
                      {index + 1}
                    </div>
                    
                    {/* Image */}
                    <div className="w-16 h-16 mr-3 flex-shrink-0">
                      <img
                        src={item.imageUrl}
                        alt={item.altText}
                        className="w-full h-full object-cover rounded pointer-events-none"
                        draggable={false}
                      />
                    </div>
                    
                    {/* Caption */}
                    <div className="flex-1 min-w-0 pointer-events-none">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {item.caption}
                      </p>
                    </div>
                    
                    {/* Drag handle */}
                    <div className="ml-2 flex-shrink-0 cursor-move pointer-events-none">
                      <div className="flex flex-col space-y-1 p-2 rounded hover:bg-gray-100">
                        <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                        <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                        <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                        <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                        <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                        <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Drop zone after each item */}
                <div
                  className={`transition-all duration-200 ${
                    draggedItem ? 'h-8 bg-blue-100 border-2 border-dashed border-blue-300 rounded opacity-70 my-2' : 'h-0'
                  }`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    e.dataTransfer.dropEffect = "move";
                  }}
                  onDrop={(e) => {
                    console.log('Dropping at position:', index + 1);
                    handleDrop(e, index + 1, questionId);
                  }}
                >
                  {draggedItem && (
                    <div className="flex items-center justify-center h-full">
                      <span className="text-xs text-blue-600 font-medium">Drop here for position {index + 2}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Debug info (remove in production) */}
      {answers[questionId] && (
        <div className="mt-4 p-2 bg-gray-100 rounded text-xs text-gray-600">
          Current order: {answers[questionId]}
        </div>
      )}
      
      {/* Reset button */}
      <div className="flex justify-end mt-6">
        <button
          onClick={() => handleResetOrder(questionId)}
          className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-md transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Reset Order
        </button>
      </div>
    </div>
  );

  case 6: // Star Rating
        return (
          <div className="flex items-center space-x-1">
            {[...Array(question.maxRating || 5)].map((_, i) => (
              <button
                key={i}
                onClick={() => handleStarRating(questionId, i + 1)}
                className={`p-1 transition-colors ${
                  i < parseInt(answers[questionId] || "0") ? 'text-yellow-400' : 'text-gray-300'
                }`}
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
                      onClick={() => handleAnswerChange(questionId, ratingValue.toString())}
                      className={`w-12 h-12 rounded-lg border font-medium text-sm transition-all duration-200 hover:scale-105 ${
                        isSelected
                          ? 'border-blue-500 bg-blue-500 text-white shadow-lg'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                      }`}
                    >
                      {ratingValue}
                    </button>
                  );
                }
              )}
            </div>
            
            {/* Rating labels */}
            {/* <div className="flex justify-between text-sm text-gray-600 mt-2">
              <span className="text-xs">
                {question.minRating || 1} - Poor
              </span>
              <span className="text-xs">
                {question.maxRating || 10} - Excellent
              </span>
            </div>
             */}
            {/* Selected value display */}
            {/* {answers[questionId] && (
              <div className="text-center p-2 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">
                  Selected: <span className="font-medium text-gray-800">{answers[questionId]}</span>
                </span>
              </div>
            )} */}
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
                onChange={(e) => setSearchQuery(prev => ({ ...prev, [questionId]: e.target.value }))}
                className="w-full pl-10 p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            {/* User search results would go here */}
            <div className="text-sm text-gray-500">
              Selected: {answers[questionId] || "None"}
            </div>
          </div>
        );

      default:
        return <div>Unsupported question type: {question.questionTypeId}</div>;
    }
  };

  
  // Default view when drawer is closed
  return (
    <section className="w-full h-screen flex flex-col justify-center">
      <div className="container mx-auto">
         <p className="text-gray-600 text-sm mb-2">Why I Woke Up</p>
          
          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Mission Task
          </h1>
        <div className="max-w-3xl mx-auto">
  
            <div
              ref={questionsContainerRef}
              className="flex-1 overflow-y-auto flex flex-col justify-center pr-4 space-y-6 pt-6 max-h-[calc(100vh-16rem)]"
            >
       
              {currentQuestions.map((question, index) => {
                const questionId = currentPage * QUESTIONS_PER_PAGE + index + 1;
                const hasError = validationErrors[questionId];
                
                return (
                  <div
                    id={`question-${questionId}`}
                    key={questionId}
                    className={`w-full bg-white overflow-hidden `}
                  >
                    <div
                      className={`p-2 cursor-pointer flex justify-between items-center transition-colors ${
                        activeQuestionId === questionId 
                          ? 'bg-[#FCFCFD]' 
                          : 'hover:bg-[#FCFCFD]'
                      }`}
                      onClick={() => handleQuestionClick(questionId)}
                    >
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                         
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
                      <div className={`pb-6 border-t px-4 pt-4 ${activeQuestionId === questionId && 'bg-[#FCFCFD]'} `}>
                        {question.hint && (
                          <div className="mb-3">
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                toggleHint(questionId);
                              }}
                              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                            >
                              {showHintId === questionId ? "Hide Hint" : "Show Hint"}
                            </button>
                            {showHintId === questionId && (
                              <p className="text-sm text-gray-600 mt-2 pl-4 border-l-2 border-blue-500">
                                {question.hint}
                              </p>
                            )}
                          </div>
                        )}
                        {renderQuestionInput(question, currentPage * QUESTIONS_PER_PAGE + index)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      <div className="flex justify-center mt-12 space-x-4">
        {/* Previous button */}
        {currentPage > 0 && (
          <Button
            onClick={handlePreviousPage}
            variant="default"
                          className="w-[250px] h-[50px] rounded-md flex items-center ext-[#6C50E0] font-bold justify-center gap-2 bg-gradient-to-t from-[#EDDDFF] to-[#FCFAFF]"

          >
            Previous
          </Button>
        )}

        {/* Next/Submit button */}
        {currentPage < totalPages - 1 ? (
          <Button
            onClick={handleNextPage}
            variant="default"
                          className="w-[250px] h-[50px]  rounded-md flex items-center text-white font-bold justify-center gap-2 bg-gradient-to-t from-[#B276FF] to-[#7C2BDA]"

          >
            Next 
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            variant="default"
                          className="w-[250px] h-[50px]  rounded-md flex items-center text-white font-bold justify-center gap-2 bg-gradient-to-t from-[#B276FF] to-[#7C2BDA]"

          >
            Submit <Mouse />
          </Button>
        )}
      </div>
    </section>
  );
};

export default StandardQuestions;
