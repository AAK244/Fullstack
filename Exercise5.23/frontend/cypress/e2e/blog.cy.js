describe('Blog app', function () {
  beforeEach(function () {
    cy.visit('http://localhost:5173');
    cy.get('input[name="userName"]').type('mluukkai');
    cy.get('input[name="password"]').type('password');
    cy.get('button[type="submit"]').click();
    cy.wait(2000); 
  });

  it('Blogs are ordered by likes with the most liked blog first', function () {
    cy.contains('Microservices and the First Law of Distributed Objects Martin Fowler')
      .parent().parent()
      .find('button')
      .contains('view')
      .click();

    cy.contains('Things I Don\'t Know as of 2018 Dan Abramov')
      .parent().parent()
      .find('button')
      .contains('view')
      .click();

    cy.contains('Things I Don\'t Know as of 2018 Dan Abramov')
      .parent().parent()
      .find('button')
      .contains('like')
      .click();
    cy.wait(500);

    cy.contains('Things I Don\'t Know as of 2018 Dan Abramov')
      .parent().parent()
      .find('button')
      .contains('like')
      .click();
    cy.wait(500);

    cy.get('div')
      .eq(0)
      .should('contain', 'Things I Don\'t Know as of 2018 Dan Abramov');

    cy.get('div')
      .eq(1)
      .should('contain', 'Microservices and the First Law of Distributed Objects Martin Fowler');
  });
});
