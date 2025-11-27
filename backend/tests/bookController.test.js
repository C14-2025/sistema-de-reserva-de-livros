const bookController = require("../controllers/bookController");

// Mock das dependências
jest.mock("../models", () => ({
  Book: {
    findAndCountAll: jest.fn(),
    create: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn()
  },
  sequelize: {
    Op: {
      like: 'LIKE',
      or: 'OR'
    }
  }
}));

const { Book } = require("../models");

describe("BookController", () => {
  let req, res;

  beforeEach(() => {
    req = {
      query: {},
      params: {},
      body: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  test("Deve listar todos os livros", async () => {
    // Arrange
    const mockBooks = {
      rows: [
        { id: 1, title: "Dom Casmurro", author: "Machado de Assis", status: "available" }
      ],
      count: 1
    };

    Book.findAndCountAll.mockResolvedValue(mockBooks);

    // Act
    await bookController.getAllBooks(req, res);

    // Assert
    expect(Book.findAndCountAll).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({
      books: mockBooks.rows,
      totalPages: 1,
      currentPage: 1,
      totalBooks: 1
    });
  });

  test("Deve criar um novo livro", async () => {
    // Arrange
    req.body = {
      title: "Novo Livro",
      author: "Novo Autor",
      genre: "Ficção",
      isbn: "123456789"
    };

    const mockBook = {
      id: 1,
      ...req.body,
      status: "available"
    };

    Book.create.mockResolvedValue(mockBook);

    // Act
    await bookController.createBook(req, res);

    // Assert
    expect(Book.create).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockBook);
  });});
