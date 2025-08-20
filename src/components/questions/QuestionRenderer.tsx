"use client";
import React from "react";
import { ShortAnswerQuestion } from "./ShortAnswerQuestion";
import { LongAnswerQuestion } from "./LongAnswerQuestion";
import { MultipleChoiceQuestion } from "./MultipleChoiceQuestion";
import { ImageChoiceQuestion } from "./ImageChoiceQuestion";
import { MatchingSortingQuestion } from "./MatchingSortingQuestion";
import { StarRatingQuestion } from "./StarRatingQuestion";
import { NumberRatingQuestion } from "./NumberRatingQuestion";
import { UserSearchQuestion } from "./UserSearchQuestion";
import { Option, ImageOption, MatchingItem } from "./types";

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
  characterLimit?: number;
  options?: Option[];
  imageOptions?: ImageOption[];
  maxRating?: number;
  allowMultipleSelection?: boolean;
  matchingtems?: Array<{
    id: string;
    altText: string;
    caption: string;
    imageUrl: string;
  }>; // Match the original structure exactly
}

interface QuestionRendererProps {
  question: Question;
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
  isAnsweredCorrectly: boolean;
  isSubmitting: boolean;
}

export const QuestionRenderer: React.FC<QuestionRendererProps> = ({
  question,
  value,
  onChange,
  disabled,
  isAnsweredCorrectly,
  isSubmitting,
}) => {
  const baseProps = {
    questionId: question.id,
    value,
    onChange,
    disabled: disabled || isSubmitting || isAnsweredCorrectly,
    isAnsweredCorrectly,
    isSubmitting,
  };

  switch (question.questionTypeId) {
    case 1: // Short Answer
      return (
        <ShortAnswerQuestion
          {...baseProps}
          placeholder={question.placeholder}
          characterLimit={question.characterLimit}
        />
      );

    case 2: // Long Answer
      return (
        <LongAnswerQuestion
          {...baseProps}
          placeholder={question.placeholder}
          characterLimit={question.characterLimit}
        />
      );

    case 3: // Multiple Choice
      return (
        <MultipleChoiceQuestion
          {...baseProps}
          options={question.options || []}
          allowMultipleSelection={question.allowMultipleSelection}
        />
      );

    case 4: // Image Choice
      return (
        <ImageChoiceQuestion
          {...baseProps}
          imageOptions={question.imageOptions || []}
        />
      );

    case 5: // Matching/Sorting
      return (
        <MatchingSortingQuestion
          {...baseProps}
          options={question.options || []}
          matchingItems={question.matchingtems || []}
        />
      );

    case 6: // Star Rating
      return (
        <StarRatingQuestion {...baseProps} maxRating={question.maxRating} />
      );

    case 7: // User Search
      return (
        <UserSearchQuestion {...baseProps} placeholder={question.placeholder} />
      );

    case 8: // Number Rating
      return (
        <NumberRatingQuestion {...baseProps} maxRating={question.maxRating} />
      );

    default:
      return <div>Unsupported question type: {question.questionTypeId}</div>;
  }
};
