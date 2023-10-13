describe("Home", () => {
    afterEach(() => {
        cy.cleanupUser();
    });

    it("should redirect to login if not signed in", () => {
        cy.then(() => ({ email: "" })).as("user");
        cy.visit("/")
        cy.location("pathname").should("eq", "/login")
    })

    it("should allow to visit the home page", () => {
        cy.visit("/")

        cy.login().then((user) => {

            cy.visitAndCheck("/")
            cy.findByRole("link", { name: /Add Keplr Address/i }).click()
            cy.location("pathname").should("eq", "/profile")
        })

    })




});
