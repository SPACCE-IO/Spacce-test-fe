import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function useNavigationCleanup() {
  const pathname = usePathname();

  useEffect(() => {
    // Clean up GSAP animations
    if (typeof window !== 'undefined' && window.gsap) {
      // Kill all GSAP animations
      window.gsap.killTweensOf("*");
      
      // Clear ScrollTrigger instances
      if (window.gsap.ScrollTrigger) {
        window.gsap.ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      }
    }

    // Reset scroll position
    window.scrollTo(0, 0);

    // Clear any timeouts or intervals
    const timeouts = window.setTimeout(() => {}, 0);
    for (let i = 0; i < timeouts; i++) {
      window.clearTimeout(i);
    }

    const intervals = window.setInterval(() => {}, 0);
    for (let i = 0; i < intervals; i++) {
      window.clearInterval(i);
    }

    // Cleanup function
    return () => {
      if (typeof window !== 'undefined' && window.gsap) {
        window.gsap.killTweensOf("*");
        if (window.gsap.ScrollTrigger) {
          window.gsap.ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        }
      }
    };
  }, [pathname]);
} 