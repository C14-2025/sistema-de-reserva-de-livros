const reservationController = require("../controllers/reservationController");

// Mock das dependências
jest.mock("../models", () => ({
  Reservation: {
    create: jest.fn(),
    findAll: jest.fn(),
    findByPk: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn()
  },
  Book: {
    findByPk: jest.fn(),
    update: jest.fn()
  },
  User: {
    findByPk: jest.fn()
  }
}));

const { Reservation, Book } = require("../models");

describe("ReservationController", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      user: { id: 1, role: "user" }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  test("Deve criar uma nova reserva", async () => {
    // Arrange
    req.body = { bookId: 1 };

    const mockBook = {
      id: 1,
      title: "Livro Teste",
      status: "available",
      update: jest.fn()
    };

    const mockReservation = {
      id: 1,
      userId: 1,
      bookId: 1,
      status: "active"
    };

    Book.findByPk.mockResolvedValue(mockBook);
    Reservation.findOne.mockResolvedValue(null);
    Reservation.create.mockResolvedValue(mockReservation);
    Reservation.findByPk.mockResolvedValue({
      ...mockReservation,
      Book: mockBook,
      User: { id: 1, name: "Test User" }
    });

    // Act
    await reservationController.createReservation(req, res);

    // Assert
    expect(Book.findByPk).toHaveBeenCalledWith(1);
    expect(Reservation.create).toHaveBeenCalledWith({
      userId: 1,
      bookId: 1
    });
    expect(res.status).toHaveBeenCalledWith(201);
  });

  test("Deve listar reservas do usuário", async () => {
    // Arrange
    const mockReservations = [
      {
        id: 1,
        userId: 1,
        bookId: 1,
        Book: { id: 1, title: "Livro Teste" }
      }
    ];

    Reservation.findAll.mockResolvedValue(mockReservations);

    // Act
    await reservationController.getUserReservations(req, res);

    // Assert
    expect(Reservation.findAll).toHaveBeenCalledWith({
      where: { userId: 1 },
      include: [{
        model: Book,
        attributes: ['id', 'title', 'author', 'genre', 'status']
      }],
      order: [['reservationDate', 'DESC']]
    });
    expect(res.json).toHaveBeenCalledWith(mockReservations);
  });
});