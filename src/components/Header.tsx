import React from 'react';
import type { UserProfile } from '../types';

interface HeaderProps {
  profile: UserProfile;
  currentScreen: 'onboarding' | 'crisis' | 'debrief';
  timeRemaining: number;
  isTimerRunning: boolean;
  stepNumber?: number;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  currentScreen,
  timeRemaining,
  isTimerRunning,
  stepNumber,
}) => {
  return (
    <header className="app-header" data-cy="app-header">
      <div className="brand-wrapper">
        <span className="brand-title">
          SE PRIMER
          <span className="brand-badge">YZM301</span>
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
      </div>
    </header>
  );
};
