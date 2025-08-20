import type React from "react"

interface TaskPaginationProps {
  children: React.ReactNode
}

const TaskPagination: React.FC<TaskPaginationProps> = ({ children }) => {
  return (
    <div className="right-0 z-40 absolute h-screen w-[122px] pt-10 pb-[60px] pr-[32px] bg-center bg-no-repeat bg-fixed bg-opacity-50 ">
      <div className="flex flex-col justify-end h-full">{children}</div>
    </div>
  )
}

export default TaskPagination

