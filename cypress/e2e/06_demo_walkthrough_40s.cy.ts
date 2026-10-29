describe('SE Primer - 40 Saniyelik Kriz Simülasyonu Demo Video Kaydı', () => {
  it('00:00 - 00:40: Baştan Sona Kriz Simülasyonu, Sokratik AI Tutor ve Son A Başarılı Bitiş', () => {
    // 1. Sahne (0-5 sn): Başlangıç Ekranı ve Kriz Çağrısı
    cy.viewport(390, 844); // iPhone 14/15/16 boyutu
    cy.visit('/');
    cy.get('[data-cy="onboarding-screen"]').should('be.visible');
    cy.wait(3000);

    // 2. Sahne (5-10 sn): Kişiselleştirme Seçimleri
    // Deneyimli Seviye (60s sayaç), Geliştirici Rolü, Mimari Hedef
    cy.get('[data-cy="level-senior"]').click();
    cy.wait(1000);
    cy.get('[data-cy="role-developer"]').click();
    cy.wait(1000);
    cy.get('[data-cy="goal-technical"]').click();
    cy.wait(1500);

    // Krize Müdahale Et
    cy.get('[data-cy="start-crisis-btn"]').click();
    cy.get('[data-cy="crisis-screen"]').should('be.visible');
    cy.wait(2000);

    // 3. Sahne (10-18 sn): Kriz Ekranı & Sokratik AI Tutor ile Etkileşim
    // 08:00 Kriz rozeti ve 60s sayaç görünür
    cy.get('[data-cy="header-incident-badge"]').should('be.visible');
    cy.get('[data-cy="header-timer"]').should('be.visible');

    // Sokratik AI Tutor'a soru sor
    cy.get('[data-cy="tutor-input"]').type('Canlı sunucuda anlık yama (hotfix) yapsak olmaz mı?');
    cy.wait(1500);
    cy.get('[data-cy="tutor-submit-btn"]').click();
    cy.get('[data-cy="tutor-response"]').should('be.visible');
    cy.wait(3000);

    // 4. Sahne (18-24 sn): Karar 1 - Mimari Rollback ve Neden-Sonuç Analizi
    cy.get('[data-cy="option-a"]').click();
    cy.get('[data-cy="consequence-card"]').should('be.visible');
    cy.wait(3000);
    cy.get('[data-cy="consequence-next-btn"]').click();

    // 5. Sahne (24-30 sn): Karar 2 - Test ve Duman Testi Analizi
    cy.get('[data-cy="decision-phase-title"]').should('contain.text', 'KARAR 2');
    cy.wait(1500);
    cy.get('[data-cy="option-a"]').click();
    cy.get('[data-cy="consequence-card"]').should('be.visible');
    cy.wait(3000);
    cy.get('[data-cy="consequence-next-btn"]').click();

    // 6. Sahne (30-36 sn): Karar 3 - KVKK & Log Maskeleme
    cy.get('[data-cy="decision-phase-title"]').should('contain.text', 'KARAR 3');
    cy.get('[data-cy="decision-log-snippet"]').should('be.visible');
    cy.wait(1500);
    cy.get('[data-cy="option-a"]').click();
    cy.get('[data-cy="consequence-card"]').should('be.visible');
    cy.wait(3000);
    cy.get('[data-cy="consequence-next-btn"]').click();

    // 7. Sahne (36-40 sn): Sonuç Ekranı (Son A: Başarılı Kriz Yönetimi)
    cy.get('[data-cy="outcome-screen"]').should('be.visible');
    cy.get('[data-cy="outcome-title"]').should('contain.text', '08:25 — Sistem Ayakta, Veri Güvende');
    cy.get('[data-cy="outcome-metrics"]').should('be.visible');
    cy.wait(4000);
  });
});
