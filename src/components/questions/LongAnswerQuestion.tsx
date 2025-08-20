"use client";
import React from "react";
import { BaseQuestionProps } from "./types";

interface LongAnswerQuestionProps extends BaseQuestionProps {
  placeholder?: string;
  characterLimit?: number;
}

export const LongAnswerQuestion: React.FC<LongAnswerQuestionProps> = ({
  value,
  onChange,
  disabled,
  isAnsweredCorrectly,
  placeholder,
  characterLimit,
}) => {
  return (
    <div>
      <textarea
        className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
          isAnsweredCorrectly ? "bg-green-50 border-green-300" : ""
        }`}
        rows={4}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || "Enter your detailed answer..."}
        maxLength={characterLimit}
        disabled={disabled}
      />
      {characterLimit && (
        <div className="text-sm text-gray-500 mt-1">
          {(value || "").length}/{characterLimit} characters
        </div>
      )}
    </div>
  );
};
