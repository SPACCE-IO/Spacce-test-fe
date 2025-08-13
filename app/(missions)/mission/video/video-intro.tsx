import VideoPerspectiveView from '@/components/video-perspective-view'
import React from 'react'

const VideoIntro = () => {
  return (
     <div className="flex justify-center items-center">
                <VideoPerspectiveView videoSrc="/sample.mp4" />
              </div>
  )
}

export default VideoIntro