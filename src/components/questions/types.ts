export interface Option {
  id: string;
  text: string;
  isCorrect?: boolean;
  matchPosition?: number;
}

export interface ImageOption {
  id: string;
  imageUrl: string;
  altText: string;
  caption: string;
  isCorrect?: boolean;
}

export interface MatchingItem {
  id: string;
  imageUrl: string;
  altText: string;
  caption: string;
  matchPosition?: number; // Make optional to match your original structure
}

export interface BaseQuestionProps {
  questionId: number;
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
  isAnsweredCorrectly: boolean;
  isSubmitting: boolean;
}