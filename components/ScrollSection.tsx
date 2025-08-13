import type React from "react"
import { Button } from "@/components/ui/button"
import { FaCaretUp, FaCaretDown } from "react-icons/fa";

interface ScrollSectionProps {
  onScrollUp: () => void
  onScrollDown: () => void
}

const ScrollSection: React.FC<ScrollSectionProps> = ({ onScrollUp, onScrollDown }) => {
  return (
    <div className=" grid-cols-2 relative z-50  grid w-max flex-col justify-end items-end bg-colors-buttonNav bg-opacity-20 rounded-[4px]">
      <Button onClick={onScrollUp} className=" w-[40px] h-[40px] rounded-l-[4px] rounded-r-none bg-transparent border border-colors-buttonNav border-opacity-30 hover:bg-colors-buttonNav hover:bg-opacity-30">
        <FaCaretUp height={24} width={24} color="#5C28DF" className=" w-[40px] h-[40px] rounded-[4px] bg-transparent" />
      </Button>
      <Button onClick={onScrollDown} className=" w-[40px] h-[40px] rounded-r-[4px] rounded-l-none bg-transparent border border-colors-buttonNav border-opacity-30 hover:bg-colors-buttonNav hover:bg-opacity-30">
        <FaCaretDown height={24} width={24} color="#5C28DF" className=" w-[40px] h-[40px] rounded-[4px] bg-transparent" />
      </Button>
    </div>
  )
}

export default ScrollSection

