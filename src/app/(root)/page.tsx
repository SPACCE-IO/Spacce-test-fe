"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/src/components/ui/button";
import { useRouter } from "next/navigation";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const router = useRouter();
  const handlelandingPage = () => {
    router.push("/landing-page");
  };

  const handleMissionRoute = (path: any) => {
    router.push(path);
  };

  const handleNewMission = () => {
    router.push("/update/standard-mission");
  };

  const handleNewMissionVideo = () => {
    router.push("/update/pdf-mission");
  };

  const handleLogin = () => {
    router.push("/login");
  };
  const handleAnonymous = () => {
    router.push("/anonymous");
  };
  const handleFinalCongrats = () => {
    router.push("/final-congrats");
  };
  const handleLeadership = () => {
    router.push("/leadership");
  };
  const handleMission = () => {
    router.push("/mission");
  };
  const handlePdfMission = () => {
    router.push("/pdf-mission");
  };
  const handlePosterMission = () => {
    router.push("/poster-mission");
  };
  const handleProfile = () => {
    router.push("/profile");
  };
  const handleSystemTraining = () => {
    router.push("/system-training");
  };
  const handleTwoMinuteAppreciation = () => {
    router.push("/two-minute-appreciation");
  };
  const handleVideoMissions = () => {
    router.push("/video-missions");
  };
  const handleDashboard = () => {
    router.push("/dashboard");
  };

  return (
    <div className="grid grid-cols-2 gap-4 px-40 h-screen py-52 bg-gradient-custom-center-home">
      <div className="col-span-2 text-white text-opacity-90 text-lg">
        Page Navigation
      </div>
      <Button
        variant={"primary"}
        className=" border-green-300"
        onClick={() => handleMissionRoute("/update/standard")}
      >
        Standard Mission
      </Button>
      <Button
        variant={"primary"}
        className=" border-green-300"
        onClick={() => handleMissionRoute("/update/pdf")}
      >
        PDF Mission
      </Button>
      <Button
        variant={"primary"}
        className=" border-green-300"
        onClick={() => handleMissionRoute("/update/appreciation")}
      >
        Appreciation Mission
      </Button>
      <Button
        variant={"primary"}
        className=" border-green-300"
        onClick={() => handleMissionRoute("/update/video")}
      >
        Video Mission
      </Button>
      <Button
        variant={"primary"}
        className=" border-green-300"
        onClick={() => handleMissionRoute("/update/anonymous")}
      >
        Anonymous Mission
      </Button>
      <Button
        variant={"primary"}
        className=" border-green-300"
        onClick={() => handleMissionRoute("/update/poster")}
      >
        Poster Mission
      </Button>
      <Button
        variant={"primary"}
        className=" border-green-300"
        onClick={() => handleMissionRoute("/update/tutorial")}
      >
        Tutorial Mission
      </Button>
      <Button
        variant={"primary"}
        className=" border-green-300"
        onClick={() => handleMissionRoute("/update/leadership")}
      >
        Leadership Mission
      </Button>
      <div className="col-span-2 text-white text-opacity-90 text-lg">
        Old Missions
      </div>
      <Button
        variant={"primary"}
        className=" border-green-300"
        onClick={handleNewMission}
      >
        New Mission
      </Button>
      <Button
        variant={"primary"}
        className=" border-green-300"
        onClick={handleNewMissionVideo}
      >
        New Mission Video
      </Button>
      <div></div>
      <Button variant={"primary"} onClick={handlelandingPage}>
        Landing Page
      </Button>
      <Button variant={"primary"} onClick={handleLogin}>
        Login
      </Button>
      <Button variant={"primary"} onClick={handleProfile}>
        Profile
      </Button>
      <Button variant={"primary"} onClick={handleDashboard}>
        Dashboard
      </Button>
      <Button variant={"primary"} onClick={handleMission}>
        Mission
      </Button>
      <Button variant={"primary"} onClick={handleLeadership}>
        Leadership
      </Button>
      <Button variant={"primary"} onClick={handleAnonymous}>
        Anonymous
      </Button>
      <Button variant={"primary"} onClick={handleTwoMinuteAppreciation}>
        Two Minute Appreciaiton
      </Button>
      <Button variant={"primary"} onClick={handleSystemTraining}>
        System Training
      </Button>
      <Button variant={"primary"} onClick={handlePosterMission}>
        Poster Missions
      </Button>
      <Button variant={"primary"} onClick={handleVideoMissions}>
        Video Missions
      </Button>
      <Button variant={"primary"} onClick={handlePdfMission}>
        Pdf/Document Missions
      </Button>
      <Button variant={"primary"} onClick={handleFinalCongrats}>
        Final Congrats
      </Button>
    </div>
  );
}
