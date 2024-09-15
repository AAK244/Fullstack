describe('Blog app', function () {
  beforeEach(function () {
    cy.visit('http://localhost:5173');
    cy.get('input[name="userName"]').type('mluukkai');
    cy.get('input[name="password"]').type('password');
    cy.get('button[type="submit"]').click();
    cy.wait(2000); 
  });

  it('Only the creator can see the delete button', function () {
    cy.contains('Create New Blog').click();
    cy.wait(2000); 
    cy.get('form').within(() => {
      cy.get('input').eq(0).type('Cypress Test Blog');
      cy.get('input').eq(1).type('Test Author');
      cy.get('input').eq(2).type('http://testurl.com');
    });
    cy.contains('Create').click({ force: true });
    cy.wait(1000);
    cy.contains('Things I Don\'t Know as of 2018').parent().find('button').contains('view').click();
    cy.contains('Matti Luukkainen').should('exist');
    cy.contains('logout').click();
    cy.get('input[name="userName"]').type('differentuser');
    cy.get('input[name="password"]').type('salasana');
    cy.get('button[type="submit"]').click();
    cy.contains('Things I Don\'t Know as of 2018').parent().find('button').contains('view').click();
    cy.contains('button', 'remove').should('not.exist');
  });
});
