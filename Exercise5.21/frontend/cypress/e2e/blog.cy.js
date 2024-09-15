describe('Blog app', function() {
  beforeEach(function() {
    cy.visit('http://localhost:5173')
    cy.wait(2000)
  })

  it('User can log in and delete a blog', function() {
    cy.get('input[name="userName"]', { timeout: 10000 }).type('mluukkai')
    cy.get('input[name="password"]', { timeout: 10000 }).type('password')
    cy.get('button[type="submit"]').should('be.visible').click()

    cy.contains('Matti Luukkainen logged in')

    cy.contains('Things I Don\'t Know as of 2018 Dan Abramov')
      .parent()
      .find('button')
      .contains('view')
      .click()

    cy.contains('Things I Don\'t Know as of 2018 Dan Abramov')
      .parent().parent()
      .find('button')
      .contains('remove')
      .click()

    cy.contains('Things I Don\'t Know as of 2018 Dan Abramov').should('not.exist')
  })
})
