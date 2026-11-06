import React from 'react';
import type { ExperienceLevel, LearningGoal, Role, UserProfile } from '../types';

interface OnboardingScreenProps {
  profile: UserProfile;
  sessionId: string;
  dataCollectionEnabled: boolean;
  onProfileChange: (updated: UserProfile) => void;
  onToggleDataCollection: (enabled: boolean) => void;
  onStartCrisis: () => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
  profile,
  sessionId,
  dataCollectionEnabled,
  onProfileChange,
  onToggleDataCollection,
  onStartCrisis,
}) => {
  const setLevel = (level: ExperienceLevel) => onProfileChange({ ...profile, level });
  const setRole = (role: Role) => onProfileChange({ ...profile, role });
  const setGoal = (goal: LearningGoal) => onProfileChange({ ...profile, goal });

  return (
    <div className="screen-container" data-cy="onboarding-screen">
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
          <span
            className="brand-badge"
            style={{ background: 'rgba(139, 92, 246, 0.2)', color: '#c4b5fd', borderColor: '#8b5cf6' }}
            data-cy="onboarding-v2-badge"
          >
            The Primer v2 · ML Kişiselleştirme
          </span>
        </div>
        <h1 className="title-lg" style={{ marginBottom: '6px' }}>
          08:00 Krizine Hazır mısın?
        </h1>
        <p className="subtitle-sm">
          Hastane randevu sistemi çöktü. 300 hasta bekliyor. Mühendislik profilini seç, krizi yönet ve kararlarının teknik sonuçlarını deneyimle.
        </p>
      </div>

      {/* Soru 1: Deneyim Seviyesi */}
      <div className="card">
        <div className="card-title">
          <span>1. Deneyim Seviyen</span>
        </div>
        <div className="chip-grid">
          <button
            type="button"
            className={`chip-btn ${profile.level === 'junior' ? 'selected' : ''}`}
            onClick={() => setLevel('junior')}
            data-cy="level-junior"
          >
            <div className="chip-header">
              <span>🌱 Yeni Başladım</span>
              {profile.level === 'junior' && <span>✓</span>}
            </div>
            <div className="chip-desc">Her kararda açıklayıcı mimari ipuçları otomatik olarak açıktır.</div>
          </button>

          <button
            type="button"
            className={`chip-btn ${profile.level === 'mid' ? 'selected' : ''}`}
            onClick={() => setLevel('mid')}
            data-cy="level-mid"
          >
            <div className="chip-header">
              <span>⚡ Orta Seviyedeyim</span>
              {profile.level === 'mid' && <span>✓</span>}
            </div>
            <div className="chip-desc">İpuçları gizlidir; sadece ihtiyaç duyduğunda talep edebilirsin.</div>
          </button>

          <button
            type="button"
            className={`chip-btn ${profile.level === 'senior' ? 'selected' : ''}`}
            onClick={() => setLevel('senior')}
            data-cy="level-senior"
          >
            <div className="chip-header">
              <span>🔥 Deneyimliyim</span>
              {profile.level === 'senior' && <span>✓</span>}
            </div>
            <div className="chip-desc">Gerçek kriz ortamı: Her karar için 60 saniyelik süre baskısı uygulanır.</div>
          </button>
        </div>
      </div>

      {/* Soru 2: Rol */}
      <div className="card">
        <div className="card-title">
          <span>2. Mühendislik Rolün</span>
        </div>
        <div className="chip-grid">
          <button
            type="button"
            className={`chip-btn ${profile.role === 'developer' ? 'selected' : ''}`}
            onClick={() => setRole('developer')}
            data-cy="role-developer"
          >
            <div className="chip-header">
              <span>💻 Yazılım Geliştirici</span>
              {profile.role === 'developer' && <span>✓</span>}
            </div>
            <div className="chip-desc">Kod kalitesi, rollback stratejisi ve geriye dönük uyumluluk odağı.</div>
          </button>

          <button
            type="button"
            className={`chip-btn ${profile.role === 'qa' ? 'selected' : ''}`}
            onClick={() => setRole('qa')}
            data-cy="role-qa"
          >
            <div className="chip-header">
              <span>🧪 Test & Kalite Mühendisi</span>
              {profile.role === 'qa' && <span>✓</span>}
            </div>
            <div className="chip-desc">Kritik duman testleri, regresyon riski ve yayın güvenliği odağı.</div>
          </button>

          <button
            type="button"
            className={`chip-btn ${profile.role === 'devops' ? 'selected' : ''}`}
            onClick={() => setRole('devops')}
            data-cy="role-devops"
          >
            <div className="chip-header">
              <span>⚙️ Sistem & DevOps / SRE</span>
              {profile.role === 'devops' && <span>✓</span>}
            </div>
            <div className="chip-desc">Bağlantı havuzu, servis sürekliliği ve altyapı dayanıklılığı odağı.</div>
          </button>
        </div>
      </div>

      {/* Soru 3: Öğrenme Hedefi */}
      <div className="card">
        <div className="card-title">
          <span>3. Öncelikli Öğrenme Hedefin</span>
        </div>
        <div className="chip-grid">
          <button
            type="button"
            className={`chip-btn ${profile.goal === 'technical' ? 'selected' : ''}`}
            onClick={() => setGoal('technical')}
            data-cy="goal-technical"
          >
            <div className="chip-header">
              <span>🏛️ Teknik & Mimari Kararlar</span>
              {profile.goal === 'technical' && <span>✓</span>}
            </div>
            <div className="chip-desc">Rollback vs Hotfix mimari ödünleşimlerini (trade-offs) öğrenmek.</div>
          </button>

          <button
            type="button"
            className={`chip-btn ${profile.goal === 'testing' ? 'selected' : ''}`}
            onClick={() => setGoal('testing')}
            data-cy="goal-testing"
          >
            <div className="chip-header">
              <span>✅ Test ve Yayın Kalitesi</span>
              {profile.goal === 'testing' && <span>✓</span>}
            </div>
            <div className="chip-desc">Kriz anında duman testi (smoke test) ile zaman dengesini kurmak.</div>
          </button>

          <button
            type="button"
            className={`chip-btn ${profile.goal === 'security' ? 'selected' : ''}`}
            onClick={() => setGoal('security')}
            data-cy="goal-security"
          >
            <div className="chip-header">
              <span>🛡️ Güvenlik, Gizlilik & KVKK</span>
              {profile.goal === 'security' && <span>✓</span>}
            </div>
            <div className="chip-desc">Kişisel sağlık verilerinin korunması ve log maskeleme kuralları.</div>
          </button>
        </div>
      </div>

      {/* Veri Toplama Modu ve Kullanıcı Onayı */}
      <div
        className="card"
        style={{
          background: 'rgba(30, 41, 59, 0.5)',
          border: '1px dashed var(--color-border-subtle)',
          padding: '10px 14px',
        }}
        data-cy="data-collection-card"
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
              📊 Anonim Veri Toplama Modu (KVKK Uyumlu)
            </span>
            <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
              Oturum No: <code data-cy="session-id-display">{sessionId}</code> — Sıfır kişisel veri (PII).
            </div>
          </div>
          <button
            type="button"
            className={`chip-btn ${dataCollectionEnabled ? 'selected' : ''}`}
            style={{ width: 'auto', padding: '4px 10px', minHeight: '30px' }}
            onClick={() => onToggleDataCollection(!dataCollectionEnabled)}
            data-cy="data-collection-toggle"
          >
            {dataCollectionEnabled ? '✓ Açık' : 'Kapalı'}
          </button>
        </div>
        <p style={{ fontSize: '10px', color: 'var(--color-text-muted)', marginTop: '6px' }}>
          * Karar süreleriniz ve seçim değişiklikleriniz yapay zeka modelini geliştirmek için anonim kaydedilir. Oturum sonunda CSV olarak dışa aktarabilirsiniz.
        </p>
      </div>

      <button
        type="button"
        className="btn-primary"
        onClick={onStartCrisis}
        data-cy="start-crisis-btn"
        style={{ marginTop: '4px' }}
      >
        Krize Müdahale Et →
      </button>
    </div>
  );
};
