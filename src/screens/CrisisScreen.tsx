import React from 'react';
import type {
  ChoiceId,
  DecisionStep,
  TutorMessage,
  UserProfile,
} from '../types';
import { HintCard } from '../components/HintCard';
import { TutorPanel } from '../components/TutorPanel';
import { CauseEffectModal } from '../components/CauseEffectModal';
import { getGoalHighlight, getRolePerspective } from '../scenario/data';

interface CrisisScreenProps {
  step: DecisionStep;
  profile: UserProfile;
  selectedChoice?: ChoiceId;
  isSubmitting: boolean;
  isShowingConsequence: boolean;
  activeHintVisible: boolean;
  onToggleHint: () => void;
  onSelectOption: (choiceId: ChoiceId) => void;
  onNextStep: () => void;
  tutorMessages: TutorMessage[];
  isTutorLoading: boolean;
  onSendTutorMessage: (query: string) => Promise<void>;
  apiKey?: string;
  onApiKeyChange?: (key: string) => void;
  isTimerExpired?: boolean;
}

export const CrisisScreen: React.FC<CrisisScreenProps> = ({
  step,
  profile,
  selectedChoice,
  isSubmitting,
  isShowingConsequence,
  activeHintVisible,
  onToggleHint,
  onSelectOption,
  onNextStep,
  tutorMessages,
  isTutorLoading,
  onSendTutorMessage,
  apiKey,
  onApiKeyChange,
  isTimerExpired,
}) => {
  const chosenOption = selectedChoice ? step.options[selectedChoice] : null;

  return (
    <div className="screen-container" data-cy="crisis-screen">
      {/* Kriz Rol & Hedef Vurgu Kartı */}
      <div
        style={{
          background: 'rgba(59, 130, 246, 0.08)',
          border: '1px solid rgba(59, 130, 246, 0.2)',
          borderRadius: 'var(--radius-sm)',
          padding: '8px 12px',
          fontSize: '11px',
          color: '#93c5fd',
          display: 'flex',
          flexDirection: 'column',
          gap: '2px',
        }}
        data-cy="role-perspective-banner"
      >
        <div>{getRolePerspective(profile.role)}</div>
        <div style={{ color: '#bfdbfe', opacity: 0.85 }}>{getGoalHighlight(profile.goal)}</div>
      </div>

      {/* Süre Doldu Uyarısı (Senior modda) */}
      {isTimerExpired && (
        <div
          style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid var(--color-accent-red)',
            borderRadius: 'var(--radius-sm)',
            padding: '10px 12px',
            color: '#fca5a5',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
          data-cy="timer-expired-alert"
        >
          <span>⚠️</span>
          <span>
            <strong>Süre Doldu (60s):</strong> Karar süresi tükendi! Kriz operasyonunda varsayılan mühendislik kararı işleniyor.
          </span>
        </div>
      )}

      {/* Karar Başlığı ve Bağlam */}
      <div className="card" data-cy="decision-card">
        <div className="card-title" style={{ justifyContent: 'space-between' }}>
          <span data-cy="decision-phase-title">{step.phaseTitle}</span>
          <span style={{ color: 'var(--color-accent-amber)' }}>{step.scenarioTime}</span>
        </div>

        <h2 className="title-lg" style={{ fontSize: '18px', marginBottom: '8px' }} data-cy="decision-headline">
          {step.headline}
        </h2>

        <p className="subtitle-sm" data-cy="decision-context">
          {step.contextText}
        </p>

        {/* Log Gösterimi (KVKK Kararında) */}
        {step.logSnippet && (
          <div className="log-box" data-cy="decision-log-snippet">
            {step.logSnippet}
          </div>
        )}
      </div>

      {/* Seçenek Kartları (A ve B) */}
      <div className="decision-options" data-cy="decision-options-group">
        <button
          type="button"
          className="option-card"
          onClick={() => onSelectOption('A')}
          disabled={isSubmitting}
          data-cy="option-a"
        >
          <span className="option-badge">{step.options.A.badge}</span>
          <div className="option-title">A) {step.options.A.title}</div>
          <div className="option-desc">{step.options.A.description}</div>
        </button>

        <button
          type="button"
          className="option-card"
          onClick={() => onSelectOption('B')}
          disabled={isSubmitting}
          data-cy="option-b"
        >
          <span className="option-badge">{step.options.B.badge}</span>
          <div className="option-title">B) {step.options.B.title}</div>
          <div className="option-desc">{step.options.B.description}</div>
        </button>
      </div>

      {/* İpucu Kartı (Seviyeye Göre Otomatik veya İsteğe Bağlı) */}
      <HintCard
        hintText={step.hintText}
        level={profile.level}
        isVisible={activeHintVisible}
        onToggle={onToggleHint}
      />

      {/* Sokratik AI Tutor Paneli */}
      <TutorPanel
        messages={tutorMessages}
        isLoading={isTutorLoading}
        onSendMessage={onSendTutorMessage}
        apiKey={apiKey}
        onApiKeyChange={onApiKeyChange}
      />

      {/* Karar Sonrası Neden-Sonuç Kartı */}
      {isShowingConsequence && chosenOption && (
        <CauseEffectModal
          option={chosenOption}
          stepNumber={step.stepNumber}
          totalSteps={step.totalSteps}
          onNext={onNextStep}
        />
      )}
    </div>
  );
};
