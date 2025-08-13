import type React from "react"

interface SectionScrollBottomProps {
  children?: React.ReactNode
}

const SectionScrollBottom: React.FC<SectionScrollBottomProps> = ({ children }) => {
  return (
    <div>
      <div className="flex justify-end items-end gap-2 w-full">
        {children}
      </div>
    </div>
  )
}
export default SectionScrollBottom

