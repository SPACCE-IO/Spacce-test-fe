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
    <div>
      <input
        type="text"
        className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || "Enter your answer..."}
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
