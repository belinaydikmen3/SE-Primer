describe('The Primer v2 — Python Oracle ve Tarayıcı Diferansiyel Parite Testi', () => {
  it('tests/parite.json referans vakaları için Python ve tarayıcı olasılık farkı < 1e-4 olmalıdır', () => {
    cy.readFile('tests/parite.json').then((parityData: {
      model_version: string;
      parity_tolerance: number;
      cases: Array<{
        id: string;
        description: string;
        vector: number[];
        predicted_label: number;
        positive_probability: number;
      }>;
    }) => {
      expect(parityData.cases).to.have.length.at.least(5);
      const tolerance = parityData.parity_tolerance || 1e-4;

      cy.visit('/');
      cy.get('[data-cy="start-crisis-btn"]').click();
      cy.get('[data-cy="crisis-screen"]').should('be.visible');

      // Dev ML Inspector drawer'ını aç
      cy.get('[data-cy="dev-panel-toggle"]').click();
      cy.get('[data-cy="dev-inspector-modal"]').should('be.visible');

      // Her bir referans vaka için diferansiyel parite testi
      parityData.cases.forEach((c) => {
        const vectorStr = c.vector.join(', ');
        const pythonProb = c.positive_probability;

        cy.log(`Parite Sınaması: ${c.id} (${c.description}) -> Beklenen p: ${pythonProb}`);

        cy.get('[data-cy="parity-test-vector-input"]').clear().type(vectorStr);
        cy.get('[data-cy="run-parity-vector-btn"]').click();

        // Cypress should() otomatik yeniden deneme (retry) ile async çıkarımın tamamlanmasını bekler
        cy.get('[data-cy="p"]').should(($el) => {
          const browserProb = parseFloat($el.text().trim());
          const diff = Math.abs(pythonProb - browserProb);
          expect(diff, `Vaka ${c.id} parite toleransı < ${tolerance} olmalı`).to.be.lessThan(tolerance);
        });
      });
    });
  });
});
