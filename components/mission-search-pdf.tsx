import React from "react";
import PDFIcon from "@/public/assets/PDFIcon.svg"
import Image from "next/image";

interface MissionSearchProps {
  title: string;
  missionDescription: string;
  children?: React.ReactNode;
}

const MissionSearchPdf = ({
  title,
  missionDescription,
  children
}: MissionSearchProps) => {
  return (
    <section className="min-h-screen grid grid-rows-2 p-5 mx-auto container ">
      <div className="flex flex-col gap-10 items-start align-top justify-start ">
        <h2 className=" text-erify-dark text-[36px] font-semibold py-5">
          {title}
        </h2>
      </div>
    {children}
      <div className="grid grid-cols-4 gap-[32px] text-2xl font-light">
        <div className="col-span-3">
          <div className="grid grid-cols-6">
            <p className="col-span-4">{missionDescription}</p>
          </div>

          <div className="pt-7 flex gap-6 items-center">
            <Image src={PDFIcon} alt="PDF Icon" />
            <p className="text-[28px]">File Title Here</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionSearchPdf;
