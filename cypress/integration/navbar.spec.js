describe("Navbar Test", () => {
  it("should load the navbar and links correctly", () => {
    cy.visit("http://localhost:3000"); // Adjust if using Vite or another port

    cy.contains("New Task").should("be.visible");
    cy.contains("My Projects").should("be.visible");
    cy.contains("Dashboard").should("be.visible");
    cy.contains("Calendar").should("be.visible");
    cy.contains("Login | Register").should("be.visible");
  });
});
