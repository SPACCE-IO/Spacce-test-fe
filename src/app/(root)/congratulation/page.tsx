"use client";

import EndSectionGradient from "@/src/components/end-section-gradient";
import { Button } from "@/src/components/ui/button";
import useMission from "@/src/hooks/useMission";
import { Mouse } from "lucide-react";
import Standard from "@/public/assets/badges/standard.svg";

import { useRouter } from "next/navigation";
import Image from "next/image";
import React from "react";

const Congratulations = () => {
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
          <h2 className=" text-erify-dark text-[24px] font-semibold py-5">
            Congratulations
          </h2>
          <p className=" text-center text-[24px] font-light">
            You&apos;ve left a mark and sent a signal. You are one step closer
            to renewing <br /> your IBMer Multi-pass. Keep up the signaling
          </p>
          <Button
            onClick={handleClick}
            variant={"default"}
            className="w-[250px] h-[50px]  rounded-md flex items-center text-white font-bold justify-center gap-2 bg-gradient-to-t from-[#B276FF] to-[#7C2BDA]"
          >
            See Progress <Mouse />
          </Button>
        </div>
      </div>
    </EndSectionGradient>
  );
};

export default Congratulations;

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
