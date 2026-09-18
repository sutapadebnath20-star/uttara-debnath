export type SkillLevel = 'beginner' | 'some_blocks' | 'intermediate' | 'advanced';

export type LearningGoal = 
  | 'web_dev' 
  | 'game_dev' 
  | 'ai_data' 
  | 'automation_python' 
  | 'cs_fundamentals';

export interface PaymentReceipt {
  receiptId: string;
  orderId: string;
  studentName: string;
  amount: number; // 500
  currency: string; // "INR"
  formattedAmount: string; // "₹500.00"
  paymentMethod: 'UPI' | 'Card' | 'NetBanking';
  paymentDetails: string; // e.g. "GPay (alex@okhdfcbank)" or "HDFC Debit Card ending in 4242"
  utrNumber: string;
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
  timestamp: string;
  enrollmentNo: string;
  accessPassKey: string;
}

export interface StudentProfile {
  name: string;
  skillLevel: SkillLevel;
  goal: LearningGoal;
  interests: string[];
  hoursPerWeek: number;
  xp: number;
  streakDays: number;
  completedLessonIds: string[];
  completedChallengeIds: string[];
  isEnrolled: boolean;
  enrollmentFeePaid: number; // 500
  paymentReceipt?: PaymentReceipt;
}

export interface LessonItem {
  id: string;
  title: string;
  estimatedMinutes: number;
  summary: string;
  keyConcepts: string[];
  sampleCode?: string;
  practicePrompt?: string;
  completed?: boolean;
}

export interface PathProject {
  id: string;
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  technologies: string[];
  starterCode?: string;
  learningOutcomes: string[];
  completed?: boolean;
}

export interface Milestone {
  id: string;
  phase: number;
  title: string;
  description: string;
  lessons: LessonItem[];
  project: PathProject;
}

export interface LearningPath {
  id: string;
  title: string;
  overview: string;
  targetGoal: string;
  estimatedTotalHours: number;
  milestones: Milestone[];
  aiNotes?: string;
  createdAt: string;
  lastAdjustedAt?: string;
}

export interface ProjectTask {
  id: string;
  title: string;
  description: string;
  phase: string;
  suggestedTech?: string;
  starterSnippet?: string;
  done: boolean;
}

export interface ProjectBreakdown {
  projectName: string;
  summary: string;
  recommendedTech: {
    name: string;
    reason: string;
    category: 'language' | 'library' | 'tool';
  }[];
  architectureOverview: string;
  tasks: ProjectTask[];
  boilerplate: {
    filename: string;
    language: string;
    code: string;
    explanation: string;
  }[];
  potentialPitfalls: string[];
}

export interface ChallengeTestCase {
  inputDescription: string;
  expectedOutput: string;
  inputs: any[];
}

export interface CodingChallenge {
  id: string;
  title: string;
  category: 'Variables' | 'Conditionals' | 'Loops' | 'Functions' | 'Arrays' | 'Algorithms';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  xpReward: number;
  description: string;
  conceptExplainer: string;
  starterCode: string;
  functionName: string;
  testCases: ChallengeTestCase[];
  solutionCode: string;
  hints: string[];
}

export interface AiChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  codeSnippet?: string;
}
