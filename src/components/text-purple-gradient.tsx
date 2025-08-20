import type React from "react"
import type { ElementType } from "react"

interface GradientTextProps<T extends ElementType = "p"> {
  children: React.ReactNode
  className?: string
  as?: T
}

const GradientText = <T extends ElementType = "p">({ children, className = "", as }: GradientTextProps<T>) => {
  const Component = as || "p"

  return (
    <Component className={`gradient-text-container ${className}`}>
      <span className="gradient-text-background" aria-hidden="true">
        {children}
      </span>
      <span className="gradient-text-content">{children}</span>
      <style jsx>{`
        .gradient-text-container {
          display: grid;
          position: relative;
        }
        .gradient-text-background,
        .gradient-text-content {
          grid-area: 1 / 1 / -1 / -1;
        }
        .gradient-text-background {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(to right, rgba(21, 21, 26, 1) 40%, rgba(21, 21, 26, 1) 47%, rgba(92, 40, 223, 1) 66%, rgba(255, 89, 183, 1) 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          z-index: 1;
        }
        .gradient-text-content {
          position: relative;
          z-index: 2;
          color: transparent;
        }
      `}</style>
    </Component>
  )
}

export default GradientText

