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
  }>;
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
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
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

  const moveItem = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex || disabled) return;

    const newOrder = [...imageOrders];
    const [movedItem] = newOrder.splice(fromIndex, 1);
    newOrder.splice(toIndex, 0, movedItem);

    setImageOrders(newOrder);

    // Format the answer
    const formattedAnswer = newOrder.map((item, index) => {
      const stepNumber = index + 1;
      return `${stepNumber}-${item.id}`;
    });

    onChange(JSON.stringify(formattedAnswer));
  };

  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    if (disabled) {
      e.preventDefault();
      return;
    }

    setDraggedItemId(itemId);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", itemId);

    // Add some visual feedback
    const dragImage = e.currentTarget as HTMLElement;
    if (dragImage) {
      e.dataTransfer.setDragImage(
        dragImage,
        dragImage.offsetWidth / 2,
        dragImage.offsetHeight / 2
      );
    }
  };

  const handleDragEnd = () => {
    setDraggedItemId(null);
    setDragOverIndex(null);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";

    if (draggedItemId && !disabled) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // Only clear drag over if we're leaving the container entirely
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;

    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setDragOverIndex(null);
    }
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();

    if (!draggedItemId || disabled) return;

    const dragIndex = imageOrders.findIndex(
      (item) => item.id === draggedItemId
    );

    if (dragIndex !== -1 && dragIndex !== dropIndex) {
      moveItem(dragIndex, dropIndex);
    }

    setDraggedItemId(null);
    setDragOverIndex(null);
  };

  const handleItemClick = (itemId: string, currentIndex: number) => {
    if (disabled) return;

    // Simple click-to-move-up functionality as fallback
    if (currentIndex > 0) {
      moveItem(currentIndex, currentIndex - 1);
    }
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

          <div className="space-y-4">
            {imageOrders.map((item, index) => (
              <div
                key={`${item.id}-${index}`}
                className="relative"
                onDragOver={(e) => handleDragOver(e, index)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, index)}
              >
                {/* Visual drop indicator */}
                {dragOverIndex === index && draggedItemId !== item.id && (
                  <div className="absolute -top-1 left-0 right-0 h-0.5 bg-blue-500 rounded z-10" />
                )}

                {/* Draggable item */}
                <div
                  draggable={!disabled}
                  onDragStart={(e) => handleDragStart(e, item.id)}
                  onDragEnd={handleDragEnd}
                  onClick={() => handleItemClick(item.id, index)}
                  className={`
                    bg-white border min-h-[100px] rounded-lg p-3 flex items-center transition-all duration-150
                    ${
                      !disabled
                        ? "cursor-move hover:shadow-md"
                        : "cursor-default"
                    }
                    ${
                      draggedItemId === item.id
                        ? "opacity-50 scale-105 shadow-lg border-blue-400 z-20"
                        : "border-gray-200 hover:border-gray-300"
                    }
                    ${
                      dragOverIndex === index && draggedItemId !== item.id
                        ? "border-blue-300 bg-blue-50"
                        : ""
                    }
                  `}
                >
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium mr-3 flex-shrink-0">
                    {index + 1}
                  </div>

                  <div className="w-16 h-16 mr-3 flex-shrink-0">
                    <img
                      src={"https://picsum.photos/200/300"}
                      // src={item.imageUrl}
                      alt={item.altText}
                      className="w-full h-full object-cover rounded"
                      draggable={false}
                      onDragStart={(e) => e.preventDefault()}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {item.caption}
                    </p>
                  </div>

                  {!disabled && (
                    <div className="text-gray-400 ml-2 flex flex-col text-xs leading-none">
                      <span>⋮</span>
                      <span>⋮</span>
                    </div>
                  )}
                </div>

                {/* Drop zone at the end for last position */}
                {index === imageOrders.length - 1 &&
                  draggedItemId &&
                  draggedItemId !== item.id && (
                    <div
                      className="mt-2 h-8 border-2 border-dashed border-blue-300 rounded bg-blue-50 flex items-center justify-center text-xs text-blue-600"
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.dataTransfer.dropEffect = "move";
                        setDragOverIndex(imageOrders.length);
                      }}
                      onDrop={(e) => handleDrop(e, imageOrders.length)}
                    >
                      Drop here to place last
                    </div>
                  )}
              </div>
            ))}
          </div>

          {!disabled && (
            <div className="text-xs text-gray-500 mt-4">
              💡 Tip: Drag items to reorder them, or click to move up one
              position
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
