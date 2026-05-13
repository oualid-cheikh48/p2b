const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../src/app");

jest.mock("../src/config/prisma", () => ({
  property: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  user: { findUnique: jest.fn() },
}));

jest.mock("../src/config/swagger", () => ({}));

const prisma = require("../src/config/prisma");

process.env.JWT_SECRET = "test_secret";
const validToken = jwt.sign({ id: 1, email: "host@test.com" }, "test_secret");

const mockProperty = {
  id: 1,
  title: "Appartement Paris",
  description: "Bel appart",
  price_per_night: 85.0,
  max_guests: 4,
  owner_id: 1,
};

describe("GET /properties", () => {
  it("retourne la liste des logements", async () => {
    prisma.property.findMany.mockResolvedValue([mockProperty]);

    const res = await request(app).get("/properties");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});

describe("GET /properties/:id", () => {
  it("retourne un logement par son ID", async () => {
    prisma.property.findUnique.mockResolvedValue(mockProperty);

    const res = await request(app).get("/properties/1");

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty("title");
  });

  it("retourne 404 si logement introuvable", async () => {
    prisma.property.findUnique.mockResolvedValue(null);

    const res = await request(app).get("/properties/999");

    expect(res.status).toBe(404);
  });
});

describe("POST /properties", () => {
  it("refuse sans token JWT (401)", async () => {
    const res = await request(app).post("/properties").send(mockProperty);
    expect(res.status).toBe(401);
  });

  it("crée un logement avec token valide", async () => {
    prisma.property.create.mockResolvedValue(mockProperty);

    const res = await request(app)
      .post("/properties")
      .set("authorization", validToken)
      .send(mockProperty);

    expect(res.status).toBe(201);
    expect(res.body.data).toHaveProperty("title");
  });
});

describe("PUT /properties/:id", () => {
  it("refuse sans token JWT (401)", async () => {
    const res = await request(app)
      .put("/properties/1")
      .send({ title: "Modifié" });
    expect(res.status).toBe(401);
  });

  it("met à jour un logement avec token valide", async () => {
    prisma.property.update.mockResolvedValue({ ...mockProperty, title: "Modifié" });

    const res = await request(app)
      .put("/properties/1")
      .set("authorization", validToken)
      .send({ title: "Modifié" });

    expect(res.status).toBe(200);
    expect(res.body.data.title).toBe("Modifié");
  });
});

describe("DELETE /properties/:id", () => {
  it("refuse sans token JWT (401)", async () => {
    const res = await request(app).delete("/properties/1");
    expect(res.status).toBe(401);
  });

  it("supprime un logement avec token valide", async () => {
    prisma.property.delete.mockResolvedValue(mockProperty);

    const res = await request(app)
      .delete("/properties/1")
      .set("authorization", validToken);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Property deleted successfully");
  });
});
