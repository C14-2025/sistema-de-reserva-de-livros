const bookController = require("../controllers/bookController");

describe("BookController", () => {
  test("Deve listar todos os livros", async () => {
    const req = {};
    const res = { json: jest.fn() };

    await bookController.getAllBooks(req, res);
    expect(res.json).toHaveBeenCalled();
  });

  test("Deve adicionar um novo livro", async () => {
    const req = {
      body: { title: "Dom Casmurro", author: "Machado de Assis", year: 1899 },
    };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

    await bookController.addBook(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
  });
});