"use client";
import React from "react";
import { BaseQuestionProps, ImageOption } from "./types";

interface ImageChoiceQuestionProps extends BaseQuestionProps {
  imageOptions: ImageOption[];
}

export const ImageChoiceQuestion: React.FC<ImageChoiceQuestionProps> = ({
  questionId,
  value,
  onChange,
  disabled,
  isAnsweredCorrectly,
  imageOptions,
}) => {
  return (
    <div className="grid grid-cols-4 gap-4">
      {imageOptions?.map((option) => (
        <label
          key={option.id}
          className={`cursor-pointer ${
            isAnsweredCorrectly ? "opacity-60" : ""
          }`}
        >
          <div
            className={`border rounded-lg p-2 transition-colors ${
              value === option.id ? "border-blue-500 bg-blue-50" : ""
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
                checked={value === option.id}
                onChange={(e) => !disabled && onChange(option.id)}
                className="w-4 h-4"
                disabled={disabled}
              />
              <span className="text-sm">{option.caption}</span>
            </div>
          </div>
        </label>
      ))}
    </div>
  );
};
