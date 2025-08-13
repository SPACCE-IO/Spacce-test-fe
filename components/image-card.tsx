import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

interface ImageCardProps {
  imageUrl: string;
  title: string;
  index: number;
}

export function ImageCard({ imageUrl, title, index }: ImageCardProps) {
  // Calculate rotation based on index
  // Middle card (index 2) has no rotation
  const rotation = (index - 2) * 8; // Increased rotation for more pronounced effect

  // Calculate scale based on distance from center
  // Center card (index 2) is 100% size
  // Each card away from center reduces in size by 10%
  const scale = 1 - Math.abs(index - 2) * 0.1;

  return (
    <div
      className="relative grid grid-rows-7 w-[207px] h-[250px] 
        rounded-2xl shadow-lg transition-all duration-300 hover:-translate-y-2 hover:z-10  "
      style={{
        transform: `rotate(${rotation}deg) scale(${scale})`,
        marginLeft: index === 0 ? "0" : index === 4 ? "-1rem" : "-0.6rem", // Increased overlap for better composition // Increased overlap for better composition
        // marginLeft: index === 4 ? '-4rem' : '0', // Increased overlap for better composition
        zIndex: index === 2 ? 5 : Math.abs(2 - index),
        transformOrigin: "bottom center",
        translate:
          index === 2 ? "0" : index === 0 || index === 4 ? "0 3.5rem" : "0 0.9rem",
        // marginTop: Math.abs(index - 2) * 1 + 'rem'
      }}
    >
      <div className=" row-span-5 rounded-t-[15px] h-full w-full">
        <div className="relative h-full w-full rounded-t-xl overflow-hidden">
          <Image src={imageUrl} alt={title} fill className="object-cover" />
        </div>
        <div className="row-span-2 gap-3  rounded-b-[15px] justify-start items-center grid grid-flow-row py-4 px-2 h-[64px]  ">
          <Skeleton className="w-[150px] h-[15px] rounded-[5.7px] bg-neutral-400 p-2" />
          <Skeleton className="w-[80px] h-[15px] rounded-[5.7px] bg-neutral-400 p-2" />
        </div>
      </div>
    </div>
  );
}
