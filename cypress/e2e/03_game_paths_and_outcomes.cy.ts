describe('03 - Oyun Dallanmaları, İki Farklı Son ve Neden-Sonuç Kartları', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Başarılı Sona (Son A) eksiksiz ulaşır ve 3 kararın neden-sonuç açıklamalarını doğrular', () => {
    cy.get('[data-cy="start-crisis-btn"]').click();

    // KARAR 1: Mimari -> A (Rollback)
    cy.get('[data-cy="decision-phase-title"]').should('contain.text', 'KARAR 1');
    cy.get('[data-cy="option-a"]').click();

    // Neden-Sonuç Kartı
    cy.get('[data-cy="consequence-card"]').should('be.visible');
    cy.get('[data-cy="consequence-text"]').should('contain.text', 'v2.3.9');
    cy.get('[data-cy="justification-text"]').should('contain.text', 'Fail-safe rollback');
    cy.get('[data-cy="consequence-next-btn"]').click();

    // KARAR 2: Test -> A (Duman Testi)
    cy.get('[data-cy="decision-phase-title"]').should('contain.text', 'KARAR 2');
    cy.get('[data-cy="option-a"]').click();

    cy.get('[data-cy="consequence-card"]').should('be.visible');
    cy.get('[data-cy="consequence-text"]').should('contain.text', '10 dakikalık');
    cy.get('[data-cy="consequence-next-btn"]').click();

    // KARAR 3: KVKK -> A (Maskeleme)
    cy.get('[data-cy="decision-phase-title"]').should('contain.text', 'KARAR 3');
    cy.get('[data-cy="decision-log-snippet"]').should('be.visible');
    cy.get('[data-cy="option-a"]').click();

    cy.get('[data-cy="consequence-card"]').should('be.visible');
    cy.get('[data-cy="consequence-text"]').should('contain.text', 'maskelendi');
    cy.get('[data-cy="consequence-next-btn"]').click();

    // SONUÇ EKRANI: SON A
    cy.get('[data-cy="outcome-screen"]').should('be.visible');
    cy.get('[data-cy="outcome-badge"]').should('contain.text', 'SON A · BAŞARILI KRİZ YÖNETİMİ');
    cy.get('[data-cy="outcome-title"]').should('contain.text', '08:25 — Sistem Ayakta, Veri Güvende');
    cy.get('[data-cy="metric-kvkk"]').should('contain.text', 'Tam Uyumlu');

    // 3 Kararın dökümünü kontrol et
    cy.get('[data-cy="review-step-arch"]').should('contain.text', 'Seçim: A');
    cy.get('[data-cy="review-step-test"]').should('contain.text', 'Seçim: A');
    cy.get('[data-cy="review-step-privacy"]').should('contain.text', 'Seçim: A');
  });

  it('Olumsuz Sona (Son B) ulaşır ve KVKK ihlalini raporlar', () => {
    cy.get('[data-cy="start-crisis-btn"]').click();

    // KARAR 1 -> B (Canlıda Yama)
    cy.get('[data-cy="option-b"]').click();
    cy.get('[data-cy="consequence-next-btn"]').click();

    // KARAR 2 -> B (Testleri Atla)
    cy.get('[data-cy="option-b"]').click();
    cy.get('[data-cy="consequence-next-btn"]').click();

    // KARAR 3 -> B (Ham Log Paylaşımı / KVKK İhlali)
    cy.get('[data-cy="option-b"]').click();
    cy.get('[data-cy="consequence-next-btn"]').click();

    // SONUÇ EKRANI: SON B
    cy.get('[data-cy="outcome-screen"]').should('be.visible');
    cy.get('[data-cy="outcome-badge"]').should('contain.text', 'SON B · OLUMSUZ SONUÇ');
    cy.get('[data-cy="outcome-title"]').should('contain.text', 'KVKK İhlali');
    cy.get('[data-cy="metric-kvkk"]').should('contain.text', 'AĞIR İHLAL');
  });

  it('Yeniden başlatma butonu tüm durumu temizler ve Ekran 1e döner', () => {
    cy.get('[data-cy="start-crisis-btn"]').click();
    cy.get('[data-cy="option-a"]').click();
    cy.get('[data-cy="consequence-next-btn"]').click();
    cy.get('[data-cy="option-a"]').click();
    cy.get('[data-cy="consequence-next-btn"]').click();
    cy.get('[data-cy="option-a"]').click();
    cy.get('[data-cy="consequence-next-btn"]').click();

    // Sonuç ekranındayken yeniden başlata bas
    cy.get('[data-cy="outcome-screen"]').should('be.visible');
    cy.get('[data-cy="restart-btn"]').click();

    // Ekran 1 (Onboarding) yüklenmiş olmalı
    cy.get('[data-cy="onboarding-screen"]').should('be.visible');
    cy.get('[data-cy="outcome-screen"]').should('not.exist');
  });

  it('Tekrarlı ardışık tıklamalarda yarış durumu (race condition) oluşmaz ve buton kilitlenir', () => {
    cy.get('[data-cy="start-crisis-btn"]').click();

    // İlk tıklama yapıldığında buton anında disabled durumuna geçmelidir
    cy.get('[data-cy="option-a"]').click();
    cy.get('[data-cy="option-a"]').should('be.disabled');

    // Yalnızca tek bir consequence modal açılmalıdır
    cy.get('[data-cy="consequence-card"]').should('have.length', 1);
  });
});
