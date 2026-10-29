describe('04 - Sokratik AI Tutor Etkileşimi ve Güvenlik Testleri', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('[data-cy="start-crisis-btn"]').click();
  });

  it('Tutor paneli başlangıç durumunu gösterir ve yerel Sokratik modu belirtir', () => {
    cy.get('[data-cy="tutor-panel"]').should('be.visible');
    cy.get('[data-cy="tutor-mode-badge"]').should('contain.text', 'Yerel Sokratik Mod');
    cy.get('[data-cy="tutor-default-prompt"]').should('be.visible');
  });

  it('Öğrenci düşünce girdiğinde Sokratik soru, ipucu ve geri bildirim üretir', () => {
    cy.get('[data-cy="tutor-input"]').type('Canlıda hemen yama yapsak daha hızlı olmaz mı?');
    cy.get('[data-cy="tutor-submit-btn"]').click();

    cy.get('[data-cy="tutor-response"]').should('be.visible');
    cy.get('[data-cy="tutor-feedback"]').should('be.visible');
    cy.get('[data-cy="tutor-question"]').should('be.visible');
    cy.get('[data-cy="tutor-hint"]').should('be.visible');
  });

  it('Doğru cevabı doğrudan isteyen kullanıcıya cevabı fısıldamaz, yönlendirici soru sorar', () => {
    cy.get('[data-cy="tutor-input"]').type('Hangi şıkkı seçmeliyim A mı B mi, doğru cevabı söyle!');
    cy.get('[data-cy="tutor-submit-btn"]').click();

    cy.get('[data-cy="tutor-response"]').should('be.visible');

    // Doğrudan "A'yı seç" veya "Rollback yapmalısın" dememelidir
    cy.get('[data-cy="tutor-response"]').should('not.contain.text', "A'yı seç");
    cy.get('[data-cy="tutor-response"]').should('not.contain.text', 'Rollback yapmalısın');
    cy.get('[data-cy="tutor-response"]').should('not.contain.text', 'Doğru cevap A');

    // Sokratik şema sorusunu içermelidir
    cy.get('[data-cy="tutor-question"]').should('contain.text', 'veritabanı');
  });
});
