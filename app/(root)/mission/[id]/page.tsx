'use client';

import React, { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation';
import { useGetMissionByIdQuery, useLazyGetMissionByIdQuery } from '@/app/store/services/missionManagement';
import { getAuthToken } from '@/utils/auth';
import TutorialMission from '../tutorial/tutorial-mission';
import PosterMission from '../poster/poster-mission';
import VideoMission from '../video/video-mission';
import AnonymousMission from '../anonymous/anonymous-mission';
import StandardMission from '../standard/standard-mission';
import AppreciationMission from '../appreciation/appreciation-mission';
import PdfMission from '../pdf/pdf-mission';

// Define the mission data structure based on your API response
interface MissionQuestion {
  id: number;
  questionTypeId: number;
  typeCode: string;
  description: string;
  hint: string;
  question: string;
  sequence: number;
  hasCorrectAnswer: boolean;
  isRequired: boolean;
  points: number;
  placeholder: string;
  userAnswer: string;
  status: number;
  correctAnswer: string | null;
  // Additional properties based on question type
  characterLimit?: number;
  options?: Array<{
    id: string;
    text: string;
    isCorrect: boolean;
  }>;
  imageOptions?: Array<{
    id: string;
    altText: string;
    caption: string;
    imageUrl: string;
    isCorrect: boolean;
  }>;
  maxRating?: number;
  allowMultipleSelection?: boolean;
  matchingtems?: Array<{
    id: string;
    altText: string;
    caption: string;
    imageUrl: string;
  }>;
}

interface MissionData {
  id: number;
  workspaceId: number;
  type: string;
  name: string;
  languageId: number;
  description: string;
  instruction: string;
  createdOn: number;
  questions: MissionQuestion[];
  status: number;
  report?: {
    email: string;
    reportTypeId: number;
  };
  iconUrl?: {
    fileName: string;
    contentType: string;
    url: string;
  };
  tags: string[];
  typeSpecificInfo: Array<{
    name: string;
    value: string;
  }>;
  documents: Array<{
    name: string;
    url: {
      fileName: string;
      contentType: string;
      url: string;
    };
  }>;
  rewards: any[];
}

// Loading component
const LoadingMission = () => (
  <div className="min-h-screen bg-gradient-custom flex flex-col items-center justify-center">
    <div className="text-white text-xl mb-4">Loading Mission...</div>
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
  </div>
);

// Error component
const ErrorMission = ({ error, onRetry }: { error: string; onRetry: () => void }) => (
  <div className="min-h-screen bg-gradient-custom flex flex-col items-center justify-center">
    <div className="text-red-400 text-xl mb-4">Failed to load mission</div>
    <div className="text-gray-400 mb-6">{error}</div>
    <button 
      onClick={onRetry}
      className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
    >
      Try Again
    </button>
  </div>
);

// Mission not found component
const MissionNotFound = () => (
  <div className="min-h-screen bg-gradient-custom flex flex-col items-center justify-center">
    <div className="text-gray-400 text-xl mb-4">Mission Not Found</div>
    <div className="text-gray-500 mb-6">The requested mission could not be found.</div>
    <button 
      onClick={() => window.history.back()}
      className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
    >
      Go Back
    </button>
  </div>
);

const Mission = () => {
  const router = useRouter();
  const params = useParams();
  const missionId = params?.id || params?.missionId;
  const [missionData, setMissionData] = useState<MissionData | null>(null);
  const token = getAuthToken();
  const getMissionByIdProps = useGetMissionByIdQuery({ id: missionId, authToken: token });
  
  // Handle API response
  useEffect(() => {
    if (getMissionByIdProps.isSuccess && getMissionByIdProps.data) {
      setMissionData(getMissionByIdProps.data as MissionData);
    }
  }, [getMissionByIdProps.isSuccess, getMissionByIdProps.data]);

 
  // Show loading state
  if (getMissionByIdProps.isLoading) {
    return <LoadingMission />;
  }

  // Show error state
  if (getMissionByIdProps.isError) {
    const errorMessage = 'error' in getMissionByIdProps && getMissionByIdProps.error 
      ? 'message' in getMissionByIdProps.error 
        ? getMissionByIdProps.error.message 
        : 'An unexpected error occurred'
      : 'Failed to fetch mission data';
    
    return <ErrorMission error={errorMessage} onRetry={()=> console.log("refresh")} />;
  }

  // Show not found if no mission data
  if (!missionData && getMissionByIdProps.isSuccess) {
    return <MissionNotFound />;
  }

  // Show not found if no mission ID in URL
  if (!missionId) {
    return <MissionNotFound />;
  }

  // Don't render mission components until we have data
  if (!missionData) {
    return <LoadingMission />;
  }

  // Route to appropriate mission component based on mission type
  const missionType = missionData.type;

  switch (missionType) {
    case "STANDARD_MISSION":
      return <StandardMission mission={missionData} />;
    
    case "PDF_MISSION":
      return <PdfMission mission={missionData} />;
    
    case "APPRECIATION_MISSION":
      return <AppreciationMission mission={missionData} />;
    
    case "VIDEO_MISSION":
      return <VideoMission mission={missionData} />;
    
    case "POSTER_MISSION":
      return <PosterMission mission={missionData} />;
    
    case "TUTORIAL_MISSION":
      return <TutorialMission mission={missionData} />;
    
    case "ANONYMOUS_MISSION":
      return <AnonymousMission mission={missionData} />;
    
    default:
      return (
        <div className="min-h-screen bg-gradient-custom flex flex-col items-center justify-center">
          <div className="text-yellow-400 text-xl mb-4">Unknown Mission Type</div>
          <div className="text-gray-400 mb-6">Mission type "{missionType}" is not supported.</div>
          <button 
            onClick={() => router.push('/dashboard')}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      );
  }
};

export default Mission;