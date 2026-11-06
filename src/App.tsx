import React, { useState, useEffect, useRef } from 'react';
import type {
  ChoiceId,
  DataCollectionRecord,
  GameState,
  TutorMessage,
  UserProfile,
} from './types';
import {
  buildBehavioralMetrics,
  evaluateFinalOutcome,
  generateSessionId,
  getDecisionStep,
  INITIAL_PROFILE,
  INITIAL_STATE,
  shouldShowAutoHint,
} from './engine/gameEngine';
import { querySocraticTutor } from './tutor/socraticTutor';
import { predictSupportNeed, getInferenceSession } from './services/onnxService';
import { Header } from './components/Header';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { CrisisScreen } from './screens/CrisisScreen';
import { OutcomeScreen } from './screens/OutcomeScreen';
import { DevModelInspector } from './components/DevModelInspector';
import './styles/index.css';

export const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(() => {
    return {
      ...INITIAL_STATE,
      sessionId: generateSessionId(),
      stepStartTime: Date.now(),
    };
  });

  const [apiKey, setApiKey] = useState<string>(() => {
    return (
      (typeof import.meta !== 'undefined' &&
        import.meta.env &&
        (import.meta.env.VITE_GEMINI_API_KEY as string)) ||
      ''
    );
  });

  const timerRef = useRef<number | null>(null);
  const gameStateRef = useRef(gameState);
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);
  const [liveElapsed, setLiveElapsed] = useState<number>(0);

  // Pre-load ONNX session in background
  useEffect(() => {
    getInferenceSession().catch((err) => {
      console.warn('Background ONNX pre-load warning:', err);
    });
  }, []);

  // Synchronize hint visibility when profile changes
  const handleProfileChange = (profile: UserProfile) => {
    setGameState((prev) => ({
      ...prev,
      profile,
      activeHintVisible: shouldShowAutoHint(profile.level),
    }));
  };

  const handleToggleDataCollection = (enabled: boolean) => {
    setGameState((prev) => ({
      ...prev,
      dataCollectionEnabled: enabled,
    }));
  };

  // Start crisis simulation from onboarding
  const handleStartCrisis = () => {
    const now = Date.now();
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
      stepStartTime: now,
      activeDecisionChanges: 0,
      selectedChoicePreview: null,
      sessionDecisionTimes: [],
      helpInteractionsCount: 0,
      adaptiveState: {
        isPromptOffered: false,
        isDismissed: false,
        isAccepted: false,
        extendedTimeGiven: false,
      },
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

  // Periodic behavioral ML evaluation during crisis
  useEffect(() => {
    if (gameState.currentScreen !== 'crisis' || gameState.isShowingConsequence) {
      return;
    }

    const currentStep = getDecisionStep(gameState.currentStepIndex);
    if (!currentStep) return;

    let isMounted = true;

    const interval = setInterval(async () => {
      const currentState = gameStateRef.current;
      const step = getDecisionStep(currentState.currentStepIndex);
      if (!step) return;

      const elapsed = Math.max(1, (Date.now() - currentState.stepStartTime) / 1000);
      setLiveElapsed(Math.round(elapsed));
      const metrics = buildBehavioralMetrics(currentState, step, elapsed);

      try {
        const pred = await predictSupportNeed(metrics);
        if (!isMounted) return;

        setGameState((prev) => {
          const shouldOffer =
            pred.isSupportNeeded &&
            !prev.adaptiveState.isPromptOffered &&
            !prev.adaptiveState.isDismissed;

          return {
            ...prev,
            latestPrediction: pred,
            adaptiveState: shouldOffer
              ? { ...prev.adaptiveState, isPromptOffered: true }
              : prev.adaptiveState,
          };
        });
      } catch (e) {
        console.warn('ML evaluation tick warning:', e);
      }
    }, 1500);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [gameState.currentScreen, gameState.currentStepIndex, gameState.isShowingConsequence]);

  // Handle accepting adaptive ML tutor help
  const handleAcceptAdaptive = () => {
    setGameState((prev) => {
      // If senior and time running low, give extra 30s relief
      const extraTime = prev.profile.level === 'senior' && prev.timeRemaining < 30 ? 30 : 0;
      return {
        ...prev,
        activeHintVisible: true,
        timeRemaining: prev.timeRemaining + extraTime,
        adaptiveState: {
          ...prev.adaptiveState,
          isAccepted: true,
          extendedTimeGiven: extraTime > 0,
        },
        tutorMessages: [
          ...prev.tutorMessages,
          {
            id: `tut_adapt_${Date.now()}`,
            sender: 'tutor',
            timestamp: new Date().toLocaleTimeString(),
            tutorData: {
              feedback: 'Primer kriz anında zorlandığını fark etti ve sakin kalman için devreye girdi.',
              question: 'Bu adımda en kötü durum senaryosu nedir ve bunu nasıl önleyebilirsin?',
              hint: 'Tüm seçeneklerin geri alınabilirlik (reversibility) maliyetini göz önünde bulundur.',
              reveals_answer: false,
            },
          },
        ],
      };
    });
  };

  const handleDismissAdaptive = () => {
    setGameState((prev) => ({
      ...prev,
      adaptiveState: {
        ...prev.adaptiveState,
        isDismissed: true,
      },
    }));
  };

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

    const elapsed = Math.max(1, (Date.now() - gameState.stepStartTime) / 1000);
    const metrics = buildBehavioralMetrics(gameState, currentStep, elapsed);

    // Record decision in data collection
    const record: DataCollectionRecord = {
      oturum_id: gameState.sessionId,
      sahne_id: currentStep.id,
      ...metrics,
      destek_gerekli: gameState.latestPrediction?.predictedLabel ?? (elapsed > 35 || gameState.activeDecisionChanges >= 2 ? 1 : 0),
      kaynak: 'gercek',
      timestamp: new Date().toISOString(),
    };

    setGameState((prev) => ({
      ...prev,
      isSubmittingDecision: true,
      isTimerRunning: false,
      selectedChoices: {
        ...prev.selectedChoices,
        [currentStep.id]: choiceId,
      },
      sessionDecisionTimes: [...prev.sessionDecisionTimes, elapsed],
      collectedRecords: prev.dataCollectionEnabled
        ? [...prev.collectedRecords, record]
        : prev.collectedRecords,
      isShowingConsequence: true,
    }));
  };

  // Move to next step or debrief screen
  const handleNextStep = () => {
    const nextIndex = gameState.currentStepIndex + 1;
    const isSenior = gameState.profile.level === 'senior';
    const now = Date.now();

    if (nextIndex < 3) {
      setGameState((prev) => ({
        ...prev,
        currentStepIndex: nextIndex,
        isShowingConsequence: false,
        isSubmittingDecision: false,
        timeRemaining: 60,
        isTimerRunning: isSenior,
        isTimerExpired: false,
        stepStartTime: now,
        activeDecisionChanges: 0,
        selectedChoicePreview: null,
        adaptiveState: {
          isPromptOffered: false,
          isDismissed: false,
          isAccepted: false,
          extendedTimeGiven: false,
        },
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
      helpInteractionsCount: prev.helpInteractionsCount + 1,
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
      helpInteractionsCount: prev.helpInteractionsCount + 1,
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
      sessionId: generateSessionId(),
      stepStartTime: Date.now(),
      profile: { ...INITIAL_PROFILE },
    });
  };

  const handleToggleDevPanel = () => {
    setGameState((prev) => ({
      ...prev,
      showDevPanel: !prev.showDevPanel,
    }));
  };

  const currentStep = getDecisionStep(gameState.currentStepIndex);
  const elapsedSeconds = currentStep ? Math.max(1, liveElapsed) : 0;
  const currentMetrics = currentStep
    ? buildBehavioralMetrics(gameState, currentStep, elapsedSeconds)
    : null;

  return (
    <div className="app-root-layout">
      <Header
        profile={gameState.profile}
        currentScreen={gameState.currentScreen}
        timeRemaining={gameState.timeRemaining}
        isTimerRunning={gameState.isTimerRunning}
        stepNumber={gameState.currentStepIndex + 1}
        onToggleDevPanel={handleToggleDevPanel}
        predictionProbability={gameState.latestPrediction?.probability}
      />

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {gameState.currentScreen === 'onboarding' && (
          <OnboardingScreen
            profile={gameState.profile}
            sessionId={gameState.sessionId}
            dataCollectionEnabled={gameState.dataCollectionEnabled}
            onProfileChange={handleProfileChange}
            onToggleDataCollection={handleToggleDataCollection}
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
            latestPrediction={gameState.latestPrediction}
            adaptiveState={gameState.adaptiveState}
            onAcceptAdaptive={handleAcceptAdaptive}
            onDismissAdaptive={handleDismissAdaptive}
          />
        )}

        {gameState.currentScreen === 'debrief' && gameState.outcome && (
          <OutcomeScreen
            outcome={gameState.outcome}
            choices={gameState.selectedChoices}
            profile={gameState.profile}
            collectedRecords={gameState.collectedRecords}
            onRestart={handleRestart}
          />
        )}
      </main>

      {/* Geliştirici ve Parite Testi Denetleyici Modalı */}
      <DevModelInspector
        prediction={gameState.latestPrediction}
        metrics={currentMetrics}
        isOpen={gameState.showDevPanel}
        onClose={handleToggleDevPanel}
      />
    </div>
  );
};

export default App;
