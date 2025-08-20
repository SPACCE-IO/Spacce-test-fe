"use client";
import React from "react";
import { Star } from "lucide-react";
import { BaseQuestionProps } from "./types";

interface StarRatingQuestionProps extends BaseQuestionProps {
  maxRating?: number;
}

export const StarRatingQuestion: React.FC<StarRatingQuestionProps> = ({
  value,
  onChange,
  disabled,
  isAnsweredCorrectly,
  maxRating = 5,
}) => {
  const handleStarRating = (rating: number) => {
    onChange(rating.toString());
  };

  return (
    <div
      className={`flex items-center space-x-1 ${
        isAnsweredCorrectly ? "opacity-60" : ""
      }`}
    >
      {[...Array(maxRating)].map((_, i) => (
        <button
          key={i}
          onClick={() => !disabled && handleStarRating(i + 1)}
          className={`p-1 transition-colors ${
            i < parseInt(value || "0") ? "text-yellow-400" : "text-gray-300"
          } ${disabled ? "cursor-default" : "cursor-pointer"}`}
          disabled={disabled}
        >
          <Star className="w-9 h-9 fill-current" />
        </button>
      ))}
    </div>
  );
};
