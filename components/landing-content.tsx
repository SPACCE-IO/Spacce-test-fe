import React from 'react'
import GradientText from './text-purple-gradient'
import localFont from "next/font/local";

// const myFont = localFont({ src: "../fonts/Satoshi-Medium.woff" });
const myFontRegular = localFont({ src: "../fonts/Satoshi-Regular.woff" });

interface LandingContentProps {
  title: string
  description: string
  heading?: boolean
}

const LandingContent = ( { title, description, heading = false }: LandingContentProps ) => {
  return (
    // <section className={`bg-white ${myFont.className}`}>
    <section className=' container mx-auto'>
            <div
              className="min-h-screen  flex items-center p-8 "
            >
              <div className=" w-1/3">
                <GradientText
                  className={` font-bold mb-4 ${
                    heading === true
                      ? "text-[56px] leading-[72.8px]"
                      : "text-[34px] leading-[44.2px]"
                  }`}
                >
                  {title}
                </GradientText>
                <p
                  className={`text-gray-600 text-[24px] leading-[36px] font-medium ${myFontRegular.className}`}
                >
                  {description}
                </p>
              </div>
            </div>
    </section>
  )
}

export default LandingContent