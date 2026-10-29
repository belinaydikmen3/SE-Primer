describe('01 - Başlangıç ve Kişiselleştirme Akışı', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Başlangıç ekranını açar ve 3 kişiselleştirme sorusunu görüntüler', () => {
    cy.get('[data-cy="onboarding-screen"]').should('be.visible');
    cy.contains('08:00 Krizine Hazır mısın?').should('be.visible');

    // 1. Soru: Seviye
    cy.contains('1. Deneyim Seviyen').should('be.visible');
    cy.get('[data-cy="level-junior"]').should('be.visible');
    cy.get('[data-cy="level-mid"]').should('be.visible');
    cy.get('[data-cy="level-senior"]').should('be.visible');

    // 2. Soru: Rol
    cy.contains('2. Mühendislik Rolün').should('be.visible');
    cy.get('[data-cy="role-developer"]').should('be.visible');
    cy.get('[data-cy="role-qa"]').should('be.visible');
    cy.get('[data-cy="role-devops"]').should('be.visible');

    // 3. Soru: Hedef
    cy.contains('3. Öncelikli Öğrenme Hedefin').should('be.visible');
    cy.get('[data-cy="goal-technical"]').should('be.visible');
    cy.get('[data-cy="goal-testing"]').should('be.visible');
    cy.get('[data-cy="goal-security"]').should('be.visible');

    cy.get('[data-cy="start-crisis-btn"]').should('be.visible');
  });

  it('Kişiselleştirme seçimlerini günceller ve krizi başlatır', () => {
    // Rolü Test Mühendisi, Hedefi Test ve Kalite, Seviyeyi Deneyimli seç
    cy.get('[data-cy="level-senior"]').click().should('have.class', 'selected');
    cy.get('[data-cy="role-qa"]').click().should('have.class', 'selected');
    cy.get('[data-cy="goal-testing"]').click().should('have.class', 'selected');

    // Krize müdahale et butonuna bas
    cy.get('[data-cy="start-crisis-btn"]').click();

    // Kriz ekranına geçildiğini doğrula
    cy.get('[data-cy="crisis-screen"]').should('be.visible');
    cy.get('[data-cy="header-incident-badge"]').should('contain.text', '08:00 Kriz');
    cy.get('[data-cy="role-perspective-banner"]')
      .should('contain.text', 'Test Mühendisi Gözüyle')
      .and('contain.text', 'Hızlı doğrulama');
  });
});
