const request = require("supertest");
const app = require("../src/app");

jest.mock("../src/config/prisma", () => ({
  user: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
  },
}));

jest.mock("../src/config/swagger", () => ({}));

const prisma = require("../src/config/prisma");

describe("GET /users", () => {
  it("retourne la liste des utilisateurs", async () => {
    prisma.user.findMany.mockResolvedValue([
      { id: 1, first_name: "Marie", email: "marie@test.com" },
    ]);

    const res = await request(app).get("/users");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty("email");
  });
});

describe("POST /users", () => {
  it("crée un utilisateur", async () => {
    prisma.user.create.mockResolvedValue({
      id: 2,
      first_name: "Paul",
      last_name: "Martin",
      email: "paul@test.com",
    });

    const res = await request(app).post("/users").send({
      first_name: "Paul",
      last_name: "Martin",
      email: "paul@test.com",
      password: "secret",
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id");
  });
});
