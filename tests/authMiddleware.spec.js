const request = require("supertest");
const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const { generateToken } = require("../middlewares/auth");

const app = express();

app.use(authMiddleware);

app.get("/api/users", (req, res) => {
  res.json({ message: "Authenticated" });
});

describe("Auth Middleware", () => {
  it("should allow access with a valid token", async () => {
    // Créez un token valide pour le test
    const validToken = generateToken("1234");

    const response = await request(app)
      .get("/api/users")
      .set("Authorization", `Bearer ${validToken}`);

      expect(response.body.message).toBe("Authenticated");
    expect(response.status).toBe(200);
    
  });

  it("should return 401 with an invalid token", async () => {
    // Utilisez un token invalide ou incorrect ici
    const invalidToken = "invalid-token";

    const response = await request(app)
      .get("/api/users")
      .set("Authorization", `Bearer ${invalidToken}`);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid token");
  });

  it("should return 401 with missing token", async () => {
    const response = await request(app).get("/api/users");

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Required authentication");
  });
});
