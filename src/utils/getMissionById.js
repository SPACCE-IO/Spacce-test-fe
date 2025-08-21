const currentResponse = {
  id: 2,
  workspaceId: 1,
  type: "STANDARD_MISSION",
  name: "Global test 3mission Certification",
  languageId: 1,
  description: "Test Mission for test",
  instruction: "Go Steps Mention Like Stage1 , Stage 2 Stage 311",
  createdOn: 1753274114354,
  questions: [
    {
      id: 3,
      questionTypeId: 1,
      typeCode: "S",
      description: "Short answer question for basic information",
      hint: "Enter a single word or short phrase",
      question: "What is your favorite cloud service provider?",
      sequence: 1,
      hasCorrectAnswer: false,
      isRequired: true,
      points: 0,
      placeholder: "e.g., AWS, Azure, Google Cloud",
      position: { x: 1, y: 2 },
      style: {
        color: #000,
        fontSize: 10px,
        fontWeight: 500,
        fontFamily: inter,
        backgroundColor: #fff,
        borderColor: #000,
        borderWidth: 1px,
        borderRadius: 0px,
        padding: 0px,
        margin: 0px,
        textAlign: left,
      },
      inputDimensions: { width: 10, height: 10 },
      characterLimit: 100,
      lastUpdate: 1753299798538,
      userAnswer: "",
      status: 0,
      correctAnswer: null,
    },
    {
      id: 4,
      questionTypeId: 3,
      typeCode: "M",
      description: "Multiple choice question about cloud technologies",
      hint: "Select all that apply",
      question: "Which of the following are cloud service models?",
      sequence: 2,
      hasCorrectAnswer: true,
      isRequired: true,
      points: 0,
      placeholder: "",
      position: null,
      style: null,
      inputDimensions: null,
      options: [
        {
          id: "1",
          text: "Infrastructure as a Service (IaaS)",
          isCorrect: true,
        },
        {
          id: "2",
          text: "Platform as a Service (PaaS)",
          isCorrect: true,
        },
        {
          id: "3",
          text: "Software as a Service (SaaS)",
          isCorrect: true,
        },
        {
          id: "4",
          text: "Hardware as a Service (HaaS)",
          isCorrect: false,
        },
      ],
      allowMultipleSelection: true,
      lastUpdate: 1753299894381,
      userAnswer: '{"1","2","3"}',
      status: 0,
      correctAnswer: null,
    },
    {
      id: 5,
      questionTypeId: 4,
      typeCode: "P",
      description: "Image identification question",
      hint: "Look at each image carefully",
      question: "Which logo represents Amazon Web Services?",
      sequence: 3,
      hasCorrectAnswer: true,
      isRequired: true,
      points: 0,
      placeholder: "",
      position: null,
      style: null,
      inputDimensions: null,
      imageOptions: [
        {
          id: "1",
          altText: "AWS Logo",
          caption: "AWS",
          imageUrl: "/images/aws-logo.jpg",
          isCorrect: true,
        },
        {
          id: "2",
          altText: "Azure Logo",
          caption: "Azure",
          imageUrl: "/images/azure-logo.jpg",
          isCorrect: false,
        },
        {
          id: "3",
          altText: "GCP Logo",
          caption: "Google Cloud",
          imageUrl: "/images/gcp-logo.jpg",
          isCorrect: false,
        },
        {
          id: "4",
          altText: "IBM Logo",
          caption: "IBM Cloud",
          imageUrl: "/images/ibm-logo.jpg",
          isCorrect: false,
        },
      ],
      lastUpdate: 1753299798541,
      userAnswer: "",
      status: 0,
      correctAnswer: null,
    },
    {
      id: 6,
      questionTypeId: 6,
      typeCode: "R",
      description: "Rating question for service satisfaction",
      hint: "Click on the stars to give your rating (1 = Poor, 5 = Excellent)",
      question: "How would you rate your experience with cloud services?",
      sequence: 4,
      hasCorrectAnswer: false,
      isRequired: true,
      points: 0,
      placeholder: "",
      position: null,
      style: null,
      inputDimensions: null,
      maxRating: 5,
      lastUpdate: 1753299798542,
      userAnswer: "",
      status: 0,
      correctAnswer: null,
    },
    {
      id: 7,
      questionTypeId: 2,
      typeCode: "L",
      description: "Long answer question for detailed feedback",
      hint: "Please provide detailed information about challenges, benefits, and lessons learned",
      question:
        "Describe your experience with cloud migration in your organization.",
      sequence: 5,
      hasCorrectAnswer: false,
      isRequired: true,
      points: 0,
      placeholder:
        "Share your detailed thoughts and experiences with cloud migration...",
      position: null,
      style: null,
      inputDimensions: null,
      characterLimit: 500,
      lastUpdate: 1753299798542,
      userAnswer: "",
      status: 0,
      correctAnswer: null,
    },
    {
      id: 8,
      questionTypeId: 5,
      typeCode: "W",
      description: "Matching question for cloud deployment steps",
      hint: "Drag and drop to match the steps with their sequence",
      question: "Match the cloud deployment steps with their correct order:",
      sequence: 6,
      hasCorrectAnswer: true,
      isRequired: true,
      points: 0,
      placeholder: "",
      position: null,
      style: null,
      inputDimensions: null,
      options: [
        {
          id: "A",
          text: "First Step",
        },
        {
          id: "B",
          text: "Second Step",
        },
        {
          id: "C",
          text: "Third Step",
        },
        {
          id: "D",
          text: "Fourth Step",
        },
      ],
      matchingtems: [
        {
          id: "1",
          altText: "Planning",
          caption: "Planning Phase",
          imageUrl: "/images/planning.jpg",
        },
        {
          id: "2",
          altText: "Setup",
          caption: "Environment Setup",
          imageUrl: "/images/setup.jpg",
        },
        {
          id: "3",
          altText: "Migration",
          caption: "Data Migration",
          imageUrl: "/images/migration.jpg",
        },
        {
          id: "4",
          altText: "Testing",
          caption: "Testing & Validation",
          imageUrl: "/images/testing.jpg",
        },
      ],
      lastUpdate: 1753299798543,
      userAnswer: "",
      status: 0,
      correctAnswer: null,
    },
    {
      id: 9,
      questionTypeId: 8,
      typeCode: "T",
      description: "Number rating for recommendation likelihood",
      hint: "1 = Not at all likely, 10 = Extremely likely",
      question:
        "On a scale of 1 to 10, how likely are you to recommend cloud services to others?",
      sequence: 7,
      hasCorrectAnswer: false,
      isRequired: true,
      points: 0,
      placeholder: "",
      position: null,
      style: null,
      inputDimensions: null,
      maxRating: 10,
      lastUpdate: 1753299798543,
      userAnswer: "",
      status: 0,
      correctAnswer: null,
    },
    {
      id: 10,
      questionTypeId: 7,
      typeCode: "U",
      description: "User search for team member selection",
      hint: "Search and select the correct team member",
      question: "Who is the lead cloud architect in your team?",
      sequence: 8,
      hasCorrectAnswer: true,
      isRequired: true,
      points: 0,
      placeholder: "",
      position: null,
      style: null,
      inputDimensions: null,
      lastUpdate: 1753300122227,
      userAnswer: "cloudarchitect@company.com",
      status: 1,
      correctAnswer: null,
    },
  ],
  status: 1,
  iconUrl: {
    fileName: "file_example_JPG_100kB.jpg",
    contentType: "image/jpeg",
    url: "https://spacce-dev-store.s3.eu-west-1.amazonaws.com/test/workspace/1/mission/2/file_example_JPG_100kB.jpg",
  },
  report: {
    email: "standardmission411@dummy.com",
    reportTypeId: 2,
  },
  tags: ["Cloud Introduction1", "Type Of Cloud1", "Virtual Machine1"],
  typeSpecificInfo: [
    {
      name: "TYPEINFO_0",
      value: "AWS INFO SPECIFIC",
    },
    {
      name: "TYPEINFO_1",
      value: "SM SPECIFIC INFO VALUE 22141",
    },
  ],
  documents: [
    {
      name: "Cloud Tech Introduction",
      url: {
        fileName: "file_example_JPG_100kB.jpg",
        contentType: "image/jpeg",
        url: "https://spacce-dev-store.s3.eu-west-1.amazonaws.com/test/workspace/1/mission/2/file_example_JPG_100kB.jpg",
      },
    },
    {
      name: "AWS Technology",
      url: {
        fileName: "file_example_JPG_100kB.jpg",
        contentType: "image/jpeg",
        url: "https://spacce-dev-store.s3.eu-west-1.amazonaws.com/test/workspace/1/mission/2/file_example_JPG_100kB.jpg",
      },
    },
  ],
  rewards: [],
};


[

        {

            "id": 1,

            "questionTypeId": 1,

            "typeCode": "S",

            "description": "Short answer question for basic information",

            "hint": "Enter a single word or short phrase",

            "question": "What is your favorite cloud service provider?",

            "sequence": 1,

            "hasCorrectAnswer": false,

            "isRequired": true,

            "points": 0,

            "placeholder": "e.g., AWS, Azure, Google Cloud",

      position: { x: 1, y: 2 },
      style: {
        color: #000,
        fontSize: 10,
        fontWeight: 500,
        fontFamily: inter,
        backgroundColor: #fff,
        borderColor: #000,
        borderWidth: 1,
        borderRadius: 0,
        padding: 0,
        margin: 0,
        textAlign: left,
      },
      inputDimensions: { width: 10, height: 10 },
      characterLimit: 100,

            "lastUpdate": 1754638794883,

            "userAnswer": "{}",

            "status": 1,

            "correctAnswer": null

        },

        {

            "id": 2,

            "questionTypeId": 2,

            "typeCode": "L",

            "description": "Long answer question for detailed feedback",

            "hint": "Please provide detailed information about challenges, benefits, and lessons learned",

            "question": "Describe your experience with cloud migration in your organization.",

            "sequence": 5,

            "hasCorrectAnswer": false,

            "isRequired": true,

            "points": 0,

            "placeholder": "Share your detailed thoughts and experiences with cloud migration...",

                  position: { x: 1, y: 2 },
      style: {
        color: #000,
        fontSize: 10,
        fontWeight: 500,
        fontFamily: inter,
        backgroundColor: #fff,
        borderColor: #000,
        borderWidth: 1,
        borderRadius: 0,
        padding: 0,
        margin: 0,
        textAlign: left,
      },
      inputDimensions: { width: 10, height: 10 },
      characterLimit: 100,

            "lastUpdate": 1754638979862,

            "userAnswer": "{}",

            "status": 1,

            "correctAnswer": null

        },

        {

            "id": 3,

            "questionTypeId": 7,

            "typeCode": "U",

            "description": "User search for team member selection",

            "hint": "Search and select the correct team member",

            "question": "Who is the lead cloud architect in your team?",

            "sequence": 8,

            "hasCorrectAnswer": true,

            "isRequired": true,

            "points": 0,

            "placeholder": "",
      position: { x: 10, y: 20 },
      style: {
        color: #000,
        fontSize: 10,
        fontWeight: 500,
        fontFamily: inter,
        backgroundColor: #fff,
        borderColor: #000,
        borderWidth: 1,
        borderRadius: 0,
        padding: 0,
        margin: 0,
        textAlign: left,
      },
      inputDimensions: { width: 10, height: 10 },
      characterLimit: 100,

            "lastUpdate": 1755114303900,

            "userAnswer": "cloudarchitect@company.com",

            "status": 1,

            "correctAnswer": null

        }

    ]