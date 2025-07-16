"use client";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown, Maximize2, X, Mouse, Star, Search } from "lucide-react";
import React, { useState, useRef } from "react";
import PdfViewer from './PdfViewer';

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
  questionTypeId: string;
  description: string;
  question: string;
  hint?: string;
  sequence: number;
  hasCorrectAnswer: boolean;
  correctAnswer?: string[] | string | null;
  userAnswer: string;
  isRequired: boolean;
  characterLimit?: number;
  placeholder?: string;
  options?: Option[];
  imageOptions?: ImageOption[];
  matchingItems?: MatchingItem[];
  allowMultipleSelection?: boolean;
  maxRating?: number;
  minRating?: number;
  userSearchConfig?: UserSearchConfig;
}

interface MissionVideoQuestionsProps {
  questions: Question[];
  onSubmit: (answers: { [key: number]: string }) => void;
  missionType?: 'VIDEO_MISSION' | 'MISSION_PDF';
  fileUrl?: string;
}

const MissionVideoQuestions = ({
  questions,
  onSubmit,
  missionType = 'VIDEO_MISSION',
  fileUrl = '',
}: MissionVideoQuestionsProps) => {
  console.log("MissionVideoQuestions Props:", { questions, onSubmit, missionType, fileUrl }); 
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
   const displayQuestions = questions?.length > 0 ? questions : sampleQuestions1


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

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, targetPosition: number, questionId: number) => {
    e.preventDefault();
    if (draggedItem) {
      // For matching questions, we work with matchingItems
      const currentQuestion = displayQuestions.find((_, index) => index + 1 === questionId);
      if (currentQuestion?.questionTypeId === "W" && 'matchingItems' in currentQuestion && currentQuestion.matchingItems) {
        // Get current order or initialize with default order
        const currentOrder = answers[questionId] ? 
          answers[questionId].split(',') : 
          currentQuestion.matchingItems.map((item: MatchingItem) => item.id);
        
        // Remove the dragged item from its current position
        const filteredOrder = currentOrder.filter((id: string) => id !== draggedItem);
        
        // Insert the dragged item at the target position
        filteredOrder.splice(targetPosition, 0, draggedItem);
        
        setAnswers((prev) => ({
          ...prev,
          [questionId]: filteredOrder.join(','),
        }));
      } else {
        // Original logic for other question types
        const currentOrder = answers[questionId] ? 
          answers[questionId].split(',') : 
          currentQuestion?.options?.map(opt => opt.id) || [];
        
        const filteredOrder = currentOrder.filter((id: string) => id !== draggedItem);
        filteredOrder.splice(targetPosition, 0, draggedItem);
        
        setAnswers((prev) => ({
          ...prev,
          [questionId]: filteredOrder.join(','),
        }));
      }
      
      setDraggedItem(null);
    }
  };

  const getOrderedOptions = (question: Question, questionId: number) => {
    if (!question.options) return [];
    
    const savedOrder = answers[questionId];
    if (savedOrder) {
      const orderIds = savedOrder.split(',');
      return orderIds.map(id => question.options?.find(opt => opt.id === id)).filter(Boolean) as Option[];
    }
    
    // Return default order
    return question.options;
  };

  const getOrderedImages = (question: Question, questionId: number) => {
    if (!question.matchingItems) return [];
    
    const savedOrder = answers[questionId];
    if (savedOrder) {
      const orderIds = savedOrder.split(',');
      return orderIds.map(id => question.matchingItems?.find(item => item.id === id)).filter(Boolean) as MatchingItem[];
    }
    
    // Return default order
    return question.matchingItems;
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

  // Render content based on mission type
  const renderContent = () => {
    if (missionType === 'MISSION_PDF' && fileUrl) {
      return (
        <div className="w-full h-full min-h-[600px]">
          <PdfViewer url={fileUrl} />
        </div>
      );
    } else if (missionType === 'VIDEO_MISSION' && fileUrl) {
      return (
        <video 
          controls 
          className="w-full h-full object-cover rounded-lg"
        >
          <source src={fileUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      );
    } else {
      // Fallback placeholder
      return (
        <div className="border-2 border-dashed border-gray-300 bg-gray-50 aspect-video rounded-lg flex items-center justify-center">
          <span className="text-gray-500">
            {missionType === 'MISSION_PDF' ? 'PDF Placeholder' : 'Video Placeholder'}
          </span>
        </div>
      );
    }
  };

  const renderQuestionInput = (question: Question, index: number) => {
    const questionId = index + 1;

    switch (question.questionTypeId) {
      case "S": // Short Answer
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

      case "L": // Long Answer
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

      case "M": // Multiple Choice
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

      case "P": // Image Choice
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

      case "W": // Matching
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-6">
              {/* Static Text Content - Left Column */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-700 mb-4">Content:</h4>
                {question.options?.map((option, index) => (
                  <div
                    key={option.id}
                    className="p-4 bg-white border border-gray-200 rounded-lg"
                  >
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Heading {index + 1}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {option.text}
                    </p>
                  </div>
                ))}
              </div>

              {/* Draggable Images - Right Column */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-700 mb-4">Drag images to match:</h4>
                <div className="space-y-3">
                  {getOrderedImages(question, questionId).map((item, index) => (
                    <div key={`ordered-${item.id}-${index}`}>
                      <div
                        draggable
                        onDragStart={(e) => handleDragStart(e, item.id)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, index, questionId)}
                        className={`relative bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden cursor-move transition-all
                          ${draggedItem === item.id 
                            ? 'border-blue-400 bg-blue-50 opacity-50 scale-105' 
                            : 'hover:border-gray-400 hover:bg-gray-50'
                          }`}
                        style={{ aspectRatio: '4/3', minHeight: '120px' }}
                      >
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.altText}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="text-center">
                              <div className="w-12 h-12 mx-auto mb-2 bg-gray-300 rounded flex items-center justify-center">
                                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                              <span className="text-xs text-gray-500">Image {index + 1}</span>
                            </div>
                          </div>
                        )}
                        
                        {/* Position indicator */}
                        <div className="absolute top-2 left-2 w-6 h-6 bg-white rounded-full flex items-center justify-center text-xs font-medium text-gray-700 shadow-sm">
                          {index + 1}
                        </div>
                        
                        {/* Drag handle */}
                        <div className="absolute top-2 right-2 bg-white rounded p-1 shadow-sm">
                          <div className="flex flex-col space-y-0.5">
                            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Drop zone after each item */}
                      {index < getOrderedImages(question, questionId).length - 1 && (
                        <div
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, index + 1, questionId)}
                          className={`h-3 border-2 border-dashed border-transparent rounded transition-colors mt-2
                            ${draggedItem ? 'border-blue-300 bg-blue-50' : ''}`}
                        />
                      )}
                    </div>
                  ))}
                  
                  {/* Final drop zone */}
                  <div
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, getOrderedImages(question, questionId).length, questionId)}
                    className={`h-3 border-2 border-dashed border-transparent rounded transition-colors
                      ${draggedItem ? 'border-blue-300 bg-blue-50' : ''}`}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case "R": // Star Rating
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

      case "N": // Number Rating
        return (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {Array.from(
                { length: (question.maxRating || 10) - (question.minRating || 1) + 1 },
                (_, index) => {
                  const ratingValue = (question.minRating || 1) + index;
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

      case "U": // User Search
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
                <h1 className="text-2xl font-bold">Joining the Curious Club</h1>
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
              <div className="w-full h-full max-w-4xl">
                {renderContent()}
              </div>
            </div>

            {/* Bottom Button */}
            <div className="flex justify-center mt-8">
              <Button
                onClick={toggleDrawer}
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
        <div className="grid grid-cols-6 w-full pl-24 h-[calc(100vh-20rem)]">
          <div className="col-span-3 flex flex-col h-full justify-center">
            <div className="relative w-[90%]">
              {/* Content here */}
              <div className=" aspect-video rounded-[15px] flex items-center justify-center relative">
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

          <div className="col-span-3 flex flex-col h-full">
            <div
              ref={questionsContainerRef}
              className="flex-1 overflow-y-auto flex flex-col justify-center pr-4 space-y-6 pt-6 max-h-[calc(100vh-16rem)]"
            >
              {/* Page indicator */}
              {/* <div className="flex justify-between items-center mb-4">
                <div className="text-sm text-gray-500">
                  Page {currentPage + 1} of {totalPages}
                </div>
                <div className="flex space-x-2">
                  {Array.from({ length: totalPages }, (_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full ${
                        index === currentPage ? 'bg-blue-500' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div> */}

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
                          ? 'bg-blue-50 border-blue-200' 
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => handleQuestionClick(questionId)}
                    >
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-gray-500">
                            Question {questionId} ({question.questionTypeId})
                          </span>
                          {question.isRequired && (
                            <span className="text-red-500 text-sm">*</span>
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
      </div>
      <div className="flex justify-center mt-8 space-x-4">
        {/* Previous button */}
        {currentPage > 0 && (
          <Button
            onClick={handlePreviousPage}
            variant="default"
                          className="w-[250px] h-[50px] rounded-md flex items-center text-white font-bold justify-center gap-2 bg-gradient-to-t from-[#B276FF] to-[#7C2BDA]"

          >
            Previous
          </Button>
        )}

        {/* Next/Submit button */}
        {currentPage < totalPages - 1 ? (
          <Button
            onClick={handleNextPage}
            variant="default"
                          className="w-[250px] h-[50px] border-[1.5px] border-[#B276FF] rounded-md flex items-center text-[#6C50E0] font-bold justify-center gap-2 bg-gradient-to-t from-[#EDDDFF] to-[#FCFAFF]"

          >
            Next 
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            variant="default"
                          className="w-[250px] h-[50px] border border-[#B276FF] rounded-md flex items-center text-[#6C50E0] font-bold justify-center gap-2 bg-gradient-to-t from-[#EDDDFF] to-[#FCFAFF]"

          >
            Submit <Mouse />
          </Button>
        )}
      </div>
    </section>
  );
};

export default MissionVideoQuestions;

export const sampleQuestions1 = [
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

  // // Long Answer (L) - Open-ended
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

  // // QUESTIONS WITH CORRECT ANSWERS (Quiz/Assessment missions)
  
  // // Multiple Choice (M) - Has correct answer
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
      { id: "1", imageUrl: "https://placehold.co/600x400", altText: "Cat", caption: "Cat", isCorrect: true },
      { id: "2", imageUrl: "https://placehold.co/600x400", altText: "Fish", caption: "Fish", isCorrect: false },
      { id: "3", imageUrl: "https://placehold.co/600x400", altText: "Bird", caption: "Bird", isCorrect: false },
      { id: "4", imageUrl: "https://placehold.co/600x400", altText: "Snake", caption: "Snake", isCorrect: false }
    ],
  },

  // Matching (W) - Has correct answer
  // {
  //   questionTypeId: "W",
  //   description: "Sequence arrangement",
  //   question: "Arrange these steps in the correct order for making coffee:",
  //   hint: "Drag and drop the items to match the images with their correct captions",
  //   sequence: 5,
  //   hasCorrectAnswer: true, // Has correct order
  //   correctAnswer: ["2-A", "1-B", "4-C", "3-D"], // Correct order by item IDs
  //   userAnswer: "",
  //   isRequired: true,
  //   matchingItems: [
  //     { id: "1", imageUrl: "https://placehold.co/600x400?text=1", altText: "Cat", caption: "Cat", matchPosition: 2},
  //     { id: "2", imageUrl: "https://placehold.co/600x400?text=2", altText: "Fish", caption: "Fish", matchPosition: 1},
  //     { id: "3", imageUrl: "https://placehold.co/600x400?text=3", altText: "Bird", caption: "Bird", matchPosition: 3},
  //     { id: "4", imageUrl: "https://placehold.co/600x400?text=4", altText: "Snake", caption: "Snake", matchPosition: 4}
  //   ],
  //   options: [
  //     { id: "1", text: "JavaScript", matchPosition: 1 },
  //     { id: "2", text: "Python", matchPosition: 4 },
  //     { id: "3", text: "HTML", matchPosition: 2 },
  //     { id: "4", text: "Java", matchPosition: 3 },
  //   ],
  // },

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
  // {
  //   questionTypeId: "U",
  //   description: "Team member selection",
  //   question: "Who is the current CEO of the company?",
  //   hint: "Search and select the correct user",
  //   sequence: 8,
  //   hasCorrectAnswer: true, // Has a specific correct person
  //   correctAnswer: "ceo@company.com", // Email or ID of correct user
  //   userAnswer: "",
  //   isRequired: true,
  //   userSearchConfig: {
  //     searchBy: ["name", "email"],
  //     allowMultipleUsers: false,
  //   },
  // },
]