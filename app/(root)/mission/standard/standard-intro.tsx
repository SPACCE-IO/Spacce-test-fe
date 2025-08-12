import React from 'react'
import Image from "next/image";
import profile5 from "@/public/assets/profilepics/profile5.svg";


const StandardIntro = () => {
  return (
     <div className="flex items-center rounded-lg  h-fit w-fitjustify-center">
                  {/* <Image src={profile5} alt={'cover'}  className="w-[472px] h-[402px]  rounded-[15px]" /> */}
              <div className="w-[472px] h-[372px]  rounded-lg bg-green-200"></div>
            </div>
  )
}

export default StandardIntro