// API Base Types
export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  error?: any;
}

// Auth Types
export interface LoginRequest {
  userName: string;
  password: string;
  orgCode: string;
}

export interface LoginResponse {
  token: string;
}

export interface LogoutResponse {
  message: string;
  error: any;
}

export interface ForgotPasswordRequest {
  userName: string;
  orgCode: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

// User Profile Types
export interface UserProfile {
  userName: string;
  firstName: string;
  lastName: string;
  gender: string;
  phone: string;
  profilePic: ProfileImage;
  tags: string[];
  attributes: UserAttribute[];
}

export interface ProfileImage {
  fileName: string;
  contentType: string;
  url: string;
}

export interface UserAttribute {
  name: string;
  value: string;
}

export interface UpdateProfileRequest {
  phone?: string;
  businessUnit?: string;
  managerName?: string;
  profilePic?: string;
}

export interface UpdateProfileResponse {
  message: string;
}

export interface ResetPasswordRequest {
  password: string;
}

export interface ResetPasswordResponse {
  token: string;
}

// Dashboard Types
export interface DashboardData {
  firstName: string;
  lastName: string;
  profilePicUrl: ProfileImage;
  percentageCompletion: PercentageCompletion;
  missions: Mission[];
}

export interface PercentageCompletion {
  InProgress: number;
  Completed: number;
}

export interface Mission {
  missionId: number;
  name: string;
  status: string;
  sequence: number;
  rewards: Reward[];
}

export interface Reward {
  rewardId: number;
  type: string;
  name: string;
  tag: string[];
  url: ProfileImage[];
}

// Mission Types
export interface MissionDetail {
  id: number;
  workspaceId: number;
  type: string;
  name: string;
  languageId: number;
  description: string;
  instruction: string;
  createdOn: number;
  questions: Question[];
  status: number;
  report: Report;
  iconUrl: ProfileImage;
  tags: string[];
  typeSpecificInfo: any[];
  documents: any[];
  rewards: MissionReward[];
}

export interface Question {
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
  position: any;
  style: any;
  inputDimensions: any;
  characterLimit?: number;
  lastUpdate: number;
  userAnswer: string;
  status: number;
  correctAnswer: any;
  options?: QuestionOption[];
  allowMultipleSelection?: boolean;
  imageOptions?: ImageOption[];
  maxRating?: number;
  matchingtems?: MatchingItem[];
}

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface ImageOption {
  id: string;
  altText: string;
  caption: string;
  imageUrl: string;
  isCorrect: boolean;
}

export interface MatchingItem {
  id: string;
  altText: string;
  caption: string;
  imageUrl: string;
}

export interface Report {
  email: string;
  reportTypeId: number;
}

export interface MissionReward {
  id: number;
  type: string;
}

// Mission Answer Types
export interface MissionAnswerRequest {
  questionId: number;
  answer: string;
}

export interface MissionAnswerResponse {
  note: string;
  isCorrectAnswer: boolean;
} 