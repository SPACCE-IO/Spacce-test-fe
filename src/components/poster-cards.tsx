// import Image from "next/image"

// interface PosterCardProps {
//   imageUrl?: string
//   title?: string
//   index?: number
// }

export function PosterCards() {
  return (
    <div className="relative w-60 h-72  shadow-lg transition-all duration-300 hover:-translate-y-2 hover:z-20 overflow-hidden">
      {/* <Image src={imageUrl || "/placeholder.svg"} alt={title} fill className="object-cover" /> */}
      {/* <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-4">
        <h3 className="text-white text-lg font-bold">{title}</h3>
      </div> */}
    </div>
  )
}

