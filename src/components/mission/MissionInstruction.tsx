import { Mouse, X } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import router from "next/router";

interface MissionSearchProps {
  title: string;
  missionInstruction: string;
  missionName: string;
  children?: React.ReactNode;
  handleButtonScroll?: () => void;
}

const MissionInstruction = ({
  title,
  handleButtonScroll,
  missionInstruction,
  missionName,
  children,
}: MissionSearchProps) => {
  return (
    <section className="relative min-h-screen justify-center -my-6 mt-[85px] flex flex-col p-5 mx-auto container ">
      <div className="w-full p-10">
        {/* Mission Name */}
        <p className="text-gray-600 text-sm mb-2">{missionName}</p>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Mission Task</h1>

        {/* Description */}
        <p className="text-gray-700 text-base leading-relaxed max-w-xl mb-12">
          {missionInstruction}
        </p>

        <div className="flex absolute bottom-28 w-full mx-auto  justify-center items-center ">
          <Button
            variant={"default"}
            className="w-[250px] h-[50px] rounded-md flex items-center text-white font-bold justify-center gap-2 bg-gradient-to-t from-[#B276FF] to-[#7C2BDA]"
            onClick={handleButtonScroll}
          >
            Start Mission <Mouse />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default MissionInstruction;
