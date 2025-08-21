"use client";

import EndSectionGradient from "@/src/components/end-section-gradient";
import { Button } from "@/src/components/ui/button";
import useMission from "@/src/hooks/useMission";
import { RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Standard from "@/public/assets/badges/standard.svg";

import React from "react";

const MissionFail = () => {
    const mission = useMission();
  
  const handleClick = () => {
    router.push("/dashboard?tab=current-mission");
  };

  const router = useRouter();
  return (
    <EndSectionGradient>
      <div className=" container mx-auto flex flex-col items-center justify-center gap-10">
        <MissionBadge mission={mission?.name} />
        <div className="flex flex-col items-center justify-center gap-10">
          <h2 className=" text-white text-[24px] font-semibold py-5">
            Mission Failed
          </h2>
          <p className=" text-center text-[24px] font-light text-gray-600">
            Don&apos;t worry, every IBMer faces setbacks. This is just a
            temporary detour <br />
            on your journey to renewing your Multi-pass. Learn from this
            experience
          </p>
          <Button
            onClick={handleClick}
            variant={"default"}
            className="w-[250px] h-[50px]  rounded-md flex items-center text-white font-bold justify-center gap-2 bg-gradient-to-t from-[#B276FF] to-[#7C2BDA]"
          >
            Try Again <RotateCcw />
          </Button>
        </div>
      </div>
    </EndSectionGradient>
  );
};

export default MissionFail;


const MissionBadge = ({ width = 330, height = 330, mission }: any) => {
  return (
    <div className="container mx-auto rounded-[5px] flex justify-center items-center">
      <Image
        src={Standard}
        width={width}
        height={height}
        alt={`${mission} Mission Badge`}
      />
    </div>
  );
};
