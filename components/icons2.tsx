// "use client";

// import React, { useEffect, useRef } from "react";
// import { gsap } from "gsap";
// import { useScroll } from "framer-motion";

// // interface IconProps {
// //     scrollYProgress: MotionValue<number>;
// //     startSection: React.Ref<string>;
// //     endSection: React.Ref<string>;
// // }

// const IconOne = () => {

//     const containerRef = useRef(null)
//     const { scrollYProgress } = useScroll({
//       target: containerRef,
//       offset: ["start end", "end start"],
//     })


//   useEffect(() => {
//     const tl = gsap.timeline({
//       paused: true,
//       scrollTrigger: {
//         trigger: "[data-section-1]",
//         endTrigger:"[data-section-3]",
//         scrub: true,
//         markers: true,
//         end: 'bottom'
//       },

//     });

//     tl.to("[data-scrub]", { xPercent: 0, yPercent: 0 });
//     tl.addLabel("section-1");
//     tl.to("[data-scrub]", { xPercent: 0, yPercent: 200 });
//     tl.addLabel("section-2");
//     tl.to("[data-scrub]", { xPercent: 200, yPercent: 0 });
//     tl.addLabel("section-3");
//   },[scrollYProgress]);



//   return (
//     <div>
//       <section className="w-screen h-64 bg-transparent text-white flex items-center justify-center text-3xl">
//         Header
//       </section>
//       <main data-wrap>
//         <section
//           data-section-1
//           className="w-screen h-screen bg-transparent text-white flex items-center justify-center text-3xl"
//         >
//           Content Section 1
//         </section>
//         <section
//           data-section-2
//           className="w-screen h-64 bg-transparent text-white flex items-center justify-center text-3xl"
//         >
//           Content Section 2
//         </section>
//         <section
//           data-section-3
//           className="w-screen h-screen bg-transparent text-white flex items-center justify-center text-3xl"
//         >
//           Content Section 3
//         </section>
//       </main>
//       <section className="fixed inset-0">
//         <div
//           data-scrub
//           className="w-20 h-20 rounded-full bg-transparent text-gray-900 text-xs"
//         >
//           Scrubbing Timeline Animation
//         </div>
//       </section>
//       <section className="w-screen h-screen bg-transparent text-white flex items-center justify-center text-3xl">
//         Footer
//       </section>
//     </div>
//   );
// };

// export default IconOne;
