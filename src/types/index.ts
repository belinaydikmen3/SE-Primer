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
  difficulty: number; // 0.0 - 1.0
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

export interface BehavioralMetrics {
  karar_suresi_sn: number;
  karar_degistirme_sayisi: number;
  onceki_basarisiz_karar_sayisi: number;
  ortalama_karar_suresi_sn: number;
  sahne_zorlugu: number;
  yardim_kullanim_sayisi: number;
  oyuncu_deneyim_seviyesi: number;
  sahne_ilerleme_orani: number;
}

export interface ModelPrediction {
  probability: number;
  predictedLabel: 0 | 1;
  isSupportNeeded: boolean;
  isLoaded: boolean;
  isEvaluating: boolean;
  modelVersion: string;
  error: string | null;
  source: 'onnx' | 'fallback';
}

export interface DataCollectionRecord {
  oturum_id: string;
  sahne_id: DecisionId;
  karar_suresi_sn: number;
  karar_degistirme_sayisi: number;
  onceki_basarisiz_karar_sayisi: number;
  ortalama_karar_suresi_sn: number;
  sahne_zorlugu: number;
  yardim_kullanim_sayisi: number;
  oyuncu_deneyim_seviyesi: number;
  sahne_ilerleme_orani: number;
  destek_gerekli: number;
  kaynak: 'gercek' | 'sentetik';
  timestamp: string;
}

export interface AdaptiveState {
  isPromptOffered: boolean;
  isDismissed: boolean;
  isAccepted: boolean;
  extendedTimeGiven: boolean;
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

  // The Primer v2 additions
  sessionId: string;
  dataCollectionEnabled: boolean;
  collectedRecords: DataCollectionRecord[];
  latestPrediction: ModelPrediction | null;
  adaptiveState: AdaptiveState;
  activeDecisionChanges: number;
  selectedChoicePreview: ChoiceId | null;
  stepStartTime: number;
  sessionDecisionTimes: number[];
  helpInteractionsCount: number;
  showDevPanel: boolean;
}
