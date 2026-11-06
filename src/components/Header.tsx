import React from 'react';
import type { UserProfile } from '../types';

interface HeaderProps {
  profile: UserProfile;
  currentScreen: 'onboarding' | 'crisis' | 'debrief';
  timeRemaining: number;
  isTimerRunning: boolean;
  stepNumber?: number;
  onToggleDevPanel?: () => void;
  predictionProbability?: number;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  currentScreen,
  timeRemaining,
  isTimerRunning,
  stepNumber,
  onToggleDevPanel,
  predictionProbability,
}) => {
  return (
    <header className="app-header" data-cy="app-header">
      <div className="brand-wrapper">
        <span className="brand-title">
          SE PRIMER <span style={{ color: 'var(--color-accent-violet)', fontSize: '12px' }}>v2</span>
          <span
            className="brand-badge"
            style={{
              background: 'rgba(139, 92, 246, 0.15)',
              color: '#c4b5fd',
              borderColor: 'rgba(139, 92, 246, 0.3)',
              marginLeft: '2px',
            }}
            data-cy="header-v2-badge"
          >
            ML
          </span>
        </span>
      </div>

      <div className="header-status">
        {currentScreen === 'crisis' && (
          <>
            <span className="status-chip warning" data-cy="header-incident-badge">
              <span className="pulse-dot" />
              08:00 Kriz
            </span>

            {profile.level === 'senior' && isTimerRunning && (
              <div
                className={`timer-container ${timeRemaining <= 15 ? 'urgent' : ''}`}
                data-cy="header-timer"
                aria-live="polite"
              >
                <span>⏳</span>
                <span>{timeRemaining}s</span>
              </div>
            )}

            {stepNumber && (
              <span className="status-chip" data-cy="header-step-counter">
                {stepNumber}/3
              </span>
            )}
          </>
        )}

        {currentScreen === 'debrief' && (
          <span className="status-chip" data-cy="header-debrief-badge">
            Sonuç Raporu
          </span>
        )}

        {onToggleDevPanel && (
          <button
            type="button"
            className="btn-secondary"
            style={{
              width: 'auto',
              minHeight: '24px',
              padding: '1px 6px',
              fontSize: '11px',
              background: 'rgba(139, 92, 246, 0.12)',
              borderColor: 'rgba(139, 92, 246, 0.35)',
              color: '#c4b5fd',
              whiteSpace: 'nowrap',
            }}
            onClick={onToggleDevPanel}
            title={`ML Model ve Diferansiyel Parite Denetleyicisini Aç${predictionProbability !== undefined ? ` (p=${predictionProbability.toFixed(2)})` : ''}`}
            data-cy="dev-panel-toggle"
          >
            ⚙️ ML
          </button>
        )}
      </div>
    </header>
  );
};
