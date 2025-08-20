import React from 'react'
import TextImageHeading from './text-image-heading'

interface MissionImageTextProps {
  title: string,
  missionDescription: string,
  children?: React.ReactNode
}

const MissionImageText = ( { title, missionDescription,  children }: MissionImageTextProps ) => {
  return (
    <section className="min-h-screen grid grid-flow-row p-5 mx-auto container ">
    <div className="flex flex-col gap-10 items-start align-top justify-start ">
      <h2 className=" text-erify-dark text-[36px] font-semibold py-5">
        {title}
      </h2>
    </div>
    {children}
    <div className="grid grid-cols-4 gap-10">
      <div className="col-span-3 flex flex-col gap-10 text-2xl font-light text-[24px] w-[800px]">
        <p>
          {missionDescription}
        </p>

<div className=' grid grid-flow-row gap-8'>
  <TextImageHeading/>
  <TextImageHeading/>
  <TextImageHeading/>
</div>
      </div>
    </div>
  </section>
  )
}

export default MissionImageText