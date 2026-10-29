import React, { useState, useEffect, useRef } from 'react';
import type {
  ChoiceId,
  GameState,
  TutorMessage,
  UserProfile,
} from './types';
import {
  evaluateFinalOutcome,
  getDecisionStep,
  INITIAL_PROFILE,
  INITIAL_STATE,
  shouldShowAutoHint,
} from './engine/gameEngine';
import { querySocraticTutor } from './tutor/socraticTutor';
import { Header } from './components/Header';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { CrisisScreen } from './screens/CrisisScreen';
import { OutcomeScreen } from './screens/OutcomeScreen';
import './styles/index.css';

export const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);
  const [apiKey, setApiKey] = useState<string>(() => {
    return (
      (typeof import.meta !== 'undefined' &&
        import.meta.env &&
        (import.meta.env.VITE_GEMINI_API_KEY as string)) ||
      ''
    );
  });

  const timerRef = useRef<number | null>(null);

  // Synchronize hint visibility when profile changes
  const handleProfileChange = (profile: UserProfile) => {
    setGameState((prev) => ({
      ...prev,
      profile,
      activeHintVisible: shouldShowAutoHint(profile.level),
    }));
  };

  // Start crisis simulation from onboarding
  const handleStartCrisis = () => {
    setGameState((prev) => ({
      ...prev,
      currentScreen: 'crisis',
      currentStepIndex: 0,
      selectedChoices: {},
      reviewedSteps: [],
      isShowingConsequence: false,
      timeRemaining: 60,
      isTimerRunning: prev.profile.level === 'senior',
      isTimerExpired: false,
      activeHintVisible: shouldShowAutoHint(prev.profile.level),
      outcome: null,
    }));
  };

  // 60-second Countdown Timer Effect for Senior Level
  useEffect(() => {
    if (gameState.currentScreen === 'crisis' && gameState.profile.level === 'senior' && gameState.isTimerRunning) {
      timerRef.current = window.setInterval(() => {
        setGameState((prev) => {
          if (prev.timeRemaining <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            // Timeout reached! Safe automatic fallback (selects Option A with timeout warning)
            const currentStep = getDecisionStep(prev.currentStepIndex);
            if (!currentStep) return prev;

            const fallbackChoice: ChoiceId = 'A';
            return {
              ...prev,
              timeRemaining: 0,
              isTimerRunning: false,
              isTimerExpired: true,
              isSubmittingDecision: false,
              selectedChoices: {
                ...prev.selectedChoices,
                [currentStep.id]: fallbackChoice,
              },
              isShowingConsequence: true,
            };
          }
          return {
            ...prev,
            timeRemaining: prev.timeRemaining - 1,
          };
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [gameState.currentScreen, gameState.profile.level, gameState.isTimerRunning, gameState.currentStepIndex]);

  // Select Option with race condition / double-click protection
  const handleSelectOption = (choiceId: ChoiceId) => {
    if (gameState.isSubmittingDecision || gameState.isShowingConsequence) {
      return; // prevent race condition
    }

    // Stop timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    const currentStep = getDecisionStep(gameState.currentStepIndex);
    if (!currentStep) return;

    setGameState((prev) => ({
      ...prev,
      isSubmittingDecision: true,
      isTimerRunning: false,
      selectedChoices: {
        ...prev.selectedChoices,
        [currentStep.id]: choiceId,
      },
      isShowingConsequence: true,
    }));
  };

  // Move to next step or debrief screen
  const handleNextStep = () => {
    const nextIndex = gameState.currentStepIndex + 1;
    const isSenior = gameState.profile.level === 'senior';

    if (nextIndex < 3) {
      setGameState((prev) => ({
        ...prev,
        currentStepIndex: nextIndex,
        isShowingConsequence: false,
        isSubmittingDecision: false,
        timeRemaining: 60,
        isTimerRunning: isSenior,
        isTimerExpired: false,
        activeHintVisible: shouldShowAutoHint(prev.profile.level),
      }));
    } else {
      // Evaluate final outcome
      const finalOutcome = evaluateFinalOutcome(gameState.selectedChoices);
      setGameState((prev) => ({
        ...prev,
        currentScreen: 'debrief',
        isShowingConsequence: false,
        isSubmittingDecision: false,
        isTimerRunning: false,
        outcome: finalOutcome,
      }));
    }
  };

  // Toggle hint manually for mid / senior levels
  const handleToggleHint = () => {
    setGameState((prev) => ({
      ...prev,
      activeHintVisible: !prev.activeHintVisible,
    }));
  };

  // Send message to Socratic Tutor
  const handleSendTutorMessage = async (query: string) => {
    const currentStep = getDecisionStep(gameState.currentStepIndex);
    if (!currentStep) return;

    const userMsg: TutorMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString(),
    };

    setGameState((prev) => ({
      ...prev,
      isTutorLoading: true,
      tutorMessages: [...prev.tutorMessages, userMsg],
    }));

    try {
      const { response, isFallback } = await querySocraticTutor(
        query,
        currentStep,
        gameState.profile,
        apiKey
      );

      const tutorMsg: TutorMessage = {
        id: `tut_${Date.now()}`,
        sender: 'tutor',
        tutorData: response,
        timestamp: new Date().toLocaleTimeString(),
        isFallback,
      };

      setGameState((prev) => ({
        ...prev,
        isTutorLoading: false,
        tutorMessages: [...prev.tutorMessages, tutorMsg],
      }));
    } catch (err) {
      console.error('Tutor error:', err);
      setGameState((prev) => ({
        ...prev,
        isTutorLoading: false,
      }));
    }
  };

  // Reset entire game state cleanly
  const handleRestart = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setGameState({
      ...INITIAL_STATE,
      profile: { ...INITIAL_PROFILE },
    });
  };

  const currentStep = getDecisionStep(gameState.currentStepIndex);

  return (
    <div className="app-root-layout">
      <Header
        profile={gameState.profile}
        currentScreen={gameState.currentScreen}
        timeRemaining={gameState.timeRemaining}
        isTimerRunning={gameState.isTimerRunning}
        stepNumber={gameState.currentStepIndex + 1}
      />

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {gameState.currentScreen === 'onboarding' && (
          <OnboardingScreen
            profile={gameState.profile}
            onProfileChange={handleProfileChange}
            onStartCrisis={handleStartCrisis}
          />
        )}

        {gameState.currentScreen === 'crisis' && currentStep && (
          <CrisisScreen
            step={currentStep}
            profile={gameState.profile}
            selectedChoice={gameState.selectedChoices[currentStep.id]}
            isSubmitting={gameState.isSubmittingDecision}
            isShowingConsequence={gameState.isShowingConsequence}
            activeHintVisible={gameState.activeHintVisible}
            onToggleHint={handleToggleHint}
            onSelectOption={handleSelectOption}
            onNextStep={handleNextStep}
            tutorMessages={gameState.tutorMessages}
            isTutorLoading={gameState.isTutorLoading}
            onSendTutorMessage={handleSendTutorMessage}
            apiKey={apiKey}
            onApiKeyChange={setApiKey}
            isTimerExpired={gameState.isTimerExpired}
          />
        )}

        {gameState.currentScreen === 'debrief' && gameState.outcome && (
          <OutcomeScreen
            outcome={gameState.outcome}
            choices={gameState.selectedChoices}
            profile={gameState.profile}
            onRestart={handleRestart}
          />
        )}
      </main>
    </div>
  );
};

export default App;
