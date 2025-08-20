import React from 'react'

interface MissionVideoBigProps {
  missionTitle: string
  videoSrc: string
  missionDescription: string
  children?: React.ReactNode
}

const MissionVideoBig = ( { missionTitle, missionDescription, videoSrc, children }: MissionVideoBigProps ) => {
  return (
    <section className="min-h-screen grid grid-flow-row p-5 mx-auto container ">
    <div className="flex flex-col gap-10 items-start align-top justify-start ">
      <h2 className=" text-erify-dark text-[36px] font-semibold py-5">
        {missionTitle}
      </h2>
    </div> 
    {children}

    <div className="grid grid-cols-4 gap-10">
      <div className="col-span-3 flex flex-col gap-10 text-2xl font-light ">
        <div className='grid grid-cols-6'>
        <p className='col-span-4'>
            {missionDescription}
        </p>
        </div>

        <div className='h-[468px] w-[860px] rounded-[15px] bg-purple-300 flex items-center justify-center'>
        <video controls className=" rounded-[15px]">
            <source height={468} width={860} src={videoSrc} type="video/mp4" />
            Your browser does no t support the video tag.
          </video>
        </div>
      </div>
    </div>
  </section>
  )
}

export default MissionVideoBig