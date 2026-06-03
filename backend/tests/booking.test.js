const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../src/app");

jest.mock("../src/config/prisma", () => ({
  booking: {
    findMany: jest.fn(),
    create: jest.fn(),
  },
  user: { findUnique: jest.fn() },
}));

jest.mock("../src/config/swagger", () => ({}));

const prisma = require("../src/config/prisma");

process.env.JWT_SECRET = "test_secret";
const validToken = jwt.sign({ id: 1, email: "guest@test.com" }, "test_secret");

const mockBooking = {
  id: 1,
  guest_id: 1,
  property_id: 2,
  start_date: "2025-07-01",
  end_date: "2025-07-07",
  total_price: 595.0,
  booking_status: "pending",
};

describe("GET /bookings", () => {
  it("retourne la liste des réservations", async () => {
    prisma.booking.findMany.mockResolvedValue([mockBooking]);

    const res = await request(app).get("/bookings");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});

describe("POST /bookings", () => {
  it("refuse sans token JWT (401)", async () => {
    const res = await request(app).post("/bookings").send(mockBooking);
    expect(res.status).toBe(401);
  });

  it("crée une réservation avec token valide", async () => {
    prisma.booking.create.mockResolvedValue(mockBooking);

    const res = await request(app)
      .post("/bookings")
      .set("authorization", validToken)
      .send(mockBooking);

    expect(res.status).toBe(201);
    expect(res.body.data).toHaveProperty("booking_status", "pending");
  });

  it("retourne 500 si données invalides", async () => {
    prisma.booking.create.mockRejectedValue(new Error("Validation error"));

    const res = await request(app)
      .post("/bookings")
      .set("authorization", validToken)
      .send({ guest_id: 1 });

    expect(res.status).toBe(500);
  });
});
