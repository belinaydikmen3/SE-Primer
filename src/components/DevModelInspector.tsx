import React, { useState } from 'react';
import type { BehavioralMetrics, ModelPrediction } from '../types';
import { runInferenceVector, FEATURE_ORDER } from '../services/onnxService';

interface DevModelInspectorProps {
  prediction: ModelPrediction | null;
  metrics: BehavioralMetrics | null;
  isOpen: boolean;
  onClose: () => void;
  onManualPredict?: (customProb: number) => void;
}

export const DevModelInspector: React.FC<DevModelInspectorProps> = ({
  prediction,
  metrics,
  isOpen,
  onClose,
}) => {
  const [testVectorInput, setTestVectorInput] = useState<string>('');
  const [testResultProb, setTestResultProb] = useState<number | null>(null);
  const [testResultLabel, setTestResultLabel] = useState<number | null>(null);

  if (!isOpen) return null;

  const currentProb = testResultProb !== null ? testResultProb : (prediction?.probability ?? 0.0);

  const handleRunCustomVector = async () => {
    try {
      const parts = testVectorInput.split(',').map((s) => parseFloat(s.trim()));
      if (parts.length === 8 && parts.every((n) => !isNaN(n))) {
        const res = await runInferenceVector(parts);
        setTestResultProb(res.probability);
        setTestResultLabel(res.label);
      } else {
        alert('Lütfen virgülle ayrılmış tam 8 adet sayısal özellik girin.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleResetToLive = () => {
    setTestResultProb(null);
    setTestResultLabel(null);
    setTestVectorInput('');
  };

  return (
    <div className="dev-modal-overlay" data-cy="dev-inspector-modal">
      <div className="dev-modal-content">
        <div className="dev-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '14px' }}>🔬</span>
            <span style={{ fontWeight: 700, fontSize: '13px', color: '#f1f5f9' }}>
              The Primer v2 — ML Model & Parite Denetleyicisi
            </span>
          </div>
          <button
            type="button"
            className="btn-secondary"
            style={{ width: 'auto', minHeight: '24px', padding: '2px 8px', fontSize: '11px' }}
            onClick={onClose}
            data-cy="dev-inspector-close-btn"
          >
            ✕ Kapat
          </button>
        </div>

        <div className="dev-info-grid">
          <div className="dev-metric-item">
            <span className="dev-metric-label">Model Sürümü:</span>
            <span className="dev-metric-value" data-cy="dev-model-version">v2.0 (DecisionTree)</span>
          </div>
          <div className="dev-metric-item">
            <span className="dev-metric-label">Çalışma Katmanı:</span>
            <span className="dev-metric-value" data-cy="dev-model-source">
              {prediction?.source === 'onnx' ? '✓ onnxruntime-web (WASM)' : '⚠️ Yedek Sezgisel Mod'}
            </span>
          </div>
          <div className="dev-metric-item">
            <span className="dev-metric-label">Karar Eşiği (Threshold):</span>
            <span className="dev-metric-value">0.50</span>
          </div>
          <div className="dev-metric-item" style={{ background: 'rgba(139, 92, 246, 0.15)', borderColor: 'rgba(139, 92, 246, 0.4)' }}>
            <span className="dev-metric-label" style={{ color: '#c4b5fd', fontWeight: 700 }}>
              Pozitif Sınıf Olasılığı (p):
            </span>
            <span
              className="dev-metric-value"
              style={{ color: '#a78bfa', fontSize: '16px', fontWeight: 800, fontFamily: 'var(--font-family-mono)' }}
              data-cy="p"
            >
              {currentProb.toFixed(6)}
            </span>
          </div>
        </div>

        <div style={{ marginTop: '12px' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
            Canlı Davranışsal Özellik Vektörü (8 Değişken):
          </div>
          <div className="dev-features-table" data-cy="dev-live-features">
            {FEATURE_ORDER.map((fname, idx) => (
              <div key={fname} className="dev-feature-row">
                <span className="dev-feat-name">{idx + 1}. {fname}:</span>
                <span className="dev-feat-val" data-cy={`feat-${fname}`}>
                  {metrics ? metrics[fname] : '-'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Python Diferansiyel Parite Test Paneli */}
        <div style={{ marginTop: '14px', borderTop: '1px solid var(--color-border-subtle)', paddingTop: '10px' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: '#93c5fd', marginBottom: '4px' }}>
            Python Oracle Diferansiyel Vektör Testi:
          </div>
          <p style={{ fontSize: '10px', color: 'var(--color-text-muted)', marginBottom: '6px' }}>
            tests/parite.json dosyasındaki 8 elemanlı vektörü buraya yapıştırıp tarayıcı çıkarımını sınayın:
          </p>
          <div style={{ display: 'flex', gap: '6px' }}>
            <input
              type="text"
              placeholder="Örn: 45.0, 3.0, 0.0, 45.0, 0.7, 0.0, 0.0, 0.33"
              value={testVectorInput}
              onChange={(e) => setTestVectorInput(e.target.value)}
              className="tutor-input"
              style={{ fontSize: '11px', padding: '4px 8px' }}
              data-cy="parity-test-vector-input"
            />
            <button
              type="button"
              className="btn-primary"
              style={{ width: 'auto', minHeight: '30px', fontSize: '11px', padding: '4px 10px' }}
              onClick={handleRunCustomVector}
              data-cy="run-parity-vector-btn"
            >
              Çalıştır
            </button>
            {testResultProb !== null && (
              <button
                type="button"
                className="btn-secondary"
                style={{ width: 'auto', minHeight: '30px', fontSize: '11px', padding: '4px 8px' }}
                onClick={handleResetToLive}
                data-cy="reset-parity-btn"
              >
                Canlıya Dön
              </button>
            )}
          </div>
          {testResultProb !== null && (
            <div style={{ marginTop: '6px', fontSize: '11px', color: '#10b981' }} data-cy="parity-result-badge">
              ✓ Çıkarım Tamamlandı: Tahmin Edilen Label = {testResultLabel}, p = {testResultProb.toFixed(6)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

