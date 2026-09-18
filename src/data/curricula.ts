import { LearningPath } from '../types';

export const STARTER_LEARNING_PATHS: Record<string, LearningPath> = {
  web_dev: {
    id: 'path-web-dev',
    title: 'Full-Stack Web & AI App Creator',
    overview: 'From your first HTML & JavaScript lines to building interactive, AI-enhanced web applications and dynamic interfaces.',
    targetGoal: 'Web & AI Application Development',
    estimatedTotalHours: 24,
    createdAt: new Date().toISOString(),
    milestones: [
      {
        id: 'm1',
        phase: 1,
        title: 'Milestone 1: Web Fundamentals & Interactive Logic',
        description: 'Master HTML structure, CSS styling, and JavaScript logic (variables, conditionals, event listeners).',
        lessons: [
          {
            id: 'l1-1',
            title: 'HTML & Document Structure: The Skeleton of the Web',
            estimatedMinutes: 25,
            summary: 'Understand tags, elements, attributes, semantic HTML (header, main, footer), and linking stylesheets.',
            keyConcepts: ['HTML5 Tags', 'DOM Hierarchy', 'Attributes & Classes'],
            sampleCode: `<div class="card">\n  <h2>Student Profile</h2>\n  <p>Learning code with AI</p>\n  <button onclick="sayHi()">Greet Me</button>\n</div>`,
            practicePrompt: 'Create a simple webpage with a heading, an image placeholder, and a button that alerts your favorite programming language.'
          },
          {
            id: 'l1-2',
            title: 'JavaScript Magic: Variables, Events & User Interactions',
            estimatedMinutes: 35,
            summary: 'Learn how to capture button clicks, read input fields, and dynamically update webpage text.',
            keyConcepts: ['Event Listeners', 'document.getElementById', 'DOM Text Updates'],
            sampleCode: `const btn = document.querySelector('#calc-btn');\nbtn.addEventListener('click', () => {\n  const name = document.querySelector('#name-input').value;\n  alert(\`Welcome, \${name}!\`);\n});`,
            practicePrompt: 'Connect a text input to a paragraph so that typing instantly previews the user\'s name.'
          }
        ],
        project: {
          id: 'p1',
          title: 'Project 1: Interactive Motivational Quote & Soundboard',
          difficulty: 'Beginner',
          description: 'Build a browser app that generates student motivational quotes, changes dynamic background color schemes, and keeps count of quotes viewed.',
          technologies: ['HTML5', 'CSS3 Flexbox', 'Vanilla JavaScript DOM'],
          learningOutcomes: ['DOM manipulation', 'Click events', 'Dynamic style updates', 'State tracking']
        }
      },
      {
        id: 'm2',
        phase: 2,
        title: 'Milestone 2: State, Data & Collections',
        description: 'Work with arrays, objects, JSON, and local storage to build apps that remember user data across sessions.',
        lessons: [
          {
            id: 'l2-1',
            title: 'Arrays & Objects: Storing Collections of Data',
            estimatedMinutes: 30,
            summary: 'Learn how to store lists of tasks, students, or game scores using arrays and nested JavaScript objects.',
            keyConcepts: ['Array Methods (.map, .filter)', 'Object Key-Values', 'JSON Strings'],
            sampleCode: `const tasks = [\n  { id: 1, text: "Finish Loop Challenge", done: false },\n  { id: 2, text: "Ask AI Teacher for feedback", done: true }\n];\nconst active = tasks.filter(t => !t.done);`,
            practicePrompt: 'Write a filter that takes a list of grades and returns only passing scores (>= 70).'
          },
          {
            id: 'l2-2',
            title: 'LocalStorage: Making Apps Persistent',
            estimatedMinutes: 25,
            summary: 'Save and load student data so refreshing the page never loses notes, high scores, or settings.',
            keyConcepts: ['localStorage.setItem', 'localStorage.getItem', 'JSON.parse & stringify'],
            sampleCode: `localStorage.setItem('myScore', '100');\nconst saved = localStorage.getItem('myScore');`,
            practicePrompt: 'Save a student\'s username to localStorage and display "Welcome back, [name]" on page load.'
          }
        ],
        project: {
          id: 'p2',
          title: 'Project 2: Student Habit & Task Tracker with Persistence',
          difficulty: 'Intermediate',
          description: 'A fully functional study planner where students add assignments, filter completed items, track streaks, and save progress in browser storage.',
          technologies: ['JavaScript ES6', 'LocalStorage API', 'Responsive CSS Grid'],
          learningOutcomes: ['CRUD operations', 'Persistence', 'Array filtering', 'Dynamic list rendering']
        }
      },
      {
        id: 'm3',
        phase: 3,
        title: 'Milestone 3: Connecting to AI APIs & Modern Frameworks',
        description: 'Understand asynchronous JavaScript (async/await, fetch) and build an AI-powered smart application.',
        lessons: [
          {
            id: 'l3-1',
            title: 'Async/Await & Fetching Data from APIs',
            estimatedMinutes: 40,
            summary: 'Discover how web apps communicate with servers and AI language models using asynchronous requests.',
            keyConcepts: ['Promises', 'async/await', 'fetch() POST & GET', 'Error Handling (try/catch)'],
            sampleCode: `async function askAI(prompt) {\n  const res = await fetch('/api/teacher/chat', {\n    method: 'POST',\n    headers: { 'Content-Type': 'application/json' },\n    body: JSON.stringify({ message: prompt })\n  });\n  const data = await res.json();\n  return data.reply;\n}`,
            practicePrompt: 'Build a function that calls an API endpoint with a timeout and handles connection failures gracefully.'
          }
        ],
        project: {
          id: 'p3',
          title: 'Project 3: AI Study Buddy & Flashcard Summarizer',
          difficulty: 'Advanced',
          description: 'An AI-powered web tool that turns messy classroom lecture notes into question-and-answer flashcards and quiz challenges.',
          technologies: ['React/Modern JS', 'Gemini AI API', 'CSS Animations'],
          learningOutcomes: ['REST API integration', 'Prompt engineering', 'Async UI states', 'Loading spinners & error toasts']
        }
      }
    ]
  },
  ai_data: {
    id: 'path-ai-data',
    title: 'AI & Python Data Explorer for Students',
    overview: 'Explore artificial intelligence from the ground up: prompt engineering, tokenization, machine learning fundamentals, and building AI assistants.',
    targetGoal: 'Artificial Intelligence & Machine Learning',
    estimatedTotalHours: 20,
    createdAt: new Date().toISOString(),
    milestones: [
      {
        id: 'm-ai-1',
        phase: 1,
        title: 'Milestone 1: How AI Thinks - Logic & Algorithms',
        description: 'Demystify artificial intelligence. Learn how computers use inputs, weights, and rules to make decisions.',
        lessons: [
          {
            id: 'l-ai-1',
            title: 'From Rule-Based Code to Machine Learning',
            estimatedMinutes: 25,
            summary: 'Compare traditional `if/else` logic with machine learning patterns that detect patterns from data.',
            keyConcepts: ['Heuristics vs Machine Learning', 'Inputs and Outputs', 'Pattern Recognition']
          },
          {
            id: 'l-ai-2',
            title: 'Prompt Engineering & Socratic AI Prompting',
            estimatedMinutes: 30,
            summary: 'Learn role prompting, few-shot examples, system instructions, and temperature tuning to get precise AI responses.',
            keyConcepts: ['System Instructions', 'Few-Shot Prompting', 'Chain-of-Thought']
          }
        ],
        project: {
          id: 'p-ai-1',
          title: 'Project 1: Socratic AI Homework Coach',
          difficulty: 'Beginner',
          description: 'Design a system prompt and interactive chat interface that guides a student to solve algebra problems without simply giving away the answer.',
          technologies: ['Gemini API', 'Prompt Design', 'Web Chat Interface'],
          learningOutcomes: ['Prompt constraints', 'Safety rules', 'Socratic dialogue']
        }
      },
      {
        id: 'm-ai-2',
        phase: 2,
        title: 'Milestone 2: Natural Language Processing & Sentiment Analysis',
        description: 'Process student essays, reviews, or chat messages to extract emotion, keywords, and topics.',
        lessons: [
          {
            id: 'l-ai-3',
            title: 'Tokenization, Embeddings & Vector Similarity',
            estimatedMinutes: 35,
            summary: 'Understand how words become numbers (tokens) and how semantic vectors represent meaning.',
            keyConcepts: ['Tokens', 'Embeddings', 'Semantic Distance']
          }
        ],
        project: {
          id: 'p-ai-2',
          title: 'Project 2: Smart Student Feedback & Mood Dashboard',
          difficulty: 'Intermediate',
          description: 'Build an app where classmates share comments and AI categorizes them as constructive, inquisitive, or positive.',
          technologies: ['Gemini 2.5 Flash', 'NLP Classification', 'Data Visualization'],
          learningOutcomes: ['Structured output', 'Confidence scores', 'Data summarization']
        }
      }
    ]
  },
  game_dev: {
    id: 'path-game-dev',
    title: 'Game Development & Interactive Simulation',
    overview: 'Learn game loops, collision detection, sprite physics, and AI opponents for retro 2D arcade games.',
    targetGoal: 'Game Coding & Simulations',
    estimatedTotalHours: 22,
    createdAt: new Date().toISOString(),
    milestones: [
      {
        id: 'm-g-1',
        phase: 1,
        title: 'Milestone 1: The Game Loop & Canvas 2D',
        description: 'Harness the HTML5 Canvas API and `requestAnimationFrame` to draw shapes, update positions, and render at 60 FPS.',
        lessons: [
          {
            id: 'l-g-1',
            title: 'Coordinates, Velocity & The 60 FPS Game Loop',
            estimatedMinutes: 30,
            summary: 'Learn (X, Y) coordinate planes, velocity vectors, and screen clearing.',
            keyConcepts: ['requestAnimationFrame', 'ctx.fillRect', 'Delta Time & Speed']
          },
          {
            id: 'l-g-2',
            title: 'Keyboard & Touch Input for Players',
            estimatedMinutes: 25,
            summary: 'Listen for Arrow keys, WASD, and touch buttons to move player sprites smoothly.',
            keyConcepts: ['keydown & keyup flags', 'Boundary Clamping', 'Smooth Movement']
          }
        ],
        project: {
          id: 'p-g-1',
          title: 'Project 1: Retro Space Dodger Arcade Game',
          difficulty: 'Beginner',
          description: 'Create a dodging game where falling meteors accelerate and the player moves their spaceship left and right to beat the high score.',
          technologies: ['HTML5 Canvas', 'Game Loop', 'Collision Logic'],
          learningOutcomes: ['Bounding box collision', 'Score tracking', 'Game over states']
        }
      },
      {
        id: 'm-g-2',
        phase: 2,
        title: 'Milestone 2: AI Enemy Behaviors & Procedural Spawns',
        description: 'Code intelligent enemy behaviors like chasing the player, patrolling platforms, and difficulty scaling.',
        lessons: [
          {
            id: 'l-g-3',
            title: 'Vector Math & Enemy Pathfinding',
            estimatedMinutes: 35,
            summary: 'Calculate angles and distance between enemies and players using Math.atan2 and distance formulas.',
            keyConcepts: ['Euclidean Distance', 'Trigonometry in Games', 'State Machines']
          }
        ],
        project: {
          id: 'p-g-2',
          title: 'Project 2: AI Maze Runner or Tower Defense Prototype',
          difficulty: 'Intermediate',
          description: 'A grid-based strategy game with enemy bots that navigate obstacles to reach goals.',
          technologies: ['Canvas 2D', 'A* / Pathfinding', 'State Machines'],
          learningOutcomes: ['AI decision trees', 'Wave generation', 'Game balancing']
        }
      }
    ]
  }
};
