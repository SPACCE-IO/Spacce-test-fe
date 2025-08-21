"use client";

import { useEffect, useState, useRef } from "react";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

interface Position {
  x: number;
  y: number;
}

interface Style {
  color: string;
  fontSize: number;
  fontWeight: number;
  fontFamily: string;
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
  borderRadius: number;
  padding: number;
  margin: number;
  textAlign: string;
}

interface InputDimensions {
  width: number;
  height: number;
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
  position: Position;
  style: Style;
  inputDimensions: InputDimensions;
  characterLimit: number;
  lastUpdate: number;
  userAnswer: string;
  status: number;
  correctAnswer: string | null;
}

interface ImageQuestionViewerProps {
  imageUrl: string;
  questions: Question[];
  onAnswerChange?: (questionId: number, answer: string) => void;
}

const ImageQuestionViewer = ({
  imageUrl,
  questions,
  onAnswerChange,
}: ImageQuestionViewerProps) => {
  const [scale, setScale] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    console.log("Image URL:", imageUrl);
    console.log("Image loading state:", { isLoading, imageLoaded, error });
  }, [imageUrl, isLoading, imageLoaded, error]);

  // Reset loading state when imageUrl changes
  useEffect(() => {
    setIsLoading(true);
    setImageLoaded(false);
    setError(null);
  }, [imageUrl]);

  // Preload image to handle loading issues
  useEffect(() => {
    if (!imageUrl) return;

    const img = new Image();

    const handleLoad = () => {
      console.log("Preloaded image successfully:", imageUrl);
      setImageLoaded(true);
      setIsLoading(false);
    };

    const handleError = () => {
      console.error("Failed to preload image:", imageUrl);
      setError(`Failed to load image: ${imageUrl}`);
      setIsLoading(false);
    };

    // Add timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      console.warn("Image loading timeout:", imageUrl);
      setError(`Image loading timeout: ${imageUrl}`);
      setIsLoading(false);
    }, 10000);

    img.onload = () => {
      clearTimeout(timeout);
      handleLoad();
    };

    img.onerror = () => {
      clearTimeout(timeout);
      handleError();
    };

    img.src = imageUrl;

    return () => {
      clearTimeout(timeout);
      img.onload = null;
      img.onerror = null;
    };
  }, [imageUrl]);

  // Initialize answers from questions
  useEffect(() => {
    const initialAnswers: Record<number, string> = {};
    questions.forEach((q) => {
      try {
        const parsedAnswer = q.userAnswer ? JSON.parse(q.userAnswer) : "";
        initialAnswers[q.id] = parsedAnswer || "";
      } catch {
        initialAnswers[q.id] = q.userAnswer || "";
      }
    });
    setAnswers(initialAnswers);
  }, [questions]);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.log("Image loaded successfully:", imageUrl);
    console.log(
      "Image dimensions:",
      e.currentTarget.naturalWidth,
      "x",
      e.currentTarget.naturalHeight
    );
    setImageLoaded(true);
    setIsLoading(false);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.error("Image load error:", e);
    console.error("Failed to load image URL:", imageUrl);
    setError(`Failed to load image: ${imageUrl}`);
    setIsLoading(false);
  };

  const zoomIn = () => {
    setScale((prev) => Math.min(prev + 0.2, 3));
  };

  const zoomOut = () => {
    setScale((prev) => Math.max(prev - 0.2, 0.5));
  };

  const resetZoom = () => {
    setScale(1);
  };

  const handleAnswerChange = (questionId: number, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
    onAnswerChange?.(questionId, value);
  };

  const renderInputField = (question: Question) => {
    const { position, style, inputDimensions, typeCode, placeholder, hint } =
      question;
    const currentAnswer = answers[question.id] || "";

    // Calculate position based on image scale
    const left = position.x * scale;
    const top = position.y * scale;
    const width = inputDimensions.width * scale;
    const height = inputDimensions.height * scale;

    const inputStyle = {
      position: "absolute" as const,
      left: `${left}px`,
      top: `${top}px`,
      width: `${width}px`,
      height: `${height}px`,
      color: style.color,
      fontSize: `${style.fontSize * scale}px`,
      fontWeight: style.fontWeight,
      fontFamily: style.fontFamily,
      backgroundColor: style.backgroundColor,
      borderColor: style.borderColor,
      borderWidth: `${style.borderWidth}px`,
      borderStyle: "solid",
      borderRadius: `${style.borderRadius}px`,
      padding: `${style.padding}px`,
      margin: `${style.margin}px`,
      textAlign: style.textAlign as "left" | "center" | "right",
      resize: "none" as const,
      outline: "none",
      transition: "all 0.2s ease",
      zIndex: 10,
    };

    // Render different input types based on typeCode
    switch (typeCode) {
      case "S": // Short answer
        return (
          <input
            key={question.id}
            type="text"
            style={inputStyle}
            placeholder={placeholder}
            title={hint}
            value={currentAnswer}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            maxLength={question.characterLimit}
            required={question.isRequired}
            className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        );

      case "L": // Long answer
        return (
          <textarea
            key={question.id}
            style={inputStyle}
            placeholder={placeholder}
            title={hint}
            value={currentAnswer}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            maxLength={question.characterLimit}
            required={question.isRequired}
            className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        );

      case "U": // User search/selection
        return (
          <input
            key={question.id}
            type="email"
            style={inputStyle}
            placeholder={placeholder || "Enter email"}
            title={hint}
            value={currentAnswer}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            maxLength={question.characterLimit}
            required={question.isRequired}
            className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        );

      default:
        return (
          <input
            key={question.id}
            type="text"
            style={inputStyle}
            placeholder={placeholder}
            title={hint}
            value={currentAnswer}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            maxLength={question.characterLimit}
            required={question.isRequired}
            className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        );
    }
  };

  if (error) {
    return (
      <div className="h-full w-full bg-red-50 flex items-center justify-center rounded-lg border-2 border-red-200">
        <div className="text-red-600 text-center">
          <div className="text-lg font-semibold mb-2">Error Loading Image</div>
          <div className="text-sm">{error}</div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="h-full w-full bg-gray-100 flex items-center justify-center rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-gray-600">Loading Image...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col bg-white border">
  
      {/* Image Container with Questions */}
      <div
        ref={containerRef}
        className="flex-1 overflow-auto relative"
        style={{ minHeight: "400px" }}
      >
        <div className="relative inline-block shadow-lg w-full overflow-hidden">
          <img
            ref={imageRef}
            src={imageUrl}
            alt="Question Form"
            style={{
              transform: `scale(${scale})`,
              transformOrigin: "top left",
              display: "block",
              maxWidth: "none",
              width:'100%'
            }}
            onLoad={handleImageLoad}
            onError={handleImageError}
            className="block"
          />

          {/* Render question input fields */}
          {imageLoaded &&
            questions.map((question) => renderInputField(question))}
        </div>
      </div>

    </div>
  );
};

export default ImageQuestionViewer;
