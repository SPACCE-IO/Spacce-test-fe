"use client";
import React from "react";
import { BaseQuestionProps } from "./types";

interface NumberRatingQuestionProps extends BaseQuestionProps {
  maxRating?: number;
}

export const NumberRatingQuestion: React.FC<NumberRatingQuestionProps> = ({
  value,
  onChange,
  disabled,
  isAnsweredCorrectly,
  maxRating = 10,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: maxRating }, (_, index) => {
          const ratingValue = index + 1;
          const isSelected = parseInt(value) === ratingValue;

          return (
            <button
              key={ratingValue}
              onClick={() => !disabled && onChange(ratingValue.toString())}
              className={`w-12 h-12 rounded-lg border font-medium text-sm transition-all duration-200 hover:scale-105 ${
                isSelected
                  ? "border-blue-500 bg-blue-500 text-white shadow-lg"
                  : "border-gray-300 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50"
              } ${disabled ? "opacity-60 cursor-default" : "cursor-pointer"}`}
              disabled={disabled}
            >
              {ratingValue}
            </button>
          );
        })}
      </div>
    </div>
  );
};
