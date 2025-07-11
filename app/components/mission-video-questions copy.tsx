"use client";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown, Maximize2, X, Mouse, Star, User, Search } from "lucide-react";
import React, { useState, useRef } from "react";

interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface ImageOption {
  id: string;
  imageUrl: string;
  altText: string;
  caption: string;
  isCorrect: boolean;
}

interface SortingItem {
  id: string;
  text: string;
  correctOrder: number;
}

interface UserSearchConfig {
  searchBy: string[];
  allowMultipleUsers: boolean;
}

interface Question {
  questionTypeId: string;
  description?: string;
  question: string;
  hint?: string;
  sequence: number;
  hasCorrectAnswer: boolean;
  correctAnswer: string[] | string | null;
  userAnswer: string;
  isRequired: boolean;
  characterLimit?: number;
  placeholder?: string;
  options?: Option[];
  allowMultipleSelection?: boolean;
  imageOptions?: ImageOption[];
  sortingItems?: SortingItem[];
  maxRating?: number;
  minRating?: number;
  userSearchConfig?: UserSearchConfig;
}

interface MissionVideoQuestionsProps {
  questions: Question[];
  onSubmit: (answers: { [key: number]: string }) => void;
}

const MissionVideoQuestions = ({
  questions,
  onSubmit,
}: MissionVideoQuestionsProps) => {
  const [activeQuestionId, setActiveQuestionId] = useState<number | null>(null);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [showHintId, setShowHintId] = useState<number | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [sortedItems, setSortedItems] = useState<{ [key: number]: SortingItem[] }>({});
  const [userSearchQuery, setUserSearchQuery] = useState<{ [key: number]: string }>({});
  const [currentPage, setCurrentPage] = useState<number>(0);
  const questionsContainerRef = useRef<HTMLDivElement>(null);
  
  const questionsPerPage = 3;

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

  const handleMultipleChoiceChange = (questionId: number, optionId: string, isMultiple: boolean) => {
    const currentAnswer = answers[questionId] || "";
    const selectedIds = currentAnswer ? currentAnswer.split(",") : [];
    
    let newSelectedIds: string[];
    
    if (isMultiple) {
      if (selectedIds.includes(optionId)) {
        newSelectedIds = selectedIds.filter(id => id !== optionId);
      } else {
        newSelectedIds = [...selectedIds, optionId];
      }
    } else {
      newSelectedIds = [optionId];
    }
    
    setAnswers((prev) => ({
      ...prev,
      [questionId]: newSelectedIds.join(","),
    }));
  };

  const handleRatingChange = (questionId: number, rating: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: rating.toString(),
    }));
  };

  const handleSortingChange = (questionId: number, newOrder: SortingItem[]) => {
    setSortedItems((prev) => ({
      ...prev,
      [questionId]: newOrder,
    }));
    
    const orderIds = newOrder.map(item => item.id);
    setAnswers((prev) => ({
      ...prev,
      [questionId]: orderIds.join(","),
    }));
  };

  const moveItem = (questionId: number, fromIndex: number, toIndex: number) => {
    const currentItems = sortedItems[questionId] || [];
    const newItems = [...currentItems];
    const [movedItem] = newItems.splice(fromIndex, 1);
    newItems.splice(toIndex, 0, movedItem);
    handleSortingChange(questionId, newItems);
  };

  const handleSubmit = () => {
    const currentQuestions = getCurrentPageQuestions();
    const startIndex = currentPage * questionsPerPage;
    const endIndex = startIndex + questionsPerPage;
    
    // Check if there are more questions to show
    if (endIndex < sampleQuestions.length) {
      // Move to next page
      setCurrentPage(prev => prev + 1);
      setActiveQuestionId(null); // Reset active question for new page
    } else {
      // Final submission
      const filteredAnswers = Object.fromEntries(
        Object.entries(answers).filter(([_, answer]) => answer.trim() !== "")
      );
      console.log("Final submitted answers:", filteredAnswers);
      onSubmit(filteredAnswers);
    }
  };

  const getCurrentPageQuestions = () => {
    const startIndex = currentPage * questionsPerPage;
    const endIndex = startIndex + questionsPerPage;
    return sampleQuestions.slice(startIndex, endIndex);
  };

  const getTotalPages = () => {
    return Math.ceil(sampleQuestions.length / questionsPerPage);
  };

  const isLastPage = () => {
    return currentPage === getTotalPages() - 1;
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  // Sample questions for demo
  const sampleQuestions = questions.length > 0 ? questions : [
    {
      questionTypeId: "S",
      description: "Basic information gathering",
      question: "What is your favorite color?",
      hint: "Enter a single word or short phrase",
      sequence: 1,
      hasCorrectAnswer: false,
      correctAnswer: null,
      userAnswer: "",
      isRequired: true,
      characterLimit: 50,
      placeholder: "e.g., Blue, Red, Green",
    },
    {
      questionTypeId: "L",
      description: "Detailed feedback collection",
      question: "Describe your experience with our customer service team.",
      hint: "Please provide detailed feedback about your interaction",
      sequence: 2,
      hasCorrectAnswer: false,
      correctAnswer: null,
      userAnswer: "",
      isRequired: true,
      characterLimit: 500,
      placeholder: "Share your detailed thoughts and experiences...",
    },
    {
      questionTypeId: "M",
      description: "Knowledge assessment",
      question: "Which of the following are programming languages?",
      hint: "Select all that apply",
      sequence: 3,
      hasCorrectAnswer: true,
      correctAnswer: ["1", "2", "4"],
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
    {
      questionTypeId: "R",
      description: "Service satisfaction",
      question: "How would you rate your overall experience with our service?",
      hint: "Click on the stars to give your rating (1 = Poor, 5 = Excellent)",
      sequence: 4,
      hasCorrectAnswer: false,
      correctAnswer: null,
      userAnswer: "",
      isRequired: true,
      maxRating: 5,
    },
    {
      questionTypeId: "P",
      description: "Visual identification",
      question: "Which of these animals is a mammal?",
      hint: "Look carefully at each image and select the correct answer",
      sequence: 5,
      hasCorrectAnswer: true,
      correctAnswer: ["1"],
      userAnswer: "",
      isRequired: true,
      imageOptions: [
        { id: "1", imageUrl: "/images/cat.jpg", altText: "Cat", caption: "Cat", isCorrect: true },
        { id: "2", imageUrl: "/images/fish.jpg", altText: "Fish", caption: "Fish", isCorrect: false },
        { id: "3", imageUrl: "/images/bird.jpg", altText: "Bird", caption: "Bird", isCorrect: false },
        { id: "4", imageUrl: "/images/snake.jpg", altText: "Snake", caption: "Snake", isCorrect: false }
      ],
    },
    {
      questionTypeId: "W",
      description: "Sequence arrangement",
      question: "Arrange these steps in the correct order for making coffee:",
      hint: "Drag and drop the items to sort them in the correct sequence",
      sequence: 6,
      hasCorrectAnswer: true,
      correctAnswer: ["2", "4", "5", "3", "1"],
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
    {
      questionTypeId: "N",
      description: "Likelihood assessment",
      question: "On a scale of 1 to 10, how likely are you to recommend our product to a friend?",
      hint: "1 = Not at all likely, 10 = Extremely likely",
      sequence: 7,
      hasCorrectAnswer: false,
      correctAnswer: null,
      userAnswer: "",
      isRequired: true,
      minRating: 1,
      maxRating: 10,
    },
    {
      questionTypeId: "U",
      description: "Team member selection",
      question: "Who is the current CEO of the company?",
      hint: "Search and select the correct user",
      sequence: 8,
      hasCorrectAnswer: true,
      correctAnswer: "ceo@company.com",
      userAnswer: "",
      isRequired: true,
      userSearchConfig: {
        searchBy: ["name", "email"],
        allowMultipleUsers: false,
      },
    },
  ];

  const renderQuestionInput = (question: Question, questionIndex: number) => {
    // Calculate the actual question ID based on current page
    const questionId = (currentPage * questionsPerPage) + questionIndex + 1;
    
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
              placeholder={question.placeholder || "Enter your answer..."}
              maxLength={question.characterLimit}
            />
            {question.characterLimit && (
              <div className="text-sm text-gray-500 mt-1 text-right">
                {(answers[questionId] || "").length}/{question.characterLimit}
              </div>
            )}
          </div>
        );

      case "M": // Multiple Choice
        const selectedOptions = answers[questionId] ? answers[questionId].split(",") : [];
        return (
          <div className="space-y-2">
            {question.options?.map((option) => (
              <label key={option.id} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type={question.allowMultipleSelection ? "checkbox" : "radio"}
                  name={`question-${questionId}`}
                  checked={selectedOptions.includes(option.id)}
                  onChange={() => handleMultipleChoiceChange(questionId, option.id, question.allowMultipleSelection || false)}
                  className="form-checkbox h-4 w-4 text-blue-600"
                />
                <span>{option.text}</span>
              </label>
            ))}
          </div>
        );

      case "P": // Image Choice
        const selectedImages = answers[questionId] ? answers[questionId].split(",") : [];
        return (
          <div className="grid grid-cols-4 gap-4">
            {question.imageOptions?.map((imageOption) => (
              <div
                key={imageOption.id}
                className={`border-2 rounded-lg p-2 cursor-pointer transition-colors ${
                  selectedImages.includes(imageOption.id) ? "border-blue-500 bg-blue-50" : "border-gray-300"
                }`}
                onClick={() => handleMultipleChoiceChange(questionId, imageOption.id, false)}
              >
                <div className="bg-gray-200 aspect-square rounded mb-2 flex items-center justify-center">
                  <span className="text-gray-500">{imageOption.caption}</span>
                </div>
                <p className="text-sm text-center">{imageOption.caption}</p>
              </div>
            ))}
          </div>
        );

      case "W": // Sorting
        const currentItems = sortedItems[questionId] || question.sortingItems || [];
        return (
          <div className="space-y-2">
            {currentItems.map((item, itemIndex) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
              >
                <span>{item.text}</span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => moveItem(questionId, itemIndex, Math.max(0, itemIndex - 1))}
                    disabled={itemIndex === 0}
                    className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => moveItem(questionId, itemIndex, Math.min(currentItems.length - 1, itemIndex + 1))}
                    disabled={itemIndex === currentItems.length - 1}
                    className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        );

      case "R": // Star Rating
        const starRating = parseInt(answers[questionId] || "0");
        const maxStars = question.maxRating || 5;
        return (
          <div className="flex space-x-1">
            {[...Array(maxStars)].map((_, i) => (
              <Star
                key={i}
                className={`w-12 h-12 cursor-pointer ${
                  i < starRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                }`}
                onClick={() => handleRatingChange(questionId, i + 1)}
              />
            ))}
          </div>
        );

      case "N": // Number Rating
        const numberRating = parseInt(answers[questionId] || "0");
        const minRating = question.minRating || 1;
        const maxRating = question.maxRating || 10;
        return (
          <div className="flex space-x-2">
            {[...Array(maxRating - minRating + 1)].map((_, i) => {
              const value = minRating + i;
              return (
                <button
                  key={value}
                  onClick={() => handleRatingChange(questionId, value)}
                  className={`px-4 py-3 border ${
                    numberRating === value
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {value}
                </button>
              );
            })}
          </div>
        );

      case "U": // User Search
        return (
          <div className="space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                className="w-full pl-10 pr-4 py-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Search for users..."
                value={userSearchQuery[questionId] || ""}
                onChange={(e) => setUserSearchQuery(prev => ({ ...prev, [questionId]: e.target.value }))}
              />
            </div>
            {answers[questionId] && (
              <div className="flex items-center space-x-2 p-2 bg-blue-50 rounded-lg">
                <User className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-blue-800">{answers[questionId]}</span>
                <button
                  onClick={() => handleAnswerChange(questionId, "")}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        );

      default:
        return (
          <input
            type="text"
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={answers[questionId] || ""}
            onChange={(e) => handleAnswerChange(questionId, e.target.value)}
            placeholder="Enter your answer..."
          />
        );
    }
  };

  // When drawer is open - matches the PDF viewer layout
  if (isDrawerOpen) {
    return (
      <div className="relative z-50 h-full bg-white flex flex-col mx-auto">
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
              <Button 
                onClick={toggleDrawer} 
                variant="default"
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

  // Initialize sorted items for sorting questions
  React.useEffect(() => {
    const currentQuestions = getCurrentPageQuestions();
    currentQuestions.forEach((question, index) => {
      if (question.questionTypeId === "W" && question.sortingItems) {
        const questionId = (currentPage * questionsPerPage) + index + 1;
        if (!sortedItems[questionId]) {
          setSortedItems(prev => ({
            ...prev,
            [questionId]: [...question.sortingItems!]
          }));
        }
      }
    });
  }, [currentPage, sampleQuestions]);

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
              {/* Progress indicator */}
              {/* <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Page {currentPage + 1} of {getTotalPages()}
                  </span>
                  <span className="text-sm text-gray-500">
                    Questions {(currentPage * questionsPerPage) + 1} - {Math.min((currentPage + 1) * questionsPerPage, sampleQuestions.length)} of {sampleQuestions.length}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentPage + 1) / getTotalPages()) * 100}%` }}
                  ></div>
                </div>
              </div> */}

              {getCurrentPageQuestions().map((question, index) => {
                const questionId = (currentPage * questionsPerPage) + index + 1;
                const displayIndex = index + 1;
                
                return (
                  <div
                    id={`question-${questionId}`}
                    key={questionId}
                    className="w-full bg-white overflow-hidden"
                  >
                    <div
                      className="p-2 cursor-pointer flex justify-between items-center hover:bg-gray-50"
                      onClick={() => handleQuestionClick(questionId)}
                    >
                      <div className="flex flex-col gap-2">
                        <span className="text-sm font-semibold text-gray-500">
                          Question {displayIndex} ({question.questionTypeId})
                        </span>
                        <h3 className="text-[13px] text-black font-bold">
                          {question.question}
                        </h3>
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
                        {renderQuestionInput(question, index)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center mt-8">
        <Button 
          onClick={handleSubmit} 
          variant="default"
          className="w-[250px] h-[50px] flex items-center justify-center gap-2 bg-[#36CEF8]"
        >
          {isLastPage() ? "Submit" : "Next"} <Mouse />
        </Button>
      </div>
    </section>
  );
};

export default MissionVideoQuestions;