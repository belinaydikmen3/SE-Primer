import React from 'react';
import type { ChoiceId, DecisionId, OutcomeDetail, UserProfile } from '../types';
import { DECISION_STEPS } from '../scenario/data';

interface OutcomeScreenProps {
  outcome: OutcomeDetail;
  choices: Partial<Record<DecisionId, ChoiceId>>;
  profile: UserProfile;
  onRestart: () => void;
}

export const OutcomeScreen: React.FC<OutcomeScreenProps> = ({
  outcome,
  choices,
  profile,
  onRestart,
}) => {
  const isSuccess = outcome.type === 'outcome_a';

  return (
    <div className="screen-container" data-cy="outcome-screen">
      {/* Banner */}
      <div
        className={`outcome-banner ${isSuccess ? 'success' : 'failure'}`}
        data-cy="outcome-banner"
      >
        <span
          className="brand-badge"
          style={{
            background: isSuccess ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
            color: isSuccess ? 'var(--color-accent-green)' : 'var(--color-accent-red)',
            borderColor: isSuccess ? 'var(--color-accent-green)' : 'var(--color-accent-red)',
          }}
          data-cy="outcome-badge"
        >
          {outcome.badge}
        </span>

        <h1 className="title-lg" data-cy="outcome-title" style={{ fontSize: '20px' }}>
          {outcome.title}
        </h1>

        <p className="subtitle-sm" data-cy="outcome-summary" style={{ textAlign: 'center' }}>
          {outcome.summary}
        </p>
      </div>

      {/* Operasyonel Metrikler */}
      <div className="card" data-cy="outcome-metrics">
        <div className="card-title">
          <span>📊 Kriz Yönetim Metrikleri</span>
        </div>
        <div className="metrics-grid">
          <div className="metric-card">
            <span className="metric-label">Kurtarma Süresi</span>
            <span className="metric-val" data-cy="metric-recovery">{outcome.metrics.recoveryTime}</span>
          </div>
          <div className="metric-card">
            <span className="metric-label">Veri Kaybı</span>
            <span className="metric-val" data-cy="metric-dataloss">{outcome.metrics.dataLoss}</span>
          </div>
          <div className="metric-card">
            <span className="metric-label">KVKK Uyumu</span>
            <span
              className="metric-val"
              style={{ color: isSuccess ? 'var(--color-accent-green)' : 'var(--color-accent-red)' }}
              data-cy="metric-kvkk"
            >
              {outcome.metrics.kvkkStatus}
            </span>
          </div>
          <div className="metric-card">
            <span className="metric-label">Erişilebilirlik</span>
            <span className="metric-val" data-cy="metric-availability">{outcome.metrics.availability}</span>
          </div>
        </div>
      </div>

      {/* 3 Kararın Karşılaştırmalı Dökümü */}
      <div className="card" data-cy="outcome-decisions-review">
        <div className="card-title">
          <span>📝 Karar Geçmişi & Teknik Analiz</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {DECISION_STEPS.map((step) => {
            const chosenId = choices[step.id];
            const chosenOption = chosenId ? step.options[chosenId] : null;

            return (
              <div key={step.id} className="review-item" data-cy={`review-step-${step.id}`}>
                <div className="review-header">
                  <span>{step.phaseTitle}</span>
                  <span
                    style={{
                      color: chosenOption?.isRecommended
                        ? 'var(--color-accent-green)'
                        : 'var(--color-accent-red)',
                    }}
                  >
                    {chosenId ? `Seçim: ${chosenId}` : 'Seçilmedi'}
                  </span>
                </div>

                {chosenOption ? (
                  <>
                    <div className="review-choice">{chosenOption.title}</div>
                    <div className="review-justification">
                      <strong>Teknik Gerekçe:</strong> {chosenOption.justification}
                    </div>
                  </>
                ) : (
                  <div className="review-justification" style={{ color: 'var(--color-accent-amber)' }}>
                    Zaman aşımı nedeniyle otomatik işlendi.
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Eğitsel Tavsiye */}
      <div
        style={{
          background: 'rgba(139, 92, 246, 0.08)',
          border: '1px solid rgba(139, 92, 246, 0.25)',
          borderRadius: 'var(--radius-md)',
          padding: '12px 14px',
          fontSize: '13px',
          color: '#ddd6fe',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
        }}
        data-cy="outcome-recommendation"
      >
        <strong style={{ color: '#c4b5fd' }}>
          💡 Sokratik AI Tutor Değerlendirmesi ({profile.role.toUpperCase()} / {profile.level.toUpperCase()}):
        </strong>
        <div>{outcome.recommendation}</div>
      </div>

      {/* Yeniden Başlat CTA */}
      <button
        type="button"
        className="btn-primary"
        onClick={onRestart}
        data-cy="restart-btn"
        style={{ marginTop: '8px' }}
      >
        🔄 Simülasyonu Yeniden Başlat
      </button>
    </div>
  );
};
