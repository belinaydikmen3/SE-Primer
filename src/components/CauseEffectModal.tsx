import React from 'react';
import type { DecisionOption } from '../types';

interface CauseEffectModalProps {
  option: DecisionOption;
  stepNumber: number;
  totalSteps: number;
  onNext: () => void;
}

export const CauseEffectModal: React.FC<CauseEffectModalProps> = ({
  option,
  stepNumber,
  totalSteps,
  onNext,
}) => {
  return (
    <div className="modal-overlay" data-cy="consequence-modal-overlay">
      <div className="modal-content" data-cy="consequence-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="modal-badge" data-cy="consequence-badge">
            Karar {stepNumber}/{totalSteps} Sonucu
          </span>
          <span
            style={{
              fontSize: '11px',
              fontFamily: 'var(--font-family-mono)',
              color: option.isRecommended ? 'var(--color-accent-green)' : 'var(--color-accent-red)',
            }}
          >
            {option.isRecommended ? '✓ Güvenli Seçim' : '⚠️ Riskli Müdahale'}
          </span>
        </div>

        <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text-primary)' }} data-cy="consequence-choice-title">
          {option.title}
        </h3>

        <div className="consequence-section">
          <span className="consequence-title">📋 Ne Oldu? (Operasyonel Etki)</span>
          <div className="consequence-text" data-cy="consequence-text">
            {option.consequence}
          </div>
        </div>

        <div className="consequence-section">
          <span className="consequence-title">🔬 Neden Oldu? (Teknik Gerekçe)</span>
          <div className="justification-text" data-cy="justification-text">
            {option.justification}
          </div>
        </div>

        <button
          type="button"
          className="btn-primary"
          onClick={onNext}
          data-cy="consequence-next-btn"
          style={{ marginTop: '8px' }}
        >
          {stepNumber < totalSteps ? 'Sonraki Karara Geç →' : 'Kriz Sonuç Raporunu Gör →'}
        </button>
      </div>
    </div>
  );
};
