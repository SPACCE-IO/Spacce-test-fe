import { ImageIcon } from 'lucide-react'
import React from 'react'

const TextImageHeading = () => {
  return (
    <div className=''>
    <div className='grid grid-cols-2 gap-6 w-[749px] h-[101px] '>
      <div className='grid grid-flow-col gap-4 '>
        <div className=' col-span-1  h-24 w-24 rounded-[5px] border border-dashed border-black'>
        </div>
        <div className='flex flex-col '>
          <h3 className=' font-bold text-[16px]'>
              Heading
          </h3>
          <p className='  w-[303px] text-[16px]'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam in hendrerit urna.
          </p>
        </div>
      </div>
      <div className=' flex justify-end'>
        <div className='h-24 w-24 rounded-[5px] bg-neutral-100 flex justify-center items-center'>
          <ImageIcon/>
        </div>
      </div>
    </div>
  </div>
  )
}

export default TextImageHeading