const standard = {
  "description": "Test Mission for",
  "documents": [
  ],
  "missionType": "STANDARD_MISSION",
  "iconUrl": "man_7185909.png",
  "instruction": "Go Steps Mention Like Stage1 , Stage 2 Stage 311",
  "missionName": "Certification 8",
  "tags": [
    "Cloud Introduction1",
    "Type Of Cloud1",
    "Virtual Machine1"
  ],
  "questions": [
    {
      "questionTypeId": 1,
      "description": "Short answer question for basic information",
      "question": "What is your favorite cloud service provider?",
      "hint": "Enter a single word or short phrase",
      "sequence": 1,
      "hasCorrectAnswer": false,
      "correctAnswer": null,
      "userAnswer": "",
      "isRequired": true,
      "characterLimit": 50,
      "placeholder": "e.g., AWS, Azure, Google Cloud"
    },
    {
      "questionTypeId": 3,
      "description": "Multiple choice question about cloud technologies",
      "question": "Which of the following are cloud service models?",
      "hint": "Select all that apply",
      "sequence": 2,
      "hasCorrectAnswer": true,
      "correctAnswer": ["1", "2", "3"],
      "userAnswer": "",
      "isRequired": true,
      "options": [
        { "id": "1", "text": "Infrastructure as a Service (IaaS)", "isCorrect": true },
        { "id": "2", "text": "Platform as a Service (PaaS)", "isCorrect": true },
        { "id": "3", "text": "Software as a Service (SaaS)", "isCorrect": true },
        { "id": "4", "text": "Hardware as a Service (HaaS)", "isCorrect": false }
      ],
      "allowMultipleSelection": true
    },
    {
      "questionTypeId": 4,
      "description": "Image identification question",
      "question": "Which logo represents Amazon Web Services?",
      "hint": "Look at each image carefully",
      "sequence": 3,
      "hasCorrectAnswer": true,
      "correctAnswer": ["1"],
      "userAnswer": "",
      "isRequired": true,
      "imageOptions": [
        { "id": "1", "imageUrl": "/images/aws-logo.jpg", "altText": "AWS Logo", "caption": "AWS", "isCorrect": true },
        { "id": "2", "imageUrl": "/images/azure-logo.jpg", "altText": "Azure Logo", "caption": "Azure", "isCorrect": false },
        { "id": "3", "imageUrl": "/images/gcp-logo.jpg", "altText": "GCP Logo", "caption": "Google Cloud", "isCorrect": false },
        { "id": "4", "imageUrl": "/images/ibm-logo.jpg", "altText": "IBM Logo", "caption": "IBM Cloud", "isCorrect": false }
      ]
    },
    {
      "questionTypeId": 6,
      "description": "Rating question for service satisfaction",
      "question": "How would you rate your experience with cloud services?",
      "hint": "Click on the stars to give your rating (1 = Poor, 5 = Excellent)",
      "sequence": 4,
      "hasCorrectAnswer": false,
      "correctAnswer": null,
      "userAnswer": "",
      "isRequired": true,
      "maxRating": 5
    },
    {
      "questionTypeId": 2,
      "description": "Long answer question for detailed feedback",
      "question": "Describe your experience with cloud migration in your organization.",
      "hint": "Please provide detailed information about challenges, benefits, and lessons learned",
      "sequence": 5,
      "hasCorrectAnswer": false,
      "correctAnswer": null,
      "userAnswer": "",
      "isRequired": false,
      "characterLimit": 500,
      "placeholder": "Share your detailed thoughts and experiences with cloud migration..."
    },
    {
      "questionTypeId": 5,
      "description": "Matching question for cloud deployment steps",
      "question": "Match the cloud deployment steps with their correct order:",
      "hint": "Drag and drop to match the steps with their sequence",
      "sequence": 6,
      "hasCorrectAnswer": true,
      "correctAnswer": ["1-A", "2-B", "3-C", "4-D"],
      "userAnswer": "",
      "isRequired": true,
      "matchingtems": [
        { "id": "1", "imageUrl": "/images/planning.jpg", "altText": "Planning", "caption": "Planning Phase" },
        { "id": "2", "imageUrl": "/images/setup.jpg", "altText": "Setup", "caption": "Environment Setup" },
        { "id": "3", "imageUrl": "/images/migration.jpg", "altText": "Migration", "caption": "Data Migration" },
        { "id": "4", "imageUrl": "/images/testing.jpg", "altText": "Testing", "caption": "Testing & Validation" }
      ],
      "options": [
        { "id": "A", "text": "First Step" },
        { "id": "B", "text": "Second Step" },
        { "id": "C", "text": "Third Step" },
        { "id": "D", "text": "Fourth Step" }
      ]
    },
    {
      "questionTypeId": 8,
      "description": "Number rating for recommendation likelihood",
      "question": "On a scale of 1 to 10, how likely are you to recommend cloud services to others?",
      "hint": "1 = Not at all likely, 10 = Extremely likely",
      "sequence": 7,
      "hasCorrectAnswer": false,
      "correctAnswer": null,
      "userAnswer": "",
      "isRequired": true,
      "minRating": 1,
      "maxRating": 10
    },
    {
      "questionTypeId": 7,
      "description": "User search for team member selection",
      "question": "Who is the lead cloud architect in your team?",
      "hint": "Search and select the correct team member",
      "sequence": 8,
      "hasCorrectAnswer": true,
      "correctAnswer": "cloudarchitect@company.com",
      "userAnswer": "",
      "isRequired": true,
      "userSearchConfig": {
        "searchBy": ["name", "email", "role"],
        "allowMultipleUsers": false
      }
    }
  ],
  "report": {
    "email": "standardmission411@dummy.com",
    "reportTypeId": 2
  },
  "typeSpecificInfo": [],
  "workspaceId": 1,
  "rewards": [
    {
      "sequence": 1,
      "type": "B",
      "name": "reward",
      "tags": [
        "one"
      ],
      "pointsText": "0",
      "files": [
        {
          "fileName": "pdfDone.svg"
        }
      ]
    }
  ]
}
const pdf = {
  "description": "Test Mission for",
  "documents": [
    {
      "fileName": "file-sample_150kB.pdf",
      "name": "MISSION_PDF"
    }
  ],
  "missionType": "PDF_MISSION",
  "iconUrl": "man_7185909.png",
  "instruction": "Go Steps Mention Like Stage1 , Stage 2 Stage 311",
  "missionName": "Certification 7",
  "tags": [
    "Cloud Introduction1",
    "Type Of Cloud1",
    "Virtual Machine1"
  ],
  "questions": [
    {
      "questionTypeId": 1,
      "description": "Short answer question for basic information",
      "question": "What is your favorite cloud service provider?",
      "hint": "Enter a single word or short phrase",
      "sequence": 1,
      "hasCorrectAnswer": false,
      "correctAnswer": null,
      "userAnswer": "",
      "isRequired": true,
      "characterLimit": 50,
      "placeholder": "e.g., AWS, Azure, Google Cloud"
    },
    {
      "questionTypeId": 3,
      "description": "Multiple choice question about cloud technologies",
      "question": "Which of the following are cloud service models?",
      "hint": "Select all that apply",
      "sequence": 2,
      "hasCorrectAnswer": true,
      "correctAnswer": ["1", "2", "3"],
      "userAnswer": "",
      "isRequired": true,
      "options": [
        { "id": "1", "text": "Infrastructure as a Service (IaaS)", "isCorrect": true },
        { "id": "2", "text": "Platform as a Service (PaaS)", "isCorrect": true },
        { "id": "3", "text": "Software as a Service (SaaS)", "isCorrect": true },
        { "id": "4", "text": "Hardware as a Service (HaaS)", "isCorrect": false }
      ],
      "allowMultipleSelection": true
    },
    {
      "questionTypeId": 4,
      "description": "Image identification question",
      "question": "Which logo represents Amazon Web Services?",
      "hint": "Look at each image carefully",
      "sequence": 3,
      "hasCorrectAnswer": true,
      "correctAnswer": ["1"],
      "userAnswer": "",
      "isRequired": true,
      "imageOptions": [
        { "id": "1", "imageUrl": "/images/aws-logo.jpg", "altText": "AWS Logo", "caption": "AWS", "isCorrect": true },
        { "id": "2", "imageUrl": "/images/azure-logo.jpg", "altText": "Azure Logo", "caption": "Azure", "isCorrect": false },
        { "id": "3", "imageUrl": "/images/gcp-logo.jpg", "altText": "GCP Logo", "caption": "Google Cloud", "isCorrect": false },
        { "id": "4", "imageUrl": "/images/ibm-logo.jpg", "altText": "IBM Logo", "caption": "IBM Cloud", "isCorrect": false }
      ]
    },
    {
      "questionTypeId": 6,
      "description": "Rating question for service satisfaction",
      "question": "How would you rate your experience with cloud services?",
      "hint": "Click on the stars to give your rating (1 = Poor, 5 = Excellent)",
      "sequence": 4,
      "hasCorrectAnswer": false,
      "correctAnswer": null,
      "userAnswer": "",
      "isRequired": true,
      "maxRating": 5
    },
    {
      "questionTypeId": 2,
      "description": "Long answer question for detailed feedback",
      "question": "Describe your experience with cloud migration in your organization.",
      "hint": "Please provide detailed information about challenges, benefits, and lessons learned",
      "sequence": 5,
      "hasCorrectAnswer": false,
      "correctAnswer": null,
      "userAnswer": "",
      "isRequired": false,
      "characterLimit": 500,
      "placeholder": "Share your detailed thoughts and experiences with cloud migration..."
    },
    {
      "questionTypeId": 5,
      "description": "Matching question for cloud deployment steps",
      "question": "Match the cloud deployment steps with their correct order:",
      "hint": "Drag and drop to match the steps with their sequence",
      "sequence": 6,
      "hasCorrectAnswer": true,
      "correctAnswer": ["1-A", "2-B", "3-C", "4-D"],
      "userAnswer": "",
      "isRequired": true,
      "matchingtems": [
        { "id": "1", "imageUrl": "/images/planning.jpg", "altText": "Planning", "caption": "Planning Phase" },
        { "id": "2", "imageUrl": "/images/setup.jpg", "altText": "Setup", "caption": "Environment Setup" },
        { "id": "3", "imageUrl": "/images/migration.jpg", "altText": "Migration", "caption": "Data Migration" },
        { "id": "4", "imageUrl": "/images/testing.jpg", "altText": "Testing", "caption": "Testing & Validation" }
      ],
      "options": [
        { "id": "A", "text": "First Step" },
        { "id": "B", "text": "Second Step" },
        { "id": "C", "text": "Third Step" },
        { "id": "D", "text": "Fourth Step" }
      ]
    },
    {
      "questionTypeId": 8,
      "description": "Number rating for recommendation likelihood",
      "question": "On a scale of 1 to 10, how likely are you to recommend cloud services to others?",
      "hint": "1 = Not at all likely, 10 = Extremely likely",
      "sequence": 7,
      "hasCorrectAnswer": false,
      "correctAnswer": null,
      "userAnswer": "",
      "isRequired": true,
      "minRating": 1,
      "maxRating": 10
    },
    {
      "questionTypeId": 7,
      "description": "User search for team member selection",
      "question": "Who is the lead cloud architect in your team?",
      "hint": "Search and select the correct team member",
      "sequence": 8,
      "hasCorrectAnswer": true,
      "correctAnswer": "cloudarchitect@company.com",
      "userAnswer": "",
      "isRequired": true,
      "userSearchConfig": {
        "searchBy": ["name", "email", "role"],
        "allowMultipleUsers": false
      }
    }
  ],
  "report": {
    "email": "standardmission411@dummy.com",
    "reportTypeId": 2
  },
  "typeSpecificInfo": [],
  "workspaceId": 1,
  "rewards": [
    {
      "sequence": 1,
      "type": "B",
      "name": "reward",
      "tags": [
        "one"
      ],
      "pointsText": "0",
      "files": [
        {
          "fileName": "pdfDone.svg"
        }
      ]
    }
  ]
}
const video = {
  "description": "Test Mission for",
  "documents": [
    {
      "fileName": "file_example_MP4_640_3MG.mp4",
      "name": "MISSION_VIDEO"
    }
  ],
  "missionType": "VIDEO_MISSION",
  "iconUrl": "man_7185909.png",
  "instruction": "Go Steps Mention Like Stage1 , Stage 2 Stage 311",
  "missionName": "Certification 6",
  "tags": [
    "Cloud Introduction1",
    "Type Of Cloud1",
    "Virtual Machine1"
  ],
  "questions": [
    {
      "questionTypeId": 1,
      "description": "Short answer question for basic information",
      "question": "What is your favorite cloud service provider?",
      "hint": "Enter a single word or short phrase",
      "sequence": 1,
      "hasCorrectAnswer": false,
      "correctAnswer": null,
      "userAnswer": "",
      "isRequired": true,
      "characterLimit": 50,
      "placeholder": "e.g., AWS, Azure, Google Cloud"
    },
    {
      "questionTypeId": 3,
      "description": "Multiple choice question about cloud technologies",
      "question": "Which of the following are cloud service models?",
      "hint": "Select all that apply",
      "sequence": 2,
      "hasCorrectAnswer": true,
      "correctAnswer": ["1", "2", "3"],
      "userAnswer": "",
      "isRequired": true,
      "options": [
        { "id": "1", "text": "Infrastructure as a Service (IaaS)", "isCorrect": true },
        { "id": "2", "text": "Platform as a Service (PaaS)", "isCorrect": true },
        { "id": "3", "text": "Software as a Service (SaaS)", "isCorrect": true },
        { "id": "4", "text": "Hardware as a Service (HaaS)", "isCorrect": false }
      ],
      "allowMultipleSelection": true
    },
    {
      "questionTypeId": 4,
      "description": "Image identification question",
      "question": "Which logo represents Amazon Web Services?",
      "hint": "Look at each image carefully",
      "sequence": 3,
      "hasCorrectAnswer": true,
      "correctAnswer": ["1"],
      "userAnswer": "",
      "isRequired": true,
      "imageOptions": [
        { "id": "1", "imageUrl": "/images/aws-logo.jpg", "altText": "AWS Logo", "caption": "AWS", "isCorrect": true },
        { "id": "2", "imageUrl": "/images/azure-logo.jpg", "altText": "Azure Logo", "caption": "Azure", "isCorrect": false },
        { "id": "3", "imageUrl": "/images/gcp-logo.jpg", "altText": "GCP Logo", "caption": "Google Cloud", "isCorrect": false },
        { "id": "4", "imageUrl": "/images/ibm-logo.jpg", "altText": "IBM Logo", "caption": "IBM Cloud", "isCorrect": false }
      ]
    },
    {
      "questionTypeId": 6,
      "description": "Rating question for service satisfaction",
      "question": "How would you rate your experience with cloud services?",
      "hint": "Click on the stars to give your rating (1 = Poor, 5 = Excellent)",
      "sequence": 4,
      "hasCorrectAnswer": false,
      "correctAnswer": null,
      "userAnswer": "",
      "isRequired": true,
      "maxRating": 5
    },
    {
      "questionTypeId": 2,
      "description": "Long answer question for detailed feedback",
      "question": "Describe your experience with cloud migration in your organization.",
      "hint": "Please provide detailed information about challenges, benefits, and lessons learned",
      "sequence": 5,
      "hasCorrectAnswer": false,
      "correctAnswer": null,
      "userAnswer": "",
      "isRequired": false,
      "characterLimit": 500,
      "placeholder": "Share your detailed thoughts and experiences with cloud migration..."
    },
    {
      "questionTypeId": 5,
      "description": "Matching question for cloud deployment steps",
      "question": "Match the cloud deployment steps with their correct order:",
      "hint": "Drag and drop to match the steps with their sequence",
      "sequence": 6,
      "hasCorrectAnswer": true,
      "correctAnswer": ["1-A", "2-B", "3-C", "4-D"],
      "userAnswer": "",
      "isRequired": true,
      "matchingtems": [
        { "id": "1", "imageUrl": "/images/planning.jpg", "altText": "Planning", "caption": "Planning Phase" },
        { "id": "2", "imageUrl": "/images/setup.jpg", "altText": "Setup", "caption": "Environment Setup" },
        { "id": "3", "imageUrl": "/images/migration.jpg", "altText": "Migration", "caption": "Data Migration" },
        { "id": "4", "imageUrl": "/images/testing.jpg", "altText": "Testing", "caption": "Testing & Validation" }
      ],
      "options": [
        { "id": "A", "text": "First Step" },
        { "id": "B", "text": "Second Step" },
        { "id": "C", "text": "Third Step" },
        { "id": "D", "text": "Fourth Step" }
      ]
    },
    {
      "questionTypeId": 8,
      "description": "Number rating for recommendation likelihood",
      "question": "On a scale of 1 to 10, how likely are you to recommend cloud services to others?",
      "hint": "1 = Not at all likely, 10 = Extremely likely",
      "sequence": 7,
      "hasCorrectAnswer": false,
      "correctAnswer": null,
      "userAnswer": "",
      "isRequired": true,
      "minRating": 1,
      "maxRating": 10
    },
    {
      "questionTypeId": 7,
      "description": "User search for team member selection",
      "question": "Who is the lead cloud architect in your team?",
      "hint": "Search and select the correct team member",
      "sequence": 8,
      "hasCorrectAnswer": true,
      "correctAnswer": "cloudarchitect@company.com",
      "userAnswer": "",
      "isRequired": true,
      "userSearchConfig": {
        "searchBy": ["name", "email", "role"],
        "allowMultipleUsers": false
      }
    }
  ],
  "report": {
    "email": "standardmission411@dummy.com",
    "reportTypeId": 2
  },
  "typeSpecificInfo": [],
  "workspaceId": 1,
  "rewards": [
    {
      "sequence": 1,
      "type": "B",
      "name": "reward",
      "tags": [
        "one"
      ],
      "pointsText": "0",
      "files": [
        {
          "fileName": "pdfDone.svg"
        }
      ]
    }
  ]
}
const anonymous = {
  "description": "Test Mission for",
  "documents": [
  ],
  "missionType": "ANONYMOUS_MISSION",
  "iconUrl": "man_7185909.png",
  "instruction": "Go Steps Mention Like Stage1 , Stage 2 Stage 311",
  "missionName": "Certification 5",
  "tags": [
    "Cloud Introduction1",
    "Type Of Cloud1",
    "Virtual Machine1"
  ],
  "questions": [
    {
      "questionTypeId": 1,
      "description": "Short answer question for basic information",
      "question": "What is your favorite cloud service provider?",
      "hint": "Enter a single word or short phrase",
      "sequence": 1,
      "hasCorrectAnswer": false,
      "correctAnswer": null,
      "userAnswer": "",
      "isRequired": true,
      "characterLimit": 50,
      "placeholder": "e.g., AWS, Azure, Google Cloud"
    },
    {
      "questionTypeId": 3,
      "description": "Multiple choice question about cloud technologies",
      "question": "Which of the following are cloud service models?",
      "hint": "Select all that apply",
      "sequence": 2,
      "hasCorrectAnswer": true,
      "correctAnswer": ["1", "2", "3"],
      "userAnswer": "",
      "isRequired": true,
      "options": [
        { "id": "1", "text": "Infrastructure as a Service (IaaS)", "isCorrect": true },
        { "id": "2", "text": "Platform as a Service (PaaS)", "isCorrect": true },
        { "id": "3", "text": "Software as a Service (SaaS)", "isCorrect": true },
        { "id": "4", "text": "Hardware as a Service (HaaS)", "isCorrect": false }
      ],
      "allowMultipleSelection": true
    },
    {
      "questionTypeId": 4,
      "description": "Image identification question",
      "question": "Which logo represents Amazon Web Services?",
      "hint": "Look at each image carefully",
      "sequence": 3,
      "hasCorrectAnswer": true,
      "correctAnswer": ["1"],
      "userAnswer": "",
      "isRequired": true,
      "imageOptions": [
        { "id": "1", "imageUrl": "/images/aws-logo.jpg", "altText": "AWS Logo", "caption": "AWS", "isCorrect": true },
        { "id": "2", "imageUrl": "/images/azure-logo.jpg", "altText": "Azure Logo", "caption": "Azure", "isCorrect": false },
        { "id": "3", "imageUrl": "/images/gcp-logo.jpg", "altText": "GCP Logo", "caption": "Google Cloud", "isCorrect": false },
        { "id": "4", "imageUrl": "/images/ibm-logo.jpg", "altText": "IBM Logo", "caption": "IBM Cloud", "isCorrect": false }
      ]
    },
    {
      "questionTypeId": 6,
      "description": "Rating question for service satisfaction",
      "question": "How would you rate your experience with cloud services?",
      "hint": "Click on the stars to give your rating (1 = Poor, 5 = Excellent)",
      "sequence": 4,
      "hasCorrectAnswer": false,
      "correctAnswer": null,
      "userAnswer": "",
      "isRequired": true,
      "maxRating": 5
    },
    {
      "questionTypeId": 2,
      "description": "Long answer question for detailed feedback",
      "question": "Describe your experience with cloud migration in your organization.",
      "hint": "Please provide detailed information about challenges, benefits, and lessons learned",
      "sequence": 5,
      "hasCorrectAnswer": false,
      "correctAnswer": null,
      "userAnswer": "",
      "isRequired": false,
      "characterLimit": 500,
      "placeholder": "Share your detailed thoughts and experiences with cloud migration..."
    },
    {
      "questionTypeId": 5,
      "description": "Matching question for cloud deployment steps",
      "question": "Match the cloud deployment steps with their correct order:",
      "hint": "Drag and drop to match the steps with their sequence",
      "sequence": 6,
      "hasCorrectAnswer": true,
      "correctAnswer": ["1-A", "2-B", "3-C", "4-D"],
      "userAnswer": "",
      "isRequired": true,
      "matchingtems": [
        { "id": "1", "imageUrl": "/images/planning.jpg", "altText": "Planning", "caption": "Planning Phase" },
        { "id": "2", "imageUrl": "/images/setup.jpg", "altText": "Setup", "caption": "Environment Setup" },
        { "id": "3", "imageUrl": "/images/migration.jpg", "altText": "Migration", "caption": "Data Migration" },
        { "id": "4", "imageUrl": "/images/testing.jpg", "altText": "Testing", "caption": "Testing & Validation" }
      ],
      "options": [
        { "id": "A", "text": "First Step" },
        { "id": "B", "text": "Second Step" },
        { "id": "C", "text": "Third Step" },
        { "id": "D", "text": "Fourth Step" }
      ]
    },
    {
      "questionTypeId": 8,
      "description": "Number rating for recommendation likelihood",
      "question": "On a scale of 1 to 10, how likely are you to recommend cloud services to others?",
      "hint": "1 = Not at all likely, 10 = Extremely likely",
      "sequence": 7,
      "hasCorrectAnswer": false,
      "correctAnswer": null,
      "userAnswer": "",
      "isRequired": true,
      "minRating": 1,
      "maxRating": 10
    },
    {
      "questionTypeId": 7,
      "description": "User search for team member selection",
      "question": "Who is the lead cloud architect in your team?",
      "hint": "Search and select the correct team member",
      "sequence": 8,
      "hasCorrectAnswer": true,
      "correctAnswer": "cloudarchitect@company.com",
      "userAnswer": "",
      "isRequired": true,
      "userSearchConfig": {
        "searchBy": ["name", "email", "role"],
        "allowMultipleUsers": false
      }
    }
  ],
  "report": {
    "email": "standardmission411@dummy.com",
    "reportTypeId": 2
  },
  "typeSpecificInfo": [],
  "workspaceId": 1,
  "rewards": [
    {
      "sequence": 1,
      "type": "B",
      "name": "reward",
      "tags": [
        "one"
      ],
      "pointsText": "0",
      "files": [
        {
          "fileName": "pdfDone.svg"
        }
      ]
    }
  ]
}
const appreciation = {
  "description": "Test Mission for",
  "documents": [
  ],
  "missionType": "APPRECIATION_MISSION",
  "iconUrl": "man_7185909.png",
  "instruction": "Go Steps Mention Like Stage1 , Stage 2 Stage 311",
  "missionName": "Certification 4",
  "tags": [
    "Cloud Introduction1",
    "Type Of Cloud1",
    "Virtual Machine1"
  ],
  "questions": [
    {
      "questionTypeId": 1,
      "description": "Short answer question for basic information",
      "question": "What is your favorite cloud service provider?",
      "hint": "Enter a single word or short phrase",
      "sequence": 1,
      "hasCorrectAnswer": false,
      "correctAnswer": null,
      "userAnswer": "",
      "isRequired": true,
      "characterLimit": 50,
      "placeholder": "e.g., AWS, Azure, Google Cloud"
    },
    {
      "questionTypeId": 3,
      "description": "Multiple choice question about cloud technologies",
      "question": "Which of the following are cloud service models?",
      "hint": "Select all that apply",
      "sequence": 2,
      "hasCorrectAnswer": true,
      "correctAnswer": ["1", "2", "3"],
      "userAnswer": "",
      "isRequired": true,
      "options": [
        { "id": "1", "text": "Infrastructure as a Service (IaaS)", "isCorrect": true },
        { "id": "2", "text": "Platform as a Service (PaaS)", "isCorrect": true },
        { "id": "3", "text": "Software as a Service (SaaS)", "isCorrect": true },
        { "id": "4", "text": "Hardware as a Service (HaaS)", "isCorrect": false }
      ],
      "allowMultipleSelection": true
    },
    {
      "questionTypeId": 4,
      "description": "Image identification question",
      "question": "Which logo represents Amazon Web Services?",
      "hint": "Look at each image carefully",
      "sequence": 3,
      "hasCorrectAnswer": true,
      "correctAnswer": ["1"],
      "userAnswer": "",
      "isRequired": true,
      "imageOptions": [
        { "id": "1", "imageUrl": "/images/aws-logo.jpg", "altText": "AWS Logo", "caption": "AWS", "isCorrect": true },
        { "id": "2", "imageUrl": "/images/azure-logo.jpg", "altText": "Azure Logo", "caption": "Azure", "isCorrect": false },
        { "id": "3", "imageUrl": "/images/gcp-logo.jpg", "altText": "GCP Logo", "caption": "Google Cloud", "isCorrect": false },
        { "id": "4", "imageUrl": "/images/ibm-logo.jpg", "altText": "IBM Logo", "caption": "IBM Cloud", "isCorrect": false }
      ]
    },
    {
      "questionTypeId": 6,
      "description": "Rating question for service satisfaction",
      "question": "How would you rate your experience with cloud services?",
      "hint": "Click on the stars to give your rating (1 = Poor, 5 = Excellent)",
      "sequence": 4,
      "hasCorrectAnswer": false,
      "correctAnswer": null,
      "userAnswer": "",
      "isRequired": true,
      "maxRating": 5
    },
    {
      "questionTypeId": 2,
      "description": "Long answer question for detailed feedback",
      "question": "Describe your experience with cloud migration in your organization.",
      "hint": "Please provide detailed information about challenges, benefits, and lessons learned",
      "sequence": 5,
      "hasCorrectAnswer": false,
      "correctAnswer": null,
      "userAnswer": "",
      "isRequired": false,
      "characterLimit": 500,
      "placeholder": "Share your detailed thoughts and experiences with cloud migration..."
    },
    {
      "questionTypeId": 5,
      "description": "Matching question for cloud deployment steps",
      "question": "Match the cloud deployment steps with their correct order:",
      "hint": "Drag and drop to match the steps with their sequence",
      "sequence": 6,
      "hasCorrectAnswer": true,
      "correctAnswer": ["1-A", "2-B", "3-C", "4-D"],
      "userAnswer": "",
      "isRequired": true,
      "matchingtems": [
        { "id": "1", "imageUrl": "/images/planning.jpg", "altText": "Planning", "caption": "Planning Phase" },
        { "id": "2", "imageUrl": "/images/setup.jpg", "altText": "Setup", "caption": "Environment Setup" },
        { "id": "3", "imageUrl": "/images/migration.jpg", "altText": "Migration", "caption": "Data Migration" },
        { "id": "4", "imageUrl": "/images/testing.jpg", "altText": "Testing", "caption": "Testing & Validation" }
      ],
      "options": [
        { "id": "A", "text": "First Step" },
        { "id": "B", "text": "Second Step" },
        { "id": "C", "text": "Third Step" },
        { "id": "D", "text": "Fourth Step" }
      ]
    },
    {
      "questionTypeId": 8,
      "description": "Number rating for recommendation likelihood",
      "question": "On a scale of 1 to 10, how likely are you to recommend cloud services to others?",
      "hint": "1 = Not at all likely, 10 = Extremely likely",
      "sequence": 7,
      "hasCorrectAnswer": false,
      "correctAnswer": null,
      "userAnswer": "",
      "isRequired": true,
      "minRating": 1,
      "maxRating": 10
    },
    {
      "questionTypeId": 7,
      "description": "User search for team member selection",
      "question": "Who is the lead cloud architect in your team?",
      "hint": "Search and select the correct team member",
      "sequence": 8,
      "hasCorrectAnswer": true,
      "correctAnswer": "cloudarchitect@company.com",
      "userAnswer": "",
      "isRequired": true,
      "userSearchConfig": {
        "searchBy": ["name", "email", "role"],
        "allowMultipleUsers": false
      }
    }
  ],
  "report": {
    "email": "standardmission411@dummy.com",
    "reportTypeId": 2
  },
  "typeSpecificInfo": [],
  "workspaceId": 1,
  "rewards": [
    {
      "sequence": 1,
      "type": "B",
      "name": "reward",
      "tags": [
        "one"
      ],
      "pointsText": "0",
      "files": [
        {
          "fileName": "pdfDone.svg"
        }
      ]
    }
  ]
}
const poster = {
  "description": "Test Mission for",
  "documents": [
    {
      "fileName": "Get_Started_With_Smallpdf.pdf",
      "name": "MISSION_POSTER"
    }
  ],
  "missionType": "POSTER_MISSION",
  "iconUrl": "man_7185909.png",
  "instruction": "Go Steps Mention Like Stage1 , Stage 2 Stage 311",
  "missionName": "Certification 3",
  "tags": [
    "Cloud Introduction1",
    "Type Of Cloud1",
    "Virtual Machine1"
  ],
  "questions": [
    {
      "questionTypeId": 1,
      "description": "Short answer question for basic information",
      "question": "What is your favorite cloud service provider?",
      "hint": "Enter a single word or short phrase",
      "sequence": 1,
      "hasCorrectAnswer": false,
      "correctAnswer": null,
      "userAnswer": "",
      "isRequired": true,
      "characterLimit": 50,
      "placeholder": "e.g., AWS, Azure, Google Cloud"
    },
    {
      "questionTypeId": 2,
      "description": "Long answer question for detailed feedback",
      "question": "Describe your experience with cloud migration in your organization.",
      "hint": "Please provide detailed information about challenges, benefits, and lessons learned",
      "sequence": 5,
      "hasCorrectAnswer": false,
      "correctAnswer": null,
      "userAnswer": "",
      "isRequired": false,
      "characterLimit": 500,
      "placeholder": "Share your detailed thoughts and experiences with cloud migration..."
    },
    {
      "questionTypeId": 7,
      "description": "User search for team member selection",
      "question": "Who is the lead cloud architect in your team?",
      "hint": "Search and select the correct team member",
      "sequence": 8,
      "hasCorrectAnswer": true,
      "correctAnswer": "cloudarchitect@company.com",
      "userAnswer": "",
      "isRequired": true,
      "userSearchConfig": {
        "searchBy": ["name", "email", "role"],
        "allowMultipleUsers": false
      }
    }
  ],
  "report": {
    "email": "standardmission411@dummy.com",
    "reportTypeId": 2
  },
  "typeSpecificInfo": [],
  "workspaceId": 1,
  "rewards": [
    {
      "sequence": 1,
      "type": "B",
      "name": "reward",
      "tags": [
        "one"
      ],
      "pointsText": "0",
      "files": [
        {
          "fileName": "pdfDone.svg"
        }
      ]
    }
  ]
}