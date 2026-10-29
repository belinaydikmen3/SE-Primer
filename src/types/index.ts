export type ExperienceLevel = 'junior' | 'mid' | 'senior';
export type Role = 'developer' | 'qa' | 'devops';
export type LearningGoal = 'technical' | 'testing' | 'security';

export interface UserProfile {
  level: ExperienceLevel;
  role: Role;
  goal: LearningGoal;
}

export type DecisionId = 'arch' | 'test' | 'privacy';
export type ChoiceId = 'A' | 'B';

export interface DecisionOption {
  id: ChoiceId;
  title: string;
  badge: string;
  description: string;
  consequence: string; // "Ne oldu?"
  justification: string; // "Neden oldu?"
  isRecommended: boolean;
}

export interface DecisionStep {
  id: DecisionId;
  stepNumber: number;
  totalSteps: number;
  phaseTitle: string;
  scenarioTime: string;
  headline: string;
  contextText: string;
  hintText: string;
  logSnippet?: string;
  options: {
    A: DecisionOption;
    B: DecisionOption;
  };
}

export type OutcomeType = 'outcome_a' | 'outcome_b';

export interface OutcomeDetail {
  type: OutcomeType;
  title: string;
  badge: string;
  statusBadge: string;
  summary: string;
  metrics: {
    recoveryTime: string;
    dataLoss: string;
    kvkkStatus: string;
    availability: string;
  };
  recommendation: string;
}

export interface TutorResponse {
  question: string;
  hint: string;
  feedback: string;
  reveals_answer: boolean;
}

export interface TutorMessage {
  id: string;
  sender: 'user' | 'tutor';
  text?: string;
  tutorData?: TutorResponse;
  timestamp: string;
  isFallback?: boolean;
}

export interface GameState {
  currentScreen: 'onboarding' | 'crisis' | 'debrief';
  profile: UserProfile;
  currentStepIndex: number;
  selectedChoices: Partial<Record<DecisionId, ChoiceId>>;
  reviewedSteps: DecisionId[];
  isShowingConsequence: boolean;
  timeRemaining: number;
  isTimerRunning: boolean;
  isTimerExpired: boolean;
  isSubmittingDecision: boolean;
  tutorMessages: TutorMessage[];
  isTutorLoading: boolean;
  activeHintVisible: boolean;
  outcome: OutcomeDetail | null;
}
