import type React from "react";

interface TitleTopSectionProps {
  title?: string;
  subTitle?: string;
}

const TitleTopSectionV2: React.FC<TitleTopSectionProps> = ({
  title,
  subTitle,
}) => {

    console.log("title: ",title)
    console.log("subTitle: ",subTitle)
  return (
    <div className="z-10 fixed w-full justify-center flex">
        <div className={`h-full container ${title!=="" && "bg-white"} ${title?.toLocaleLowerCase()=="mission instruction" ? "pt-32" : "pt-16" } mx-auto py-8  justify-center items-start flex flex-col pl-4`}>
        <p className={`${subTitle!=="" ? "text-black opacity-30 font-semibold" : "hidden"}`} >Mission Name: {subTitle}</p>
        <h2 className=" text-black opacity-30 text-[36px] font-semibold">
        {title}
      </h2>
      
        </div>
    </div>
  );
};

export default TitleTopSectionV2;
