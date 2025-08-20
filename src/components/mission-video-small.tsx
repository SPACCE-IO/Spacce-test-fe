import type React from "react"

interface MissionVideoSmallProps {
  title: string
  description: string
  children?: React.ReactNode
  videoSrc: string
}

const MissionVideoSmall: React.FC<MissionVideoSmallProps> = ({ title, description, children, videoSrc }) => {
  return (
    <section className="min-h-screen grid grid-rows-2 p-5 mx-auto container">
      {children}
      <div className="flex flex-col gap-10 items-start align-top justify-start">
        <h2 className="text-erify-dark text-[36px] font-semibold py-5">{title}</h2>
      </div>

      <div className="grid grid-cols-4 gap-10">
        <div className="col-span-3 flex flex-col gap-10 text-2xl font-light">
          <p>{description}</p>

          <div
            className="h-[104px] w-[176px] aspect-video rounded-[5px]  flex items-center justify-center cursor-pointer"
          >
             <video controls height={104} width={176} className="w-full h-full rounded-[15px]">
            <source src={videoSrc} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          </div>
        </div>
      </div>
    </section>
  )
}

export default MissionVideoSmall

