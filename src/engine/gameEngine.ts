import type {
  ChoiceId,
  DecisionId,
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

export function getDecisionStep(stepIndex: number) {
  return DECISION_STEPS[stepIndex] || null;
}
