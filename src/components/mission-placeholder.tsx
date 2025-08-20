import React from 'react'

interface MissionPlaceholderProps {
  children?: React.ReactNode
}

const MissionPlaceholder = ( { children }: MissionPlaceholderProps ) => {
  return (
    <section className="min-h-screen grid grid-flow-row p-5 mx-auto container ">
    <div className="flex flex-col gap-10 items-start align-top justify-start ">
      {/* <h2 className=" text-erify-dark text-[36px] font-semibold py-5">
        Mission Title Here
      </h2> */}
    </div>
    {children}
    <div className="grid grid-cols-4 gap-10">
      <div className="col-span-3 flex flex-col gap-10 text-2xl font-light">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et
          massa mi. <br />
          Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla,
          mattis ligula <br />
          consectetur, ultrices mauris
        </p>

        <div className='h-96 w-full rounded-[5px] bg-neutral-100 border-2 border-dashed border-neutral-300 flex items-center justify-center'>
          Placeholder
        </div>
      </div>
    </div>
  </section>
  )
}

export default MissionPlaceholder