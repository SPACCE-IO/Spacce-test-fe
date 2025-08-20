"use client";
import React from "react";
import { BaseQuestionProps, Option } from "./types";

interface MultipleChoiceQuestionProps extends BaseQuestionProps {
  options: Option[];
  allowMultipleSelection?: boolean;
}

export const MultipleChoiceQuestion: React.FC<MultipleChoiceQuestionProps> = ({
  questionId,
  value,
  onChange,
  disabled,
  isAnsweredCorrectly,
  options,
  allowMultipleSelection,
}) => {
  const handleMultipleChoiceChange = (optionId: string, isChecked: boolean) => {
    const currentAnswers = value ? value.split(",") : [];
    let newAnswers;

    if (isChecked) {
      newAnswers = [...currentAnswers, optionId];
    } else {
      newAnswers = currentAnswers.filter((id) => id !== optionId);
    }

    onChange(newAnswers.join(","));
  };

  return (
    <div className="space-y-6">
      {options?.map((option) => (
        <label
          key={option.id}
          className={`flex items-center text-base space-x-2 cursor-pointer ${
            isAnsweredCorrectly ? "opacity-60" : ""
          }`}
        >
          <input
            type={allowMultipleSelection ? "checkbox" : "radio"}
            name={`question-${questionId}`}
            value={option.id}
            checked={
              allowMultipleSelection
                ? (value || "").split(",").includes(option.id)
                : value === option.id
            }
            onChange={(e) => {
              if (!disabled) {
                if (allowMultipleSelection) {
                  handleMultipleChoiceChange(option.id, e.target.checked);
                } else {
                  onChange(option.id);
                }
              }
            }}
            className="w-4 h-4"
            disabled={disabled}
          />
          <span>{option.text}</span>
        </label>
      ))}
    </div>
  );
};
