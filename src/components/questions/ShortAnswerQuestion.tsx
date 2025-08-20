"use client";
import React from "react";
import { BaseQuestionProps } from "./types";

interface ShortAnswerQuestionProps extends BaseQuestionProps {
  placeholder?: string;
  characterLimit?: number;
}

export const ShortAnswerQuestion: React.FC<ShortAnswerQuestionProps> = ({
  value,
  onChange,
  disabled,
  isAnsweredCorrectly,
  placeholder,
  characterLimit,
}) => {
  return (
    <input
      type="text"
      className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
        isAnsweredCorrectly ? "bg-green-50 border-green-300" : ""
      }`}
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder || "Enter your answer..."}
      maxLength={characterLimit}
      disabled={disabled}
    />
  );
};
