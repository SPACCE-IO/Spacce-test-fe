import React from 'react'
import PdfViewer from './PdfViewer'
// import PdfViewer from './PdfViewer'

interface PdfPerspectiveViewProps {
    pdfSrc: string
  }

const PdfPerspectiveView = ( { pdfSrc }: PdfPerspectiveViewProps ) => {

  return (
    <div className=" perspective-400 w-[60%] flex justify-center items-start relative top-[90px]">
      <div className="flex  w-[80%] justify-center items-end  ounded-[15px] transform rotate-x-30 relative -top-36 ">
    <div className='h-full w-full rounded-[5px] bg-purple-300 flex items-center justify-center aspect-video'>
         <PdfViewer url={pdfSrc} />
         {/* {pdfSrc} */}
        </div>
    </div>
      
    </div>
  )
}

export default PdfPerspectiveView