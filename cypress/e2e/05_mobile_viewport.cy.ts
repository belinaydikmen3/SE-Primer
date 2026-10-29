describe('05 - Mobil Ekran ve Sıfır Yatay Kaydırma Testleri', () => {
  const viewports: [number, number, string][] = [
    [375, 667, 'iPhone SE'],
    [390, 844, 'iPhone 14/15/16'],
    [412, 915, 'Pixel 7 / Android'],
  ];

  viewports.forEach(([width, height, deviceName]) => {
    it(`${deviceName} (${width}x${height}) ekranında yatay kaydırma olmadan oynanabilir`, () => {
      cy.viewport(width, height);
      cy.visit('/');

      // Yatay kaydırma kontrolü (scrollWidth <= clientWidth)
      cy.window().then((win) => {
        const body = win.document.body;
        expect(body.scrollWidth).to.be.at.most(width + 2);
      });

      // Krizi başlat
      cy.get('[data-cy="start-crisis-btn"]').click();
      cy.get('[data-cy="crisis-screen"]').should('be.visible');

      // Yatay taşma olmadığını tekrar teyit et
      cy.window().then((win) => {
        const body = win.document.body;
        expect(body.scrollWidth).to.be.at.most(width + 2);
      });

      // 3 adımı tamamla
      cy.get('[data-cy="option-a"]').click();
      cy.get('[data-cy="consequence-next-btn"]').click();

      cy.get('[data-cy="option-a"]').click();
      cy.get('[data-cy="consequence-next-btn"]').click();

      cy.get('[data-cy="option-a"]').click();
      cy.get('[data-cy="consequence-next-btn"]').click();

      // Sonuç ekranı
      cy.get('[data-cy="outcome-screen"]').should('be.visible');
      cy.window().then((win) => {
        const body = win.document.body;
        expect(body.scrollWidth).to.be.at.most(width + 2);
      });
    });
  });
});
