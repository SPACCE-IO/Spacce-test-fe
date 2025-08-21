"use client";

import { useEffect, useState, useRef } from "react";
import React from "react";

interface Position {
  x: number; // percentage of image width
  y: number; // percentage of image height
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
  width: number; // percentage of image width
  height: number; // percentage of image height
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
  const [containerWidth, setContainerWidth] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    console.log("Image URL:", imageUrl);
    console.log("Image loading state:", { isLoading, imageLoaded, error });
  }, [imageUrl, isLoading, imageLoaded, error]);

  // Update container width and calculate scale
  useEffect(() => {
    const updateContainerWidth = () => {
      if (containerRef.current && imageDimensions.width > 0) {
        const containerW = containerRef.current.offsetWidth;
        setContainerWidth(containerW);
        // Calculate scale based on container width vs natural image width
        const calculatedScale = containerW / imageDimensions.width;
        setScale(calculatedScale);
      }
    };

    updateContainerWidth();
    window.addEventListener("resize", updateContainerWidth);

    return () => window.removeEventListener("resize", updateContainerWidth);
  }, [imageDimensions]);

  // Reset loading state when imageUrl changes
  useEffect(() => {
    setIsLoading(true);
    setImageLoaded(false);
    setError(null);
    setImageDimensions({ width: 0, height: 0 });
  }, [imageUrl]);

  // Preload image to handle loading issues
  useEffect(() => {
    if (!imageUrl) return;

    const img = new Image();

    const handleLoad = () => {
      console.log("Preloaded image successfully:", imageUrl);
      setImageDimensions({
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
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
    const img = e.currentTarget;
    console.log("Image dimensions:", img.naturalWidth, "x", img.naturalHeight);
    setImageDimensions({ width: img.naturalWidth, height: img.naturalHeight });
    setImageLoaded(true);
    setIsLoading(false);

    // Calculate initial scale based on container width
    if (containerRef.current) {
      const containerW = containerRef.current.offsetWidth;
      setContainerWidth(containerW);
      const calculatedScale = containerW / img.naturalWidth;
      setScale(calculatedScale);
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.error("Image load error:", e);
    console.error("Failed to load image URL:", imageUrl);
    setError(`Failed to load image: ${imageUrl}`);
    setIsLoading(false);
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

    if (
      !imageRef.current ||
      imageDimensions.width === 0 ||
      imageDimensions.height === 0
    ) {
      return null;
    }

    // Get the actual displayed image dimensions (after scaling)
    const displayedImageWidth = imageDimensions.width * scale;
    const displayedImageHeight = imageDimensions.height * scale;

    // Calculate position based on percentages
    const left = (position.x / 100) * displayedImageWidth;
    const top = (position.y / 100) * displayedImageHeight;
    const width = (inputDimensions.width / 100) * displayedImageWidth;
    const height = (inputDimensions.height / 100) * displayedImageHeight;

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
      padding: `${style.padding * scale}px`,
      margin: `${style.margin * scale}px`,
      textAlign: style.textAlign as "left" | "center" | "right",
      resize: "none" as const,
      outline: "none",
      transition: "all 0.2s ease",
      zIndex: 10,
      boxSizing: "border-box" as const,
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
        <div className="relative shadow-lg overflow-hidden w-full">
          <img
            ref={imageRef}
            src={imageUrl}
            alt="Question Form"
            style={{
              display: "block",
              width: "100%",
              height: "auto",
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
