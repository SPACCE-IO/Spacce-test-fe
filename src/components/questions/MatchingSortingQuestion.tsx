"use client";
import React, { useState, useEffect } from "react";
import { BaseQuestionProps, Option, MatchingItem } from "./types";

interface MatchingSortingQuestionProps extends BaseQuestionProps {
  options: Option[];
  matchingItems: Array<{
    id: string;
    altText: string;
    caption: string;
    imageUrl: string;
  }>; // Match the original structure exactly
}

export const MatchingSortingQuestion: React.FC<
  MatchingSortingQuestionProps
> = ({
  questionId,
  value,
  onChange,
  disabled,
  isAnsweredCorrectly,
  options,
  matchingItems,
}) => {
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [imageOrders, setImageOrders] = useState<any[]>([]);

  useEffect(() => {
    // Initialize image order from saved answer or default order
    let orderedImages = [];

    if (value && value.trim() !== "") {
      try {
        const parsedAnswer = JSON.parse(value);
        if (Array.isArray(parsedAnswer)) {
          const orderedIds = parsedAnswer.map((pair) => pair.split("-")[1]);
          orderedImages = orderedIds
            .map((id) => matchingItems?.find((item) => item.id === id))
            .filter(Boolean);

          if (orderedImages.length !== matchingItems.length) {
            orderedImages = [...matchingItems];
          }
        } else {
          orderedImages = [...matchingItems];
        }
      } catch (e) {
        orderedImages = [...matchingItems];
      }
    } else {
      orderedImages = [...matchingItems];
    }

    setImageOrders(orderedImages);
  }, [value, matchingItems]);

  const handleDropAtPosition = (targetPosition: number) => {
    if (!draggedItem || disabled) return;

    let currentOrder = imageOrders.map((item) => item.id);

    const currentPosition = currentOrder.indexOf(draggedItem);
    if (currentPosition === -1) return;

    let adjustedTargetPosition = targetPosition;
    if (currentPosition < targetPosition) {
      adjustedTargetPosition = targetPosition - 1;
    }

    if (currentPosition === adjustedTargetPosition) {
      setDraggedItem(null);
      return;
    }

    const newOrder = [...currentOrder];
    const [removedItem] = newOrder.splice(currentPosition, 1);
    newOrder.splice(adjustedTargetPosition, 0, removedItem);

    const newImageOrder = newOrder
      .map((id) => matchingItems?.find((item) => item.id === id))
      .filter(Boolean);

    setImageOrders(newImageOrder);

    const formattedAnswer = newOrder.map((imageId, index) => {
      const stepNumber = index + 1;
      return `${stepNumber}-${imageId}`;
    });

    onChange(JSON.stringify(formattedAnswer));
    setDraggedItem(null);
  };

  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    if (disabled) return;
    setDraggedItem(itemId);
    e.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-8">
        {/* Static Text Options - Left Column */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-700 mb-4">Steps in Order:</h4>
          {options?.map((option, index) => (
            <div
              key={option.id}
              className="p-4 bg-white border-2 border-gray-200 rounded-lg min-h-[100px] flex items-center"
            >
              <div className="flex items-center w-full">
                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-4 flex-shrink-0">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-gray-800">
                    {option.text}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Draggable Images - Right Column (Sortable) */}
        <div
          className={`space-y-3 ${
            disabled ? "opacity-60 pointer-events-none" : ""
          }`}
        >
          <h4 className="font-medium text-gray-700 mb-4">
            Drag to sort in correct order:
          </h4>

          <div className="space-y-2">
            {imageOrders.map((item, index) => (
              <div key={`${item.id}-${index}`}>
                {/* Drop zone before item */}
                {draggedItem && draggedItem !== item.id && (
                  <div
                    className="h-8 bg-blue-50 border border-dashed border-blue-300 rounded text-center text-xs text-blue-600 leading-8 mb-1"
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.dataTransfer.dropEffect = "move";
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      handleDropAtPosition(index);
                    }}
                  >
                    Drop here
                  </div>
                )}

                {/* Draggable item */}
                <div
                  draggable={!disabled}
                  onDragStart={(e) => {
                    if (!disabled) {
                      e.dataTransfer.effectAllowed = "move";
                      setDraggedItem(item.id);
                    }
                  }}
                  onDragEnd={() => setDraggedItem(null)}
                  className={`bg-white border rounded-lg p-3 flex items-center ${
                    !disabled ? "cursor-move" : "cursor-default"
                  } ${
                    draggedItem === item.id
                      ? "opacity-50 border-blue-400"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                    {index + 1}
                  </div>

                  <div className="w-16 h-16 mr-3">
                    <img
                      src={item.imageUrl}
                      alt={item.altText}
                      className="w-full h-full object-cover rounded"
                      draggable={false}
                    />
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">
                      {item.caption}
                    </p>
                  </div>

                  {!disabled && <div className="text-gray-400 ml-2">⋮⋮</div>}
                </div>
              </div>
            ))}

            {/* Final drop zone */}
            {draggedItem && (
              <div
                className="h-8 bg-blue-50 border border-dashed border-blue-300 rounded text-center text-xs text-blue-600 leading-8 mt-1"
                onDragOver={(e) => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = "move";
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  handleDropAtPosition(imageOrders.length);
                }}
              >
                Drop here
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
