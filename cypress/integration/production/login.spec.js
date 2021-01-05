describe('Login', function () {

  it('should sign in', function () {
    cy.visit("http://localhost:4200/");
    cy.get('#inputName').type("TestName");
    cy.get('#signin-button').click();
    cy.contains('Vítej ve hře, TestName!').should('be.visible');
    // first question loads
    cy.contains('Vítej ve hře, TestName!').should('not.be.visible');
  });
});
