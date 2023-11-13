/// <reference types="cypress" />

describe('The site works', () => {
  it('Shows the home page', () => {
    cy.visit('http://localhost:3000');

    cy.contains('p', 'Get started by editing');
  });
});