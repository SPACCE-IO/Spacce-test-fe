import { PosterCards } from '@/components/poster-cards'
import React from 'react'

const PosterIntro = () => {
  return (
   <div className="relative w-full max-w-3xl h-[400px] mx-auto bottom-6">
                 {/* Left card */}
                 <div className="absolute left-14 scale-125 bg-yellow-200 top-[70%] rounded-t-[15px] -translate-y-1/2 -rotate-[20deg] transform-gpu hover:z-20 hover:scale-[140%] transition-transform duration-300">
                   {/* <PosterCards imageUrl={cards[0].imageUrl} title={cards[0].title} index={0} /> */}
                   <PosterCards />
                 </div>
   
                 {/* Center card */}
                 <div className="absolute left-1/2 top-1/2 bg-green-200 scale-150 scale-x-[200%] rounded-t-[15px] -translate-x-1/2 -translate-y-1/2 z-10 transform-gpu hover:scale-[210%] transition-transform duration-300">
                   {/* <PosterCards imageUrl={cards[1].imageUrl} title={cards[1].title} index={1} /> */}
                   <PosterCards />
                 </div>
   
                 {/* Right card */}
                 <div className="absolute right-14 scale-125 top-[70%] rounded-t-[15px] bg-red-200 -translate-y-1/2 rotate-[20deg] transform-gpu hover:z-20 hover:scale-[140%] transition-transform duration-300">
                   {/* <PosterCards imageUrl={cards[2].imageUrl} title={cards[2].title} index={2} /> */}
                   <PosterCards />
                 </div>
   
                 <div className=" w-full h-[140px] bg-white absolute -bottom-[114px] left-0 right-0 z-40 "></div>
               </div>
  )
}

export default PosterIntro