import React from 'react';
import type { ModelPrediction } from '../types';

interface AdaptivePromptCardProps {
  prediction: ModelPrediction | null;
  onAccept: () => void;
  onDismiss: () => void;
}

export const AdaptivePromptCard: React.FC<AdaptivePromptCardProps> = ({
  prediction,
  onAccept,
  onDismiss,
}) => {
  if (!prediction || !prediction.isSupportNeeded) {
    return null;
  }

  const probPercent = Math.round(prediction.probability * 100);

  return (
    <div className="adaptive-prompt-card" data-cy="adaptive-prompt-card">
      <div className="adaptive-prompt-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="adaptive-pulse-icon">🤖</span>
          <span style={{ fontWeight: 700, fontSize: '13px', color: '#c4b5fd' }}>
            The Primer — Akıllı Sokratik Asistan
          </span>
        </div>
        <span
          className="brand-badge"
          style={{ background: 'rgba(139, 92, 246, 0.2)', color: '#c4b5fd', borderColor: '#8b5cf6' }}
          data-cy="adaptive-badge"
        >
          Destek Önerisi (%{probPercent})
        </span>
      </div>

      <p className="adaptive-prompt-text" data-cy="adaptive-prompt-text">
        "Primer, bu kriz adımında karar verirken biraz zorlandığını fark etti. İstersen birlikte düşünelim; acele etmene gerek yok."
      </p>

      <div className="adaptive-actions">
        <button
          type="button"
          className="btn-primary"
          style={{
            background: 'linear-gradient(135deg, #7c3aed, #6366f1)',
            minHeight: '34px',
            fontSize: '12px',
            padding: '6px 12px',
            width: 'auto',
          }}
          onClick={onAccept}
          data-cy="adaptive-accept-btn"
        >
          💡 Birlikte Düşünelim (İpucunu Aç)
        </button>

        <button
          type="button"
          className="btn-secondary"
          style={{ minHeight: '34px', fontSize: '12px', padding: '6px 12px', width: 'auto' }}
          onClick={onDismiss}
          data-cy="adaptive-dismiss-btn"
        >
          Teşekkürler, Kendim Devam Edeceğim
        </button>
      </div>
    </div>
  );
};

