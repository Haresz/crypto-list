describe('Home', () => {
  it('menampilkan judul aplikasi', () => {
    cy.visit('/')
    cy.contains('ion-title', 'Cryptocurrency')
  })
})
