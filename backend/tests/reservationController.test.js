const reservationController = require("../controllers/reservationController");

describe("ReservationController", () => {
  test("Deve criar uma nova reserva", async () => {
    const req = {
      body: { userId: 1, bookId: 2, date: "2025-10-10" },
    };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

    await reservationController.createReservation(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
  });

  test("Deve listar reservas existentes", async () => {
    const req = {};
    const res = { json: jest.fn() };

    await reservationController.getReservations(req, res);
    expect(res.json).toHaveBeenCalled();
  });
});
