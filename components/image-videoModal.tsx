'use client'

import React, { useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent } from "@/components/ui/dialog";

// Define props for reusability
interface ImageVideoModalProps {
  missionTitle: string;
  imageSrc: string;
  videoSrc: string;
  children?: React.ReactNode; 
}

const ImageVideoModal: React.FC<ImageVideoModalProps> = ({ missionTitle, imageSrc, videoSrc, children }) => {
  // State to control the modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="min-h-screen grid grid-rows-7 p-5 mx-auto container">
      <div className="flex flex-col gap-10 items-start align-top justify-start row-span-1">
        <h2 className="text-erify-dark text-[36px] font-semibold py-5">
          {missionTitle}
        </h2>
      </div>
 {children}
      <div className="gap-10 row-span-6 pb-10">
        <div className="w-full h-full  justify-center items-center flex container">
          <div className="p-5 rounded-[10px] aspect-video h-[600px]  bg-neutral-100 border-2 border-black container flex relative">
            {/* Image that opens the video modal on click */}
            <Image
              src={imageSrc}
              alt="Mission Image"
              layout="fill"
              objectFit="cover"
              className="rounded-[8px] cursor-pointer"
              onClick={() => setIsModalOpen(true)}
            />
          </div>
        </div>
      </div>

      {/* Video Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[70vw] sm:max-h-[70vh] border-none">
          <video controls className="w-full h-full">
            <source src={videoSrc} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default ImageVideoModal;

