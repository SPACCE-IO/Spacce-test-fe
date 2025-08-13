import React from "react";

interface VideoPerspectiveViewProps {
  videoSrc: string;
}

const VideoPerspectiveView = ({ videoSrc }: VideoPerspectiveViewProps) => {
  return (
    <div className=" perspective-400 w-[60%] flex justify-center items-start relative top-[90px]">
      <div className="flex  w-[80%] justify-center items-end  ounded-[15px] transform rotate-x-30 relative -top-36 ">
        <div className="aspect-video rounded-[5px]">
          <video controls className=" rounded-[15px]">
            <source src={videoSrc} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </div>
  );
};

export default VideoPerspectiveView;
