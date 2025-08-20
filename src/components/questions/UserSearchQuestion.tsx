"use client";
import React, { useState } from "react";
import { Search } from "lucide-react";
import { BaseQuestionProps } from "./types";

interface UserSearchQuestionProps extends BaseQuestionProps {
  placeholder?: string;
}

export const UserSearchQuestion: React.FC<UserSearchQuestionProps> = ({
  questionId,
  value,
  onChange,
  disabled,
  isAnsweredCorrectly,
  placeholder = "Search for users...",
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="space-y-2">
      <div className="relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => !disabled && setSearchQuery(e.target.value)}
          className={`w-full pl-10 p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            isAnsweredCorrectly ? "bg-green-50 border-green-300" : ""
          }`}
          disabled={disabled}
        />
      </div>
      <div className="text-sm text-gray-500">Selected: {value || "None"}</div>
    </div>
  );
};
