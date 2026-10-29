import React, { useState } from 'react';
import type { TutorMessage } from '../types';

interface TutorPanelProps {
  messages: TutorMessage[];
  isLoading: boolean;
  onSendMessage: (query: string) => Promise<void>;
  apiKey?: string;
  onApiKeyChange?: (key: string) => void;
}

export const TutorPanel: React.FC<TutorPanelProps> = ({
  messages,
  isLoading,
  onSendMessage,
  apiKey,
  onApiKeyChange,
}) => {
  const [inputText, setInputText] = useState('');
  const [showConfig, setShowConfig] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    const text = inputText;
    setInputText('');
    await onSendMessage(text);
  };

  const latestMessage = messages.length > 0 ? messages[messages.length - 1] : null;

  return (
    <div className="tutor-drawer" data-cy="tutor-panel">
      <div className="tutor-header">
        <div className="tutor-title">
          <span>🤖</span>
          <span>Sokratik AI Tutor</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {latestMessage?.isFallback !== false ? (
            <span
              className="tutor-fallback-badge"
              title="API anahtarı girilmediğinde kural tabanlı deterministik Sokratik mod çalışır."
              data-cy="tutor-mode-badge"
            >
              Yerel Sokratik Mod
            </span>
          ) : (
            <span
              className="brand-badge"
              style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.3)' }}
              data-cy="tutor-mode-badge"
            >
              Canlı Gemini 1.5 Flash
            </span>
          )}

          <button
            type="button"
            className="btn-secondary"
            style={{ minHeight: '24px', padding: '1px 6px', fontSize: '10px', width: 'auto' }}
            onClick={() => setShowConfig(!showConfig)}
            title="Gemini API Anahtarı Ayarı"
            data-cy="tutor-config-toggle"
          >
            ⚙️ API
          </button>
        </div>
      </div>

      {showConfig && onApiKeyChange && (
        <div
          style={{
            background: 'var(--color-bg-base)',
            padding: '8px 10px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--color-border-subtle)',
            fontSize: '11px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
          }}
          data-cy="tutor-config-panel"
        >
          <label style={{ color: 'var(--color-text-secondary)', fontWeight: 600 }}>
            Google Gemini API Anahtarı (Opsiyonel):
          </label>
          <input
            type="password"
            placeholder="AI Studio anahtarınızı buraya yapıştırabilirsiniz..."
            value={apiKey || ''}
            onChange={(e) => onApiKeyChange(e.target.value)}
            className="tutor-input"
            style={{ fontSize: '11px', padding: '6px 8px' }}
            data-cy="gemini-api-key-input"
          />
          <span style={{ color: 'var(--color-text-muted)', fontSize: '10px' }}>
            * Anahtar girilmezse yerel ve deterministik Sokratik kural motoru devrededir. Anahtar yalnızca tarayıcı oturumunda tutulur.
          </span>
        </div>
      )}

      {/* Latest Tutor Response */}
      {latestMessage && latestMessage.tutorData && (
        <div className="tutor-card-body" data-cy="tutor-response">
          {latestMessage.tutorData.feedback && (
            <div className="tutor-feedback-box" data-cy="tutor-feedback">
              <strong>Değerlendirme:</strong> {latestMessage.tutorData.feedback}
            </div>
          )}

          {latestMessage.tutorData.question && (
            <div className="tutor-question-box" data-cy="tutor-question">
              <strong>Düşünme Sorusu:</strong> {latestMessage.tutorData.question}
            </div>
          )}

          {latestMessage.tutorData.hint && (
            <div className="tutor-hint-box" data-cy="tutor-hint">
              <strong>Teknik İpucu:</strong> {latestMessage.tutorData.hint}
            </div>
          )}
        </div>
      )}

      {!latestMessage && (
        <div className="tutor-card-body" data-cy="tutor-default-prompt">
          <div className="tutor-question-box">
            <strong>Kıdemli Mimar Sorusu:</strong> Doğru cevabı fısıldamam; ancak mühendislik takasını (trade-off) görmene yardımcı olurum. Ne yapmayı planlıyorsun?
          </div>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="tutor-input-row">
        <input
          type="text"
          className="tutor-input"
          placeholder="Düşünceni veya sorunu buraya yaz..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          disabled={isLoading}
          data-cy="tutor-input"
        />
        <button
          type="submit"
          className="tutor-submit-btn"
          disabled={isLoading || !inputText.trim()}
          data-cy="tutor-submit-btn"
        >
          {isLoading ? '...' : 'Danış'}
        </button>
      </form>
    </div>
  );
};
