"use client";
import React, { useState, useMemo, useRef, useEffect } from "react";
import { Search, ChevronDown, Check } from "lucide-react";
import { BaseQuestionProps } from "./types";
import { useGetUsersQuery } from "@/src/services/employeeManagement";
import { useSession } from "next-auth/react";

interface User {
  userId: number;
  userName: string;
  userType: string;
  status: string;
  firstName: string;
  lastName: string;
  orgCode: string;
  email: string;
  manager: string;
  tags: any[];
  createdBy: string;
  groups: any[];
}

interface UserSearchQuestionProps extends BaseQuestionProps {
  placeholder?: string;
}

export const UserSearchQuestion: React.FC<UserSearchQuestionProps> = ({
  questionId,
  value,
  onChange,
  disabled,
  isAnsweredCorrectly,
  placeholder = "Search for employees...",
}) => {
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const {
    data: users = [],
    isLoading,
    isError,
  } = useGetUsersQuery(session?.accessToken);

  // Filter users based on search query
  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return users;

    const query = searchQuery.toLowerCase();
    return users.filter(
      (user: User) =>
        user.firstName.toLowerCase().includes(query) ||
        user.lastName.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(query)
    );
  }, [users, searchQuery]);

  // Find selected user details for display
  const selectedUser = useMemo(() => {
    return users.find((user: User) => user.email === value);
  }, [users, value]);

  const handleUserSelect = (user: User) => {
    onChange(user.email); // Submit the email as required
    setIsOpen(false);
    setSearchQuery("");
  };

  const handleInputClick = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!disabled) {
      setSearchQuery(e.target.value);
      setIsOpen(true);
    }
  };

  // Handle mousedown on dropdown items to prevent blur
  const handleItemMouseDown = (e: React.MouseEvent, user: User) => {
    e.preventDefault(); // Prevent blur event from firing
    handleUserSelect(user);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  if (isLoading) {
    return (
      <div className="space-y-2">
        <div className="w-full p-3 border rounded-md bg-gray-50 text-gray-500">
          Loading employees...
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-2">
        <div className="w-full p-3 border border-red-300 rounded-md bg-red-50 text-red-600">
          Error loading employees. Please try again.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2 relative" ref={dropdownRef}>
      <div className="relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400 z-10" />
        <input
          type="text"
          placeholder={
            selectedUser
              ? `${selectedUser.firstName} ${selectedUser.lastName}`
              : placeholder
          }
          value={searchQuery}
          onChange={handleSearchChange}
          onClick={handleInputClick}
          className={`w-full pl-10 pr-10 p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer ${
            disabled ? "bg-gray-100 cursor-not-allowed" : ""
          } ${isAnsweredCorrectly === false ? "border-red-500" : ""}`}
          disabled={disabled}
          readOnly={!isOpen}
        />
        <ChevronDown
          className={`absolute right-3 top-3 w-4 h-4 text-gray-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      {/* Dropdown Menu */}
      {isOpen && !disabled && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {filteredUsers.length === 0 ? (
            <div className="p-3 text-gray-500 text-sm">
              {searchQuery ? "No employees found" : "No employees available"}
            </div>
          ) : (
            filteredUsers.map((user: User) => (
              <div
                key={user.userId}
                onMouseDown={(e) => handleItemMouseDown(e, user)}
                className={`p-3 cursor-pointer hover:bg-gray-50 flex items-center justify-between ${
                  user.email === value ? "bg-blue-50 text-blue-700" : ""
                }`}
              >
                <div>
                  <div className="font-medium">
                    {user.firstName} {user.lastName}
                  </div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                  {user.manager && (
                    <div className="text-xs text-gray-400">
                      Manager: {user.manager}
                    </div>
                  )}
                </div>
                {user.email === value && (
                  <Check className="w-4 h-4 text-blue-600" />
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Selected Display */}
      <div className="text-sm text-gray-500">
        Selected:{" "}
        {selectedUser ? (
          <span className="font-medium">
            {selectedUser.firstName} {selectedUser.lastName} (
            {selectedUser.email})
          </span>
        ) : (
          "None"
        )}
      </div>
    </div>
  );
};
