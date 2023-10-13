describe("Profile", () => {
    afterEach(() => {
        cy.cleanupUser();
    });

    it("should redirect to login if not signed in", () => {
        cy.then(() => ({ email: "" })).as("user");
        cy.visit("/profile")
        cy.location("pathname").should("eq", "/login")
    })

    it("should allow to visit the profile page", () => {
        cy.visit("/")

        cy.login().then((user) => {

            cy.visitAndCheck("/profile")
            const email = (user as { email?: string }).email;
            cy.findByRole("textbox", { name: /email/i }).should("have.value", email);
        })

    })

    it("should allow to click on link keplr", () => {
        cy.visit("/")

        const stub = cy.stub()

        cy.on('window:alert', stub)

        cy.login().then((user) => {
            cy.visitAndCheck("/profile")
            cy.findByRole('button', { name: /Link Keplr/i }).click().then(() => {
                expect(stub.getCall(0)).to.be.calledWith('Keplr not exists')
            })
        })
    })

    it("profile link in header should take you to profile page", () => {
        cy.visit("/")

        cy.login().then((user) => {
            cy.visitAndCheck("/")
            cy.get("#profile").click();
            cy.findByRole("menuitem", { name: /profile/i }).click();
            cy.location("pathname").should("eq", "/profile")
        })
    })


});
