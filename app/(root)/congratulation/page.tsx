'use client'

import EndSectionGradient from '@/app/components/end-section-gradient'
import MissionBadge from '@/app/components/mission-badge'
import { Button } from '@/components/ui/button'
import { Mouse } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

const Congratulations = () => {
    
    const handleClick = () => {
        router.push("/dashboard?tab=current-mission");
    };

    const router = useRouter();
  return (
    <EndSectionGradient>
            <div className=" container mx-auto flex flex-col items-center justify-center gap-10">
              <MissionBadge mission="poster" missionStatus="complete" />
              <div
                className="flex flex-col items-center justify-center gap-10"
              >
                <h2 className=" text-erify-dark text-[24px] font-semibold py-5">
                  Congratulations
                </h2>
                <p className=" text-center text-[24px] font-light">
                  You&apos;ve left a mark and sent a signal. You are one step
                  closer to renewing <br /> your IBMer Multi-pass. Keep up the
                  signaling
                </p>
                <Button 
                onClick={handleClick}
                 variant={"default"}
              className="w-[250px] h-[50px] border border-[#B276FF] flex items-center text-[#6C50E0] justify-center gap-2 bg-[#EDDDFF]"
                 
                >
                  See Progress <Mouse />
                </Button> 
              </div>
            </div>
          </EndSectionGradient>
  )
}

export default Congratulations