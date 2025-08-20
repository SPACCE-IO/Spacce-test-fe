import type React from "react"

interface StartSectionProps {
  children?: React.ReactNode
}

const StartSection: React.FC<StartSectionProps> = ({ children }) => {
  return (
    <section
    className="min-h-screen relative flex flex-col items-center justify-center text-white bg-gradient-custom-2">
        {children}
    </section>
  )
}

export default StartSection

