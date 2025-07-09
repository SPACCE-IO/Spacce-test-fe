"use client"

import { Button } from "@/components/ui/button";
import { Mouse } from "lucide-react";
import React from "react";

interface MissionSearchProps {
  title: string,
  missionInstruction: string,
  missionName: string,
  children?: React.ReactNode
  handleButtonScroll?: ( ) => void
}


const MissionInstruction = ( { title,handleButtonScroll, missionInstruction, missionName, children }: MissionSearchProps ) => {

  return (
    <section className="relative min-h-screen justify-center -my-6 flex flex-col p-5 mx-auto container ">
    {/* <div className="flex flex-col gap-10 items-start align-top justify-start ">
      <p className=" text-black opacity-30" >Mission Name: {missionName}</p>
      <h2 className=" text-black opacity-30 text-[36px] font-semibold py-5">
        {title}
      </h2>
    </div> */}
    {children}

    <div className="grid grid-cols-5 mb-10 gap-10 text-2xl font-light">
      <div className="col-span-4">
      <div className='grid grid-cols-6'>
        <p className='col-span-6'>
            {missionInstruction}
        </p>
        </div>


      </div>
    </div>
        <div className="flex absolute bottom-28 w-full mx-auto  justify-center items-center ">
                  <Button
                    variant={"default"}
                    className="w-[250px] h-[50px] flex items-center justify-center gap-2 bg-[#36CEF8]"
                    onClick={handleButtonScroll}
                  >
                    Start Mission <Mouse />
                  </Button>
                </div>
  </section>
  )
}

export default MissionInstruction