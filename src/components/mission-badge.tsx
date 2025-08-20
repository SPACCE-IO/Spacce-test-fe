import Image from "next/image"
import Standard from "@/public/assets/badges/standard.svg"
import StandardDone from "@/public/assets/badges/standardDone.svg"
import Leadership from "@/public/assets/badges/leadership.svg"
import LeadershipDone from "@/public/assets/badges/leadershipDone.svg"
import TwoMinute from "@/public/assets/badges/two-minute.svg"
import TwoMinuteDone from "@/public/assets/badges/two-minuteDone.svg"
import SystemTraining from "@/public/assets/badges/system.svg"
import SystemTrainingDone from "@/public/assets/badges/systemDone.svg"
import Poster from "@/public/assets/badges/poster.svg"
import PosterDone from "@/public/assets/badges/posterDone.svg"
import Video from "@/public/assets/badges/video.svg"
import VideoDone from "@/public/assets/badges/videoDone.svg"
import Pdf from "@/public/assets/badges/pdf.svg"
import PdfDone from "@/public/assets/badges/pdfDone.svg"
import Anonymous from "@/public/assets/badges/anonymous.svg"
import AnonymousDone from "@/public/assets/badges/anonymousDone.svg"

interface BadgeSize {
  width?: number
  height?: number
  mission: string
  missionStatus: string
}

const badgeMap = {
  standard: { incomplete: Standard, complete: StandardDone },
  leadership: { incomplete: Leadership, complete: LeadershipDone },
  "two-minute": { incomplete: TwoMinute, complete: TwoMinuteDone },
  "system-training": { incomplete: SystemTraining, complete: SystemTrainingDone },
  poster: { incomplete: Poster, complete: PosterDone },
  video: { incomplete: Video, complete: VideoDone },
  pdf: { incomplete: Pdf, complete: PdfDone },
  anonymous: { incomplete: Anonymous, complete: AnonymousDone },
}

const MissionBadge = ({ width = 330, height = 330, mission, missionStatus }: BadgeSize) => {
  const badgeType = badgeMap[mission as keyof typeof badgeMap] || badgeMap.standard
  const BadgeImage = missionStatus === "complete" ? badgeType.complete : badgeType.incomplete

  return (
    <div className="container mx-auto rounded-[5px] flex justify-center items-center">
      <Image src={BadgeImage || "/placeholder.svg"} width={width} height={height} alt={`${mission} Mission Badge`} />
    </div>
  )
}

export default MissionBadge

