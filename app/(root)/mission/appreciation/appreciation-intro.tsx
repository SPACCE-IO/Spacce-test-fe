import React from 'react'
import profile1 from "@/public/assets/profilepics/profile1.svg";
import profile2 from "@/public/assets/profilepics/profile2.svg";
import profile3 from "@/public/assets/profilepics/profile3.svg";
import profile4 from "@/public/assets/profilepics/profile4.svg";
import profile5 from "@/public/assets/profilepics/profile5.svg";
import { ImageCard } from '@/app/components/image-card';

const AppreciationIntro = () => {
   const profiles = [
    {
      imageUrl: profile1,
      title: "Profile 1",
    },
    {
      imageUrl: profile2,
      title: "Profile 2",
    },
    {
      imageUrl: profile3,
      title: "Profile 3",
    },
    {
      imageUrl: profile4,
      title: "Profile 4",
    },
    {
      imageUrl: profile5,
      title: "Profile 5",
    },
  ];
  return (
     <div className="grid grid-cols-5">
                    {profiles.map((profile, index) => (
                      <ImageCard
                        key={index}
                        imageUrl={profile.imageUrl}
                        title={profile.title}
                        index={index}
                      />
                    ))}
                  </div>
  )
}

export default AppreciationIntro