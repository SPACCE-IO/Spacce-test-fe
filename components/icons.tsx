// "use client"

// import { useEffect, useRef } from "react";
// import { gsap } from "gsap";
// import { MotionValue } from "framer-motion";

// interface IconsProps {
//   scrollYProgress: MotionValue<number>;
//   startSection: string;
//   endSection: string;
// }

// export function Icons1to9({ scrollYProgress, startSection, endSection }: IconsProps) {
//   const iconsRef = useRef<HTMLDivElement[]>([]); // Ref to store icon elements

//   useEffect(() => {
//     const icons = iconsRef.current;

//     // Create a GSAP timeline
//     const tl = gsap.timeline({
//       paused: true, // Start paused
//       scrollTrigger: {
//         trigger: startSection,
//         endTrigger: endSection,
//         scrub: true,
//         markers: true,
//         end: endSection
//       }
//     });

//     // Define the target position for the icons (center of the card in Section 3)
//     const targetX = window.innerWidth / 2; // Center x position
//     const targetY = window.innerHeight / 2; // Center y position

//     // Animate each icon to the center of the card
//     icons.forEach((icon, index) => {
//       tl.to(icon, {
//         x: targetX - 50, // Adjust to center the icon (assuming icon width is 100px)
//         y: targetY - 50, // Adjust to center the icon (assuming icon height is 100px)
//         duration: 1,
//         ease: "power2.out",
//         delay: index * 0.1, // Stagger the animations
//       });
//     });

//     // Play the timeline when the scroll progress reaches a certain point
//     const handleScroll = () => {
//       const progress = scrollYProgress.get();
//       if (progress > 0.5) { // Adjust this threshold as needed
//         tl.play();
//       } else {
//         tl.reverse(); // Reverse the animation if scroll is less than the threshold
//       }
//     };

//     // Listen to scroll progress changes
//     scrollYProgress.onChange(handleScroll);

//     return () => {
//       tl.kill(); // Clean up the timeline on unmount
//       scrollYProgress.off(handleScroll); // Remove the scroll listener
//     };
//   }, [scrollYProgress]);

//   const icons = [
//     { left: "10%", top: "20%" },
//     { left: "20%", top: "40%" },
//     { left: "15%", top: "60%" },
//     { left: "25%", top: "80%" },
//     { left: "30%", top: "30%" },
//     { right: "10%", top: "25%" },
//     { right: "20%", top: "45%" },
//     { right: "15%", top: "65%" },
//     { right: "25%", top: "85%" },
//   ];

//   return (
//     <>
//       {icons.map((position, index) => (
//         <div
//           key={index}
//           ref={(el) => (iconsRef.current[index] = el!)} // Store the reference to the icon
//           className="absolute w-[100px] h-[100px]"
//           style={position}
//         >
//           <HexIcon />
//         </div>
//       ))}
//     </>
//   );
// }

// export function Icons10to14({ scrollYProgress }: IconsProps) {
//   const iconsRef = useRef<HTMLDivElement[]>([]); // Ref to store icon elements

//   useEffect(() => {
//     const icons = iconsRef.current;

//     const tl = gsap.timeline({
//       paused: true,
//     });

//     const targetX = window.innerWidth / 2; // Center x position
//     const targetY = window.innerHeight / 2; // Center y position

//     icons.forEach((icon, index) => {
//       tl.to(icon, {
//         x: targetX - 50,
//         y: targetY - 50,
//         duration: 1,
//         ease: "power2.out",
//         delay: index * 0.1,
//       });
//     });

//     const handleScroll = () => {
//       const progress = scrollYProgress.get();
//       if (progress > 0.5) {
//         tl.play();
//       } else {
//         tl.reverse();
//       }
//     };

//     scrollYProgress.onChange(handleScroll);

//     return () => {
//       tl.kill();
//       scrollYProgress.off(handleScroll);
//     };
//   }, [scrollYProgress]);

//   const icons = [
//     { left: "40%", top: "20%" },
//     { left: "60%", top: "30%" },
//     { right: "40%", top: "25%" },
//     { right: "50%", top: "35%" },
//     { right: "45%", top: "40%" },
//   ];

//   return (
//     <>
//       {icons.map((position, index) => (
//         <div
//           key={index}
//           ref={(el) => (iconsRef.current[index] = el!)}
//           className="absolute w-[100px] h-[100px]"
//           style={position}
//         >
//           <HexIcon />
//         </div>
//       ))}
//     </>
//   );
// }

// function HexIcon() {
//   return (
//     <svg viewBox="0 0 100 100" className="w-full h-full">
//       <defs>
//         <linearGradient id="iconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
//           <stop offset="0%" stopColor="#06b6d4" />
//           <stop offset="100%" stopColor="#d946ef" />
//         </linearGradient>
//       </defs>
//       <path
//         d="M50 0 L93.3 25 L93.3 75 L50 100 L6.7 75 L6.7 25 Z"
//         fill="url(#iconGradient)"
//         stroke="#06b6d4"
//         strokeWidth="2"
//       />
//     </svg>
//   );
// }
