import type {
  BehavioralMetrics,
  ChoiceId,
  DataCollectionRecord,
  DecisionId,
  DecisionStep,
  ExperienceLevel,
  GameState,
  OutcomeDetail,
  UserProfile,
} from '../types';
import { DECISION_STEPS, OUTCOME_A, OUTCOME_B } from '../scenario/data';

export const INITIAL_PROFILE: UserProfile = {
  level: 'junior',
  role: 'developer',
  goal: 'technical',
};

export function generateSessionId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `ses_${crypto.randomUUID().substring(0, 8)}`;
  }
  return `ses_${Math.random().toString(36).substring(2, 10)}`;
}

export const INITIAL_STATE: GameState = {
  currentScreen: 'onboarding',
  profile: INITIAL_PROFILE,
  currentStepIndex: 0,
  selectedChoices: {},
  reviewedSteps: [],
  isShowingConsequence: false,
  timeRemaining: 60,
  isTimerRunning: false,
  isTimerExpired: false,
  isSubmittingDecision: false,
  tutorMessages: [],
  isTutorLoading: false,
  activeHintVisible: true, // will be synced with profile.level
  outcome: null,

  // The Primer v2 additions
  sessionId: generateSessionId(),
  dataCollectionEnabled: true,
  collectedRecords: [],
  latestPrediction: null,
  adaptiveState: {
    isPromptOffered: false,
    isDismissed: false,
    isAccepted: false,
    extendedTimeGiven: false,
  },
  activeDecisionChanges: 0,
  selectedChoicePreview: null,
  stepStartTime: Date.now(),
  sessionDecisionTimes: [],
  helpInteractionsCount: 0,
  showDevPanel: false,
};

/**
 * Evaluates game decisions and returns Outcome A or Outcome B
 * Rule:
 * Outcome A (Good): Decision 1 == A (Rollback) AND Decision 2 == A (Smoke Test) AND Decision 3 == A (Masking)
 * Outcome B (Bad): Decision 3 == B (Privacy breach) OR (Decision 1 == B AND Decision 2 == B)
 */
export function evaluateFinalOutcome(
  choices: Partial<Record<DecisionId, ChoiceId>>
): OutcomeDetail {
  const d1 = choices.arch;
  const d2 = choices.test;
  const d3 = choices.privacy;

  if (d1 === 'A' && d2 === 'A' && d3 === 'A') {
    return OUTCOME_A;
  }
  // Any choice of B in privacy is an instant KVKK violation -> Outcome B
  // Also hotfix (B) + skip tests (B) leads to operational disaster -> Outcome B
  return OUTCOME_B;
}

export function getTimerInitialSeconds(level: UserProfile['level']): number {
  return level === 'senior' ? 60 : 0;
}

export function shouldShowAutoHint(level: UserProfile['level']): boolean {
  return level === 'junior';
}

export function getDecisionStep(stepIndex: number): DecisionStep | null {
  return DECISION_STEPS[stepIndex] || null;
}

export function encodeExperienceLevel(level: ExperienceLevel): number {
  switch (level) {
    case 'junior':
      return 0;
    case 'mid':
      return 1;
    case 'senior':
      return 2;
  }
}

export function getStepProgress(stepIndex: number): number {
  if (stepIndex === 0) return 0.33;
  if (stepIndex === 1) return 0.67;
  return 1.0;
}

export function countPreviousFailedChoices(
  choices: Partial<Record<DecisionId, ChoiceId>>,
  currentStepIndex: number
): number {
  let failed = 0;
  if (currentStepIndex > 0 && choices.arch === 'B') failed++;
  if (currentStepIndex > 1 && choices.test === 'B') failed++;
  return failed;
}

/**
 * Constructs the 8 exact behavioral features required by the ONNX model
 */
export function buildBehavioralMetrics(
  state: GameState,
  currentStep: DecisionStep,
  elapsedSeconds: number
): BehavioralMetrics {
  const exp = encodeExperienceLevel(state.profile.level);
  const prevFailed = countPreviousFailedChoices(state.selectedChoices, state.currentStepIndex);

  const allTimes = [...state.sessionDecisionTimes, elapsedSeconds];
  const avgTime = allTimes.length > 0 ? allTimes.reduce((a, b) => a + b, 0) / allTimes.length : elapsedSeconds;

  return {
    karar_suresi_sn: Math.round(elapsedSeconds * 100) / 100,
    karar_degistirme_sayisi: state.activeDecisionChanges,
    onceki_basarisiz_karar_sayisi: prevFailed,
    ortalama_karar_suresi_sn: Math.round(avgTime * 100) / 100,
    sahne_zorlugu: currentStep.difficulty,
    yardim_kullanim_sayisi: state.helpInteractionsCount,
    oyuncu_deneyim_seviyesi: exp,
    sahne_ilerleme_orani: getStepProgress(state.currentStepIndex),
  };
}

/**
 * Converts collected session records to valid CSV string
 */
export function exportRecordsToCsv(records: DataCollectionRecord[]): string {
  const headers = [
    'oturum_id',
    'sahne_id',
    'karar_suresi_sn',
    'karar_degistirme_sayisi',
    'onceki_basarisiz_karar_sayisi',
    'ortalama_karar_suresi_sn',
    'sahne_zorlugu',
    'yardim_kullanim_sayisi',
    'oyuncu_deneyim_seviyesi',
    'sahne_ilerleme_orani',
    'destek_gerekli',
    'kaynak',
  ];

  const rows = records.map((r) =>
    [
      r.oturum_id,
      r.sahne_id,
      r.karar_suresi_sn,
      r.karar_degistirme_sayisi,
      r.onceki_basarisiz_karar_sayisi,
      r.ortalama_karar_suresi_sn,
      r.sahne_zorlugu,
      r.yardim_kullanim_sayisi,
      r.oyuncu_deneyim_seviyesi,
      r.sahne_ilerleme_orani,
      r.destek_gerekli,
      r.kaynak,
    ].join(',')
  );

  return [headers.join(','), ...rows].join('\n');
}
