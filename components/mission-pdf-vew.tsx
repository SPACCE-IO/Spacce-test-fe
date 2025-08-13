'use client'

import React from 'react';

// Define props for reusability
interface ImageVideoModalProps {
  missionTitle: string;
  pdfSrc?: string;
  children?: React.ReactNode;
}

const MissionPDFView: React.FC<ImageVideoModalProps> = ({ missionTitle, children
 }) => {

  return (
    <section className="min-h-screen grid grid-rows-7 p-5 mx-auto container">
      <div className="flex flex-col gap-10 items-start align-top justify-start row-span-1">
        <h2 className="text-erify-dark text-[36px] font-semibold py-5">
          {missionTitle}
        </h2>
      </div>
      {children}
      <div className="gap-10 row-span-6 pb-10">
        <div className="w-full h-full justify-center items-center flex container">
          <div className="p-5 rounded-[10px] h-[580px] w-[1100px] bg-neutral-100 border-2 border-black container flex relative">
            {/* Image that opens the video modal on click */}

          </div>
        </div>
      </div>

    </section>
  );
};

export default MissionPDFView;

