/// <reference types="next-video/video-types/global" />

declare global {
  interface Window {
    gsap: {
      killTweensOf: (target: any) => void;
      ScrollTrigger: {
        getAll: () => any[];
      };
    };
  }
}

export {};
