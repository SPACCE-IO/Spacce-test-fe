"use client";

import EndSectionGradient from "@/src/components/end-section-gradient";
import { Button } from "@/src/components/ui/button";
import { Home, ArrowLeft, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import React from "react";

const NotFound = () => {
  const router = useRouter();

  const handleGoHome = () => {
    router.push("/dashboard");
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <EndSectionGradient>
      <div className="container mx-auto flex flex-col items-center justify-center gap-10 min-h-screen py-20">
        <div className="flex flex-col items-center justify-center gap-10">
          <h2 className="text-erify-dark text-[48px] font-bold py-5">404</h2>
          <h3 className="text-erify-dark text-[24px] font-semibold">
            Page Not Found
          </h3>
          <p className="text-center text-[18px] font-light max-w-2xl">
            Oops! The page you&apos;re looking for seems to have gone on its own
            mission.
            <br />
            Don&apos;t worry, let&apos;s get you back on track.
          </p>

          <div className="flex gap-4 mt-6">
            {/* <Button
              onClick={handleGoBack}
              variant="outline"
              className="w-[180px] h-[50px] rounded-md flex items-center justify-center gap-2 border-2 border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </Button> */}

            <Button
              onClick={handleGoHome}
              variant="default"
              className="w-[180px] h-[50px] rounded-md flex items-center text-white font-bold justify-center gap-2 bg-gradient-to-t from-[#B276FF] to-[#7C2BDA] hover:from-[#A066EF] to-[#6C1BCA]"
            >
              <Home className="w-4 h-4" />
              Dashboard
            </Button>
          </div>
        </div>
      </div>
    </EndSectionGradient>
  );
};

export default NotFound;
