const request = require("supertest");
const app = require("../src/app");

jest.mock("../src/config/prisma", () => ({
  user: {
    create: jest.fn(),
    findUnique: jest.fn(),
  },
}));

jest.mock("../src/config/swagger", () => ({}));

const prisma = require("../src/config/prisma");
const bcrypt = require("bcrypt");

process.env.JWT_SECRET = "test_secret";

describe("POST /auth/register", () => {
  it("crée un utilisateur et retourne 201", async () => {
    prisma.user.create.mockResolvedValue({
      id: 1,
      first_name: "Jean",
      last_name: "Dupont",
      email: "jean@test.com",
    });

    const res = await request(app).post("/auth/register").send({
      first_name: "Jean",
      last_name: "Dupont",
      email: "jean@test.com",
      password: "motdepasse123",
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("email", "jean@test.com");
  });

  it("retourne 500 si erreur DB", async () => {
    prisma.user.create.mockRejectedValue(new Error("DB error"));

    const res = await request(app).post("/auth/register").send({
      first_name: "Test",
      last_name: "User",
      email: "test@test.com",
      password: "pass",
    });

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty("error");
  });
});

describe("POST /auth/login", () => {
  it("retourne un token JWT si identifiants valides", async () => {
    const hash = await bcrypt.hash("motdepasse123", 10);
    prisma.user.findUnique.mockResolvedValue({
      id: 1,
      email: "jean@test.com",
      password_hash: hash,
    });

    const res = await request(app).post("/auth/login").send({
      email: "jean@test.com",
      password: "motdepasse123",
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  it("retourne 401 si utilisateur introuvable", async () => {
    prisma.user.findUnique.mockResolvedValue(null);

    const res = await request(app).post("/auth/login").send({
      email: "inconnu@test.com",
      password: "mauvais",
    });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("error");
  });

  it("retourne 401 si mot de passe incorrect", async () => {
    const hash = await bcrypt.hash("correct", 10);
    prisma.user.findUnique.mockResolvedValue({
      id: 1,
      email: "jean@test.com",
      password_hash: hash,
    });

    const res = await request(app).post("/auth/login").send({
      email: "jean@test.com",
      password: "mauvais",
    });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("error");
  });
});
