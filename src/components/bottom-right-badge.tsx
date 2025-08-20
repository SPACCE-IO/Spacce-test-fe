import type React from "react"

interface BottomRightBadgeProps {
  children: React.ReactNode
}

const BottomRightBadgeLocation: React.FC<BottomRightBadgeProps> = ({ children }) => {
  return (
    <div className="right-20 z-10 absolute h-screen w-[122px] pt-20 pb-[0px] pr-[32px] bg-no-repeat bg-fixed bg-opacity-50 ">
      <div className="flex flex-col h-full ">{children}</div>
    </div>
  )
}

export default BottomRightBadgeLocation

