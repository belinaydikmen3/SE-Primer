import React from 'react';
import type { ExperienceLevel } from '../types';

interface HintCardProps {
  hintText: string;
  level: ExperienceLevel;
  isVisible: boolean;
  onToggle: () => void;
}

export const HintCard: React.FC<HintCardProps> = ({
  hintText,
  level,
  isVisible,
  onToggle,
}) => {
  // Junior: always visible
  const isAutoVisible = level === 'junior';
  const showContent = isAutoVisible || isVisible;

  return (
    <div className="card" style={{ padding: '12px 14px' }} data-cy="hint-card-container">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: isAutoVisible ? 'default' : 'pointer',
        }}
        onClick={isAutoVisible ? undefined : onToggle}
      >
        <span
          style={{
            fontSize: '12px',
            fontWeight: 700,
            color: 'var(--color-accent-amber)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}
        >
          💡 {level === 'junior' ? 'Mühendislik İpucu (Otomatik Açık)' : 'Mühendislik İpucu'}
        </span>

        {!isAutoVisible && (
          <button
            type="button"
            className="btn-secondary"
            style={{ minHeight: '28px', padding: '2px 8px', fontSize: '11px', width: 'auto' }}
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
            data-cy="hint-toggle-btn"
          >
            {showContent ? 'Gizle ▲' : 'İpucu İste ▼'}
          </button>
        )}
      </div>

      {showContent && (
        <div
          style={{
            marginTop: '8px',
            fontSize: '13px',
            color: 'var(--color-text-secondary)',
            lineHeight: '1.45',
            background: 'rgba(245, 158, 11, 0.08)',
            padding: '8px 10px',
            borderRadius: 'var(--radius-sm)',
            borderLeft: '3px solid var(--color-accent-amber)',
          }}
          data-cy="hint-content"
        >
          {hintText}
        </div>
      )}
    </div>
  );
};
