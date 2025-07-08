import type React from "react";

interface TaskPaginationSectionProps {
  title?: string;
  totalSteps?: number;
  currentStep?: number;
  children?: React.ReactNode;
}

const TaskPaginationSection: React.FC<TaskPaginationSectionProps> = ({
  title,
  totalSteps,
  currentStep,
  children
}) => {
  console.log("TaskPaginationSection rendered with title:", title, "totalSteps:", totalSteps, "currentStep:", currentStep);
  return (
    <div className="right-0 z-10 fixed h-screen w-[122px] pt-10 pb-[60px] pr-[32px] bg-center bg-no-repeat bg-fixed bg-opacity-50">
      <p
        className={`text-[12px] ${
          title?.toLocaleLowerCase() == "congratulations" && "text-white"
        } text-colors-primarypurpurple opacity-45 text-end pb-[12px]`}
      >
        {title}
      </p>
      <div className="flex justify-end items-end gap-2 w-full">
        <div className="grid grid-flow-row gap-2 w-[37px]">
          {title !== "" && totalSteps !== undefined && currentStep !== undefined
            ? Array.from({ length: totalSteps }).map((_, index) =>
                title?.toLocaleLowerCase() === "congratulations" ? (
                  <div
                    key={index}
                    className={`h-1 w-full rounded-[1px] ${
                      index === currentStep - 1
                        ? "bg-white"
                        : "bg-white opacity-40"
                    }`}
                  ></div>
                ) : (
                  <div
                    key={index}
                    className={`h-1 w-full rounded-[1px] ${
                      index === currentStep - 1
                        ? "bg-colors-primarypurpurple opacity-45 "
                        : "bg-colors-primarypurpurple opacity-10"
                    }`}
                  ></div>
                )
              )
            : ""}
        </div>
      </div>
          {
            currentStep!== undefined &&
              currentStep > 2 && <div className="absolute z-30 bottom-10 right-10">
              {children}
              </div>
            
          }
    </div>
  );
};

export default TaskPaginationSection;
