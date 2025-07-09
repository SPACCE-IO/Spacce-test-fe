const questions = [
  {
    questionType: "S",
    questionDesc: "Short Answer",
    fullDescription: "Short Answer allows users to provide brief responses to questions or prompts. This is often used in surveys, assessments, or feedback forms where users need to give concise answers, such as a single word, phrase, or sentence."
  },
  {
    questionType: "L",
    questionDesc: "Long Answer",
    fullDescription: "Long Answer allows users to provide detailed responses to questions or prompts. This is often used in surveys, assessments, or feedback forms where users need to elaborate on their thoughts, experiences, or opinions."
  },
  {
    questionType: "M",
    questionDesc: "Multiple Choice",
    fullDescription: "Multiple Choice allows users to select one or more answers from a list of options. This is often used in quizzes, surveys, or assessments where users need to choose the correct answer(s) from a set of predefined choices."
  },
  {
    questionType: "P",
    questionDesc: "Image Choice",
    fullDescription: "Image Choice allows users to select an answer from a set of images. This is often used in quizzes or surveys where visual representation is important, such as selecting a product image, identifying a landmark, or choosing a design option. this is like multiple choice but with images instead of text options."
  },
  {
    questionType: "W",
    questionDesc: "Sorting",
    fullDescription: "Sorting allows users to arrange items in a specific order, such as ascending or descending. This is often used for tasks like organizing lists, prioritizing items, or categorizing information based on certain criteria."
  },
  {
    questionType: "R",
    questionDesc: "Star Rating",
    fullDescription: "Star Rating allows users to rate something on a scale, typically from 1 to 5 stars. This is often used for feedback on products, services, or experiences. Users select the number of stars they feel represents their opinion, with more stars indicating a higher level of satisfaction."
  },
  {
    questionType: "N",
    questionDesc: "Number Rating",
    fullDescription: "Number Rating allows users to provide a numerical score or rating for something, typically on a scale (e.g., 1 to 10). This is often used for feedback on products, services, or experiences, where users can express their opinion using a specific number."
  },
  {
    questionType: "U",
    questionDesc: "User Search",
    fullDescription: "User Search allows users to search for and select other users from a list or database. User will be able to search for users by name, email, or other identifiers."
  },
];

const question = {
  // Basic Properties
  questionTypeId: "",
  description: "",
  question: "",
  hint: "",
  sequence: 1,
  
  // Mission Type
  missionType: "", // "quiz" | "survey" | "assessment" | "poster"
  
  // Answer Configuration
  hasCorrectAnswer: false, // true for quiz/assessment, false for survey/poster
  correctAnswer: null, // Only populated when hasCorrectAnswer is true
  userAnswer: "", // User's actual response
  
  // Poster-specific properties (only used when missionType is "poster")
  position: null, // { x: number, y: number } - only for poster missions
  inputDimensions: null, // { width: number, height: number } - only for poster missions
  style: null, // styling object - only for poster missions
  
  // Question Type Specific Properties
  
  // For Short Answer (S) and Long Answer (L) - Used in all mission types including poster
  characterLimit: 100,
  placeholder: "",
  
  // For Multiple Choice (M) - Not used in poster missions
  options: [],
  allowMultipleSelection: false,
  
  // For Image Choice (P) - Not used in poster missions
  imageOptions: [], // Each item: { id, imageUrl, altText, caption, isCorrect }
  
  // For Sorting (W) - Not used in poster missions
  sortingItems: [], // Each item: { id, text, correctOrder }
  
  // For Number Rating (N) and For Star Rating (R) - Not used in poster missions
  minRating: 1,
  maxRating: 10,
  
  // For User Search (U) - Not used in poster missions
  userSearchConfig: {
    searchBy: ["name", "email"],
    allowMultipleUsers: false,
  },
  
  // Validation and Scoring
  isRequired: true,
  points: 0, // Points awarded for correct answer (0 for open-ended)
  posterStyle:{
      color: "#000000",
      fontSize: "16px",
      fontWeight: "normal",
      fontFamily: "Arial, sans-serif",
      backgroundColor: "#ffffff",
      borderColor: "#cccccc",
      borderWidth: "1px",
      borderRadius: "4px",
      padding: "8px",
      margin: "4px",
      textAlign: "left",
      opacity: 1,
    }
};

const missions = [
  {
    missionType: "ORACLE_MISSION",
    missionDesc: "Oracle Mission",
  },
  {
    missionType: "STANDARD_MISSION",
    missionDesc: "Standard Mission",
  },
  {
    missionType: "PDF_MISSION",
    missionDesc: "PDF Mission",
  },
  {
    missionType: "APPRECIATION_MISSION",
    missionDesc: "Appreciation Mission",
  },
  {
    missionType: "VIDEO_MISSION",
    missionDesc: "Video Mission",
  },
  {
    id: 6,
    missionType: "ANONYMOUS_MISSION",
    missionDesc: "Anonymous Mission",
  },
  {
    id: 7,
    missionType: "POSTER_MISSION",
    missionDesc: "Poster Mission",
  },
];

// Sample questions showing open-ended vs correct answer handling

const sampleQuestions = [
  // OPEN-ENDED QUESTIONS (Survey/Poster missions)
  
  // Short Answer (S) - Open-ended
  {
    questionTypeId: "S",
    description: "Basic information gathering",
    question: "What is your favorite color?",
    hint: "Enter a single word or short phrase",
    sequence: 1,
    hasCorrectAnswer: false, // Open-ended
    correctAnswer: null,
    userAnswer: "",
    isRequired: true,
    characterLimit: 50,
    placeholder: "e.g., Blue, Red, Green",
  },

  // Long Answer (L) - Open-ended
  {
    questionTypeId: "L",
    description: "Detailed feedback collection",
    question: "Describe your experience with our customer service team.",
    hint: "Please provide detailed feedback about your interaction",
    sequence: 2,
    missionType: "survey",
    hasCorrectAnswer: false, // Open-ended
    correctAnswer: null,
    userAnswer: "",
    isRequired: true,
    points: 0,
    characterLimit: 500,
    placeholder: "Share your detailed thoughts and experiences...",
  },

  // QUESTIONS WITH CORRECT ANSWERS (Quiz/Assessment missions)
  
  // Multiple Choice (M) - Has correct answer
  {
    questionTypeId: "M",
    description: "Knowledge assessment",
    question: "Which of the following are programming languages?",
    hint: "Select all that apply",
    sequence: 3,
    hasCorrectAnswer: true, // Has definitive correct answers
    correctAnswer: ["1", "2", "4"], // IDs of correct options
    userAnswer: "",
    isRequired: true,
    options: [
      { id: "1", text: "JavaScript", isCorrect: true },
      { id: "2", text: "Python", isCorrect: true },
      { id: "3", text: "HTML", isCorrect: false },
      { id: "4", text: "Java", isCorrect: true },
      { id: "5", text: "CSS", isCorrect: false }
    ],
    allowMultipleSelection: true,
  },

  // Image Choice (P) - Has correct answer
  {
    questionTypeId: "P",
    description: "Visual identification",
    question: "Which of these animals is a mammal?",
    hint: "Look carefully at each image and select the correct answer",
    sequence: 4,
    hasCorrectAnswer: true, // Has correct answer
    correctAnswer: ["1"], // ID of correct image option
    userAnswer: "",
    isRequired: true,
    imageOptions: [
      { id: "1", imageUrl: "/images/cat.jpg", altText: "Cat", caption: "Cat", isCorrect: true },
      { id: "2", imageUrl: "/images/fish.jpg", altText: "Fish", caption: "Fish", isCorrect: false },
      { id: "3", imageUrl: "/images/bird.jpg", altText: "Bird", caption: "Bird", isCorrect: false },
      { id: "4", imageUrl: "/images/snake.jpg", altText: "Snake", caption: "Snake", isCorrect: false }
    ],
  },

  // Sorting (W) - Has correct answer
  {
    questionTypeId: "W",
    description: "Sequence arrangement",
    question: "Arrange these steps in the correct order for making coffee:",
    hint: "Drag and drop the items to sort them in the correct sequence",
    sequence: 5,
    hasCorrectAnswer: true, // Has correct order
    correctAnswer: ["2", "4", "5", "3", "1"], // Correct order by item IDs
    userAnswer: "",
    isRequired: true,
    sortingItems: [
      { id: "1", text: "Serve coffee", correctOrder: 5 },
      { id: "2", text: "Grind coffee beans", correctOrder: 1 },
      { id: "3", text: "Pour hot water", correctOrder: 4 },
      { id: "4", text: "Boil water", correctOrder: 2 },
      { id: "5", text: "Add coffee to filter", correctOrder: 3 }
    ],
  },

  // RATING QUESTIONS (Can be either open-ended or with targets)
  
  // Star Rating (R) - Open-ended feedback
  {
    questionTypeId: "R",
    description: "Service satisfaction",
    question: "How would you rate your overall experience with our service?",
    hint: "Click on the stars to give your rating (1 = Poor, 5 = Excellent)",
    sequence: 6,
    hasCorrectAnswer: false, // Opinion-based, no correct answer
    correctAnswer: null,
    userAnswer: "",
    isRequired: true,
    maxRating: 5,
  },

  // Number Rating (N) - Open-ended feedback
  {
    questionTypeId: "N",
    description: "Likelihood assessment",
    question: "On a scale of 1 to 10, how likely are you to recommend our product to a friend?",
    hint: "1 = Not at all likely, 10 = Extremely likely",
    sequence: 7,
    hasCorrectAnswer: false, // Opinion-based, no correct answer
    correctAnswer: null,
    userAnswer: "",
    isRequired: true,
    minRating: 1,
    maxRating: 10,
  },

  // User Search (U) - Has correct answer (for assessments)
  {
    questionTypeId: "U",
    description: "Team member selection",
    question: "Who is the current CEO of the company?",
    hint: "Search and select the correct user",
    sequence: 8,
    hasCorrectAnswer: true, // Has a specific correct person
    correctAnswer: "ceo@company.com", // Email or ID of correct user
    userAnswer: "",
    isRequired: true,
    userSearchConfig: {
      searchBy: ["name", "email"],
      allowMultipleUsers: false,
    },
  },

  // POSTER MISSION EXAMPLES (Always open-ended)
  {
    questionTypeId: "S",
    description: "Poster feedback - short",
    question: "What's your main takeaway from this poster?",
    hint: "One key insight or message",
    sequence: 1,
    position: { x: 100, y: 200 },
    hasCorrectAnswer: false, // Poster questions are always open-ended
    correctAnswer: null,
    userAnswer: "",
    isRequired: false,
    style: {
      color: "#2c3e50",
      fontSize: "18px",
      fontWeight: "bold",
      fontFamily: "Helvetica, sans-serif",
      backgroundColor: "rgba(255,255,255,0.9)",
      borderColor: "#3498db",
      borderWidth: "2px",
      borderRadius: "8px",
      padding: "12px",
      margin: "8px",
      textAlign: "center",
      opacity: 0.95,
    },
    inputDimensions: { width: 250, height: 35 },
    characterLimit: 100,
    placeholder: "Your key insight...",
  },

  {
    questionTypeId: "L",
    description: "Poster reflection - long",
    question: "How does this poster relate to your personal experience?",
    hint: "Share your thoughts and personal connections",
    sequence: 2,
    position: { x: 150, y: 400 },
    missionType: "poster",
    hasCorrectAnswer: false, // Poster questions are always open-ended
    correctAnswer: null,
    userAnswer: "",
    isRequired: false,
    style: {
      color: "#2c3e50",
      fontSize: "16px",
      fontWeight: "normal",
      fontFamily: "Georgia, serif",
      backgroundColor: "rgba(248,249,250,0.95)",
      borderColor: "#6c757d",
      borderWidth: "1px",
      borderRadius: "6px",
      padding: "15px",
      margin: "10px",
      textAlign: "left",
      opacity: 0.9,
    },
    inputDimensions: { width: 300, height: 100 },
    characterLimit: 300,
    placeholder: "Reflect on your experience...",
  }
];

export { sampleQuestions };