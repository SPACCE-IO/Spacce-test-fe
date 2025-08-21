import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import { Button } from "../ui/button";

interface TaskPaginationSectionProps {
  title?: string;
  totalSteps?: number;
  currentStep?: number;
  onScrollUp: () => void;
  onScrollDown: () => void;
}

const TaskPaginationSection = ({
  title,
  totalSteps,
  currentStep,
  onScrollUp,
  onScrollDown,
}:TaskPaginationSectionProps) => {
  return (
    <div className="right-0 z-10 fixed h-[90vh] w-[122px] pt-10 pb-[60px] pr-[32px] bg-center bg-no-repeat bg-fixed bg-opacity-50">
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
      {currentStep !== undefined && currentStep > 1 && (
        <div className="absolute z-30 bottom-10 right-10">
          <div className=" grid-cols-2 relative z-50  grid w-max flex-col justify-end items-end bg-colors-buttonNav bg-opacity-20 rounded-[4px]">
            <Button
              onClick={onScrollUp}
              className=" w-[40px] h-[40px] rounded-l-[4px] rounded-r-none bg-transparent border border-colors-buttonNav border-opacity-30 hover:bg-colors-buttonNav hover:bg-opacity-30"
            >
              <FaCaretUp
                height={24}
                width={24}
                color="#5C28DF"
                className=" w-[40px] h-[40px] rounded-[4px] bg-transparent"
              />
            </Button>
            <Button
              onClick={onScrollDown}
              className=" w-[40px] h-[40px] rounded-r-[4px] rounded-l-none bg-transparent border border-colors-buttonNav border-opacity-30 hover:bg-colors-buttonNav hover:bg-opacity-30"
            >
              <FaCaretDown
                height={24}
                width={24}
                color="#5C28DF"
                className=" w-[40px] h-[40px] rounded-[4px] bg-transparent"
              />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskPaginationSection;
