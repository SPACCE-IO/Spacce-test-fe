import type React from "react";

interface TitleTopSectionProps {
  title?: string;
}

const TitleTopSection: React.FC<TitleTopSectionProps> = ({
  title,
}) => {

    console.log(title)
  return (
    <div className="z-10 fixed w-full justify-center flex">
        <div className={`h-full container ${title!=="" && "bg-white"} mx-auto py-8 justify-center items-start flex flex-col`}>
        <h2 className=" text-erify-dark text-[36px] font-semibold pl-4">
        {title}
      </h2>
        </div>
    </div>
  );
};

export default TitleTopSection;
