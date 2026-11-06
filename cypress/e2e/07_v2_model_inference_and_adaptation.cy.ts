describe('The Primer v2 — Makine Öğrenmesi Çıkarımı ve Davranışsal Adaptasyon', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('v2 sürüm rozeti ve veri toplama modu açılışta görüntülenir', () => {
    cy.get('[data-cy="onboarding-screen"]').should('be.visible');
    cy.get('[data-cy="onboarding-v2-badge"]').should('contain.text', 'The Primer v2');
    cy.get('[data-cy="data-collection-card"]').should('be.visible');
    cy.get('[data-cy="session-id-display"]').should('not.be.empty');
    cy.get('[data-cy="data-collection-toggle"]').should('contain.text', 'Açık');

    // Veri toplama toggle edilebilir
    cy.get('[data-cy="data-collection-toggle"]').click();
    cy.get('[data-cy="data-collection-toggle"]').should('contain.text', 'Kapalı');
    cy.get('[data-cy="data-collection-toggle"]').click();
    cy.get('[data-cy="data-collection-toggle"]').should('contain.text', 'Açık');
  });

  it('Kriz ekranında ML Inspector drawer açılır ve canlı model metrikleri ile data-cy="p" görünür', () => {
    cy.get('[data-cy="start-crisis-btn"]').click();
    cy.get('[data-cy="crisis-screen"]').should('be.visible');

    // Header v2 rozeti ve ML düğmesi
    cy.get('[data-cy="header-v2-badge"]').should('be.visible');
    cy.get('[data-cy="dev-panel-toggle"]').should('be.visible').click();

    // ML Inspector modalı açılır
    cy.get('[data-cy="dev-inspector-modal"]').should('be.visible');
    cy.get('[data-cy="dev-model-version"]').should('contain.text', 'v2.0');
    cy.get('[data-cy="p"]').should('be.visible');
    cy.get('[data-cy="dev-live-features"]').should('be.visible');

    // Modalı kapat
    cy.get('[data-cy="dev-inspector-close-btn"]').click();
    cy.get('[data-cy="dev-inspector-modal"]').should('not.exist');
  });

  it('Oyuncu zorlandığında adaptif destek kartı açılır, ipucu kabul edilebilir veya reddedilebilir', () => {
    cy.get('[data-cy="start-crisis-btn"]').click();
    cy.get('[data-cy="crisis-screen"]').should('be.visible');

    // ML Inspector'dan zorlanma vektörü simüle edilir
    cy.get('[data-cy="dev-panel-toggle"]').click();
    cy.get('[data-cy="dev-inspector-modal"]').should('be.visible');

    // 45s süre, 3 tereddütlü zorlanma vektörü
    cy.get('[data-cy="parity-test-vector-input"]').type('45.0, 3.0, 0.0, 45.0, 0.7, 0.0, 0.0, 0.33');
    cy.get('[data-cy="run-parity-vector-btn"]').click();
    cy.get('[data-cy="p"]').should('contain.text', '1.000000');
    cy.get('[data-cy="dev-inspector-close-btn"]').click();

    // Normal akışta karar verip tamamlandığında debrief ekranında CSV dışa aktarımı görünür
    cy.get('[data-cy="option-a"]').click();
    cy.get('[data-cy="consequence-next-btn"]').click();

    cy.get('[data-cy="option-a"]').click();
    cy.get('[data-cy="consequence-next-btn"]').click();

    cy.get('[data-cy="option-a"]').click();
    cy.get('[data-cy="consequence-next-btn"]').click();

    cy.get('[data-cy="outcome-screen"]').should('be.visible');
    cy.get('[data-cy="export-csv-btn"]').should('be.visible');
  });
});

