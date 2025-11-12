"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/src/components/ui/button";
import { ScrollArea } from "@/src/components/ui/scroll-area";
import localFont from "next/font/local";
import Image from "next/image";
import { useRouter } from "next/navigation";

import Standard from "@/public/assets/badges/standard.svg";
import StandardDone from "@/public/assets/badges/standardDone.svg";
import Leadership from "@/public/assets/badges/leadership.svg";
import LeadershipDone from "@/public/assets/badges/leadershipDone.svg";
import TwoMinute from "@/public/assets/badges/two-minute.svg";
import TwoMinuteDone from "@/public/assets/badges/two-minuteDone.svg";
import SystemTraining from "@/public/assets/badges/system.svg";
import SystemTrainingDone from "@/public/assets/badges/systemDone.svg";
import Poster from "@/public/assets/badges/poster.svg";
import PosterDone from "@/public/assets/badges/posterDone.svg";
import Video from "@/public/assets/badges/video.svg";
import VideoDone from "@/public/assets/badges/videoDone.svg";
import Pdf from "@/public/assets/badges/pdf.svg";
import PdfDone from "@/public/assets/badges/pdfDone.svg";
import Anonymous from "@/public/assets/badges/anonymous.svg";
import AnonymousDone from "@/public/assets/badges/anonymousDone.svg";
import AnimatedBadge from "./AnimatedBadge";
import { getAuthToken } from "@/src/utils/auth";
import { useSession } from "next-auth/react";
import { useGetDashboardQuery } from "../services/userManagement";
import { useDispatch } from "react-redux";
import { setCurrentMissionReward } from "../slices/missionSlice";

const myFont = localFont({ src: "../fonts/Satoshi-Medium.woff" });

gsap.registerPlugin(ScrollTrigger);

interface ApiMission {
  missionId: number;
  name: string;
  status: "InProgress" | "NotStarted" | "Completed";
  sequence: number;
  rewards: Array<{
    rewardId: number;
    type: string;
    name: string;
    tag: string[];
    url: Array<{
      fileName: string;
      contentType: string;
      url: string;
    }>;
  }>;
}

interface DashboardData {
  firstName: string;
  lastName: string;
  profilePicUrl?: {
    fileName: string;
    contentType: string;
    url: string;
  };
  missions: ApiMission[];
}

interface Mission {
  id: number;
  title: string;
  url: string;
  description: string;
  isCompleted: boolean;
  status: "completed" | "active" | "incomplete";
  badge: {
    completed: typeof StandardDone;
    incomplete: typeof Standard;
  };
  animation: string;
  rewardUrl?: string;
  sequence: number;
}

// Badge mapping - you can customize this based on mission type or sequence
const getBadgeBySequence = (sequence: number) => {
  const badges = [
    { completed: StandardDone, incomplete: Standard },
    { completed: LeadershipDone, incomplete: Leadership },
    { completed: TwoMinuteDone, incomplete: TwoMinute },
    { completed: SystemTrainingDone, incomplete: SystemTraining },
    { completed: PosterDone, incomplete: Poster },
    { completed: VideoDone, incomplete: Video },
    { completed: PdfDone, incomplete: Pdf },
    { completed: AnonymousDone, incomplete: Anonymous },
  ];
  return badges[(sequence - 1) % badges.length] || badges[0];
};

// Animation mapping
const getAnimationBySequence = (sequence: number) => {
  const animations = ["zoomPop", "dropBounce", "fadeUp"];
  return animations[(sequence - 1) % animations.length];
};

const truncateWithEllipsis = (str: string, maxLength: number = 40): string => {
  return str.length > maxLength ? str.slice(0, maxLength) + "..." : str;
};

// Convert API status to our status format
const convertStatus = (
  apiStatus: string
): "completed" | "active" | "incomplete" => {
  switch (apiStatus) {
    case "Completed":
      return "completed";
    case "InProgress":
      return "active";
    case "NotStarted":
    default:
      return "incomplete";
  }
};

// Helper function to determine the default selected mission based on priority
const getDefaultSelectedMission = (missions: Mission[]): Mission | null => {
  if (missions.length === 0) return null;

  // Priority 1: Find active mission
  const activeMission = missions.find((mission) => mission.status === "active");
  if (activeMission) return activeMission;

  // Priority 2: Find next incomplete mission (lowest sequence number among incomplete)
  const incompleteMissions = missions
    .filter((mission) => mission.status === "incomplete")
    .sort((a, b) => a.sequence - b.sequence);
  console.log("Incomplete Missions:", incompleteMissions);
  if (incompleteMissions.length > 0) return incompleteMissions[0];

  // Priority 3: Show last completed mission (highest sequence number among completed)
  const completedMissions = missions
    .filter((mission) => mission.status === "completed")
    .sort((a, b) => b.sequence - a.sequence); // Sort descending for highest sequence first
  console.log("Completed Missions:", completedMissions);
  if (completedMissions.length > 0) return completedMissions[0];

  // Fallback: return first mission if none match the criteria above
  return missions[0];
};

export default function CurrentMission() {
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [userInfo, setUserInfo] = useState<{
    firstName: string;
    lastName: string;
    profilePicUrl?: string;
  }>({
    firstName: "",
    lastName: "",
  });

  const { data: session } = useSession();
  const dispatch = useDispatch();

  const timelineRef = useRef<HTMLDivElement>(null);
  const missionsRef = useRef<(HTMLDivElement | null)[]>([]);
  const { data, isLoading, isError, isSuccess } = useGetDashboardQuery(
    session?.accessToken
  );

  const router = useRouter();

  const setMissionRef = useCallback(
    (el: HTMLDivElement | null, index: number) => {
      missionsRef.current[index] = el;
    },
    []
  );

  // Process API data when it's available
  useEffect(() => {
    if (isSuccess && data) {
      const dashboardData = data as DashboardData;

      // Set user info
      setUserInfo({
        firstName: dashboardData.firstName,
        lastName: dashboardData.lastName,
        profilePicUrl: dashboardData.profilePicUrl?.url,
      });

      // Convert API missions to our mission format
      const convertedMissions: Mission[] = [...dashboardData?.missions] // Create a copy first
        .sort((a, b) => a.sequence - b.sequence) // Sort by sequence
        .map((apiMission) => {
          const status = convertStatus(apiMission.status);
          const isCompleted = status === "completed";

          return {
            id: apiMission.missionId,
            title: apiMission.name,
            url: `mission/${apiMission.missionId}`, // You can customize this URL structure
            description: `Complete the ${apiMission.name} to earn your reward.`, // Customize description as needed
            isCompleted,
            status,
            badge: getBadgeBySequence(apiMission.sequence),
            animation: getAnimationBySequence(apiMission.sequence),
            rewardUrl: apiMission.rewards[0]?.url[0]?.url, // Get the first reward URL
            sequence: apiMission.sequence,
          };
        });

      setMissions(convertedMissions);

      // Set default selected mission using priority logic
      const defaultMission = getDefaultSelectedMission(convertedMissions);
      setSelectedMission(defaultMission);
    }
  }, [isSuccess, data]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const ctx = gsap.context(() => {
        // Animate the timeline line
        gsap.from(".timeline-line", {
          height: 0,
          duration: 1,
          ease: "none",
          scrollTrigger: {
            trigger: timelineRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
          },
        });
      });

      return () => ctx.revert();
    }
  }, [missions]);

  const handleClick = (mission: Mission | null) => {
    dispatch(setCurrentMissionReward(mission?.rewardUrl || ""));
    if (mission) {
      router.push(`/${mission.url}`);
    } else {
      router.push("/mission");
    }
  };

  const completedMissions = missions.filter(
    (mission) => mission.isCompleted
  ).length;

  // Loading state
  if (isLoading) {
    return (
      <div className="container h-[90vh] w-full p-5 mx-auto flex flex-col justify-center items-center">
        <div className="text-white text-lg">Loading missions...</div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="container h-[90vh] w-full p-5 mx-auto flex flex-col justify-center items-center">
        <div className="text-red-400 text-lg">
          Failed to load missions. Please try again.
        </div>
      </div>
    );
  }

  // Empty state
  if (missions.length === 0) {
    return (
      <div className="container h-[90vh] w-full p-5 mx-auto flex flex-col justify-center items-center">
        <div className="text-gray-400 text-lg">
          No missions available at the moment.
        </div>
      </div>
    );
  }

  return (
    <div className="container h-[90vh] w-full p-5 mx-auto flex flex-col justify-center items-center">
      <div className={`grid lg:grid-cols-4 gap-16`}>
        <div className="space-y-4 col-span-1">
          <h2 className="text-[24px] font-bold text-white">
            {userInfo.firstName
              ? `${userInfo.firstName}'s Missions`
              : "Mission Moment Title"}
          </h2>
          <div className="h-[580px] w-[273px] rounded-md relative">
            <ScrollArea className="h-full w-full rounded-md">
              <div
                className="relative space-y-4 px-4 pt-4 pb-14"
                ref={timelineRef}
              >
                {/* Timeline line */}
                <div className="timeline-line absolute left-[11px] top-[24px] w-0.5 h-[calc(100%-48px)]" />
                <div className="pr-4 flex flex-col gap-2">
                  {/* Mission items */}
                  {missions.map((mission, index) => {
                    const isSelected = selectedMission?.id === mission.id;

                    return (
                      <div
                        key={mission.id}
                        ref={(el) => setMissionRef(el, index)}
                        className={`relative pl-4 py-4 transition-colors gap-2 cursor-pointer rounded-[12px] h-[124px] flex ${
                          myFont.className
                        }
                    ${
                      isSelected
                        ? "bg-white bg-opacity-10"
                        : "hover:bg-white hover:bg-opacity-10"
                    }
                    ${mission.isCompleted ? "" : ""}`}
                        onClick={() => setSelectedMission(mission)}
                      >
                        <div className="w-[24px] h-full flex flex-col items-center justify-start gap-1 mt-[6px]">
                          {/* Timeline dot */}
                          <div
                            className={`border-gray-600 bg-transparent w-[20px] h-[20px] rounded-full border-2 flex items-center justify-center relative mx-auto ${
                              mission.isCompleted
                                ? "border-purple-500 bg-transparent"
                                : isSelected
                                ? ""
                                : ""
                            }
                    ${
                      mission.status === "active"
                        ? "border-purple-500 bg-transparent"
                        : ""
                    }
                    `}
                          >
                            <div
                              className={`w-[10px] h-[10px] rounded-full ${
                                mission.isCompleted
                                  ? "border-black bg-purple-500"
                                  : isSelected
                                  ? ""
                                  : ""
                              }`}
                            />
                          </div>
                          {/* Mission Line */}
                          <div
                            className={`
                    ${
                      mission.isCompleted
                        ? "w-[3px] bg-purple-500 h-[68px]"
                        : isSelected
                        ? ""
                        : ""
                    }
                    ${
                      mission.status === "active"
                        ? "w-[3px] bg-gradient-to-b from-purple-500 to-transparent h-[60px]"
                        : ""
                    }
                    `}
                          ></div>
                        </div>

                        {/* Mission content */}
                        <div
                          className={`transition-opacity w-full p-1 ${
                            mission.isCompleted
                              ? "text-white"
                              : isSelected
                              ? "text-white"
                              : "text-gray-500"
                          }`}
                        >
                          <h3 className="text-base font-semibold leading-5">
                            {mission.title}
                          </h3>
                          <p className="text-base mt-1 opacity-[75%] leading-[22.4px]">
                            {truncateWithEllipsis(mission.description)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </ScrollArea>
            <div className="h-[230px] w-[273px] rounded-md absolute bottom-0 z-10 bg-gradient-to-t from-[#1a1a1a] to-transparent pointer-events-none"></div>
          </div>

          <div className="text-sm text-gray-400">
            {completedMissions} / {missions.length}
          </div>
        </div>

        <div className="space-y-4 col-span-3 container mx-auto flex-col flex items-center pt-4 gap-10">
          <div className="flex items-center rounded-full">
            {selectedMission && (
              <AnimatedBadge
                amplitude={20}
                revealType={selectedMission.animation}
                triggerAnimation={selectedMission?.id} // Pass the selected mission ID as the trigger
              >
                {/* Show reward image if available, otherwise show badge */}
                {selectedMission.rewardUrl && (
                  <img
                    src={selectedMission.rewardUrl}
                    alt={`Reward for ${selectedMission.title}`}
                    height={400}
                    width={400}
                    className="badge-gradient rounded-full"
                  />
                )}
              </AnimatedBadge>
            )}
          </div>
          <p className="text-white font-[16px] text-center w-[400px]">
            {selectedMission
              ? selectedMission.description
              : "Select a mission to view its details."}
          </p>
          <div className="flex justify-center">
            <Button
              variant={"primary"}
              className="bg-purple-600 hover:bg-purple-700"
              onClick={() => handleClick(selectedMission)}
            >
              {selectedMission && !selectedMission.isCompleted
                ? "Start Mission"
                : "View Mission"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
