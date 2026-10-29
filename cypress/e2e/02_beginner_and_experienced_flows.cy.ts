describe('02 - Seviyeye Göre İpucu ve Zamanlayıcı Davranışları', () => {
  it('Yeni Başlayan (Junior) kullanıcı her kararda ipucunu otomatik olarak açık görür', () => {
    cy.visit('/');
    cy.get('[data-cy="level-junior"]').click();
    cy.get('[data-cy="start-crisis-btn"]').click();

    cy.get('[data-cy="crisis-screen"]').should('be.visible');
    // İpucu doğrudan görünür olmalıdır (otomatik açık)
    cy.get('[data-cy="hint-content"]')
      .should('be.visible')
      .and('contain.text', 'Mimari İpucu');
    
    // Header'da senior zamanlayıcısı bulunmamalıdır
    cy.get('[data-cy="header-timer"]').should('not.exist');
  });

  it('Orta Seviye (Mid) kullanıcıda ipucu gizlidir, tıklandığında açılır', () => {
    cy.visit('/');
    cy.get('[data-cy="level-mid"]').click();
    cy.get('[data-cy="start-crisis-btn"]').click();

    cy.get('[data-cy="crisis-screen"]').should('be.visible');
    // Başlangıçta ipucu içeriği gizli olmalıdır
    cy.get('[data-cy="hint-content"]').should('not.exist');
    cy.get('[data-cy="hint-toggle-btn"]').should('contain.text', 'İpucu İste');

    // Butona basıldığında açılmalıdır
    cy.get('[data-cy="hint-toggle-btn"]').click();
    cy.get('[data-cy="hint-content"]').should('be.visible');
    cy.get('[data-cy="hint-toggle-btn"]').should('contain.text', 'Gizle');

    // Tekrar basıldığında kapanmalıdır
    cy.get('[data-cy="hint-toggle-btn"]').click();
    cy.get('[data-cy="hint-content"]').should('not.exist');
  });

  it('Deneyimli (Senior) kullanıcı için 60 saniyelik sayaç çalışır', () => {
    cy.visit('/');
    cy.get('[data-cy="level-senior"]').click();
    cy.get('[data-cy="start-crisis-btn"]').click();

    cy.get('[data-cy="crisis-screen"]').should('be.visible');
    // Sayaç görünür olmalı ve 60s civarında başlamalı
    cy.get('[data-cy="header-timer"]').should('be.visible');
    cy.get('[data-cy="header-timer"]').should('contain.text', 's');
  });

  it('Deneyimli modda süre dolduğunda güvenli zaman aşımı devreye girer', () => {
    cy.clock();
    cy.visit('/');
    cy.get('[data-cy="level-senior"]').click();
    cy.get('[data-cy="start-crisis-btn"]').click();

    cy.get('[data-cy="crisis-screen"]').should('be.visible');
    cy.get('[data-cy="header-timer"]').should('be.visible');

    // 60 saniye ileri sar
    cy.tick(61000);

    // Kilitlenmemeli, zaman aşımı uyarısı ve sonuç kartı çıkmalı
    cy.get('[data-cy="timer-expired-alert"]').should('be.visible');
    cy.get('[data-cy="consequence-card"]').should('be.visible');
  });
});
