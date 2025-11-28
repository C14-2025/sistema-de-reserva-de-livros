const { Book } = require('../models');
const bookController = require('../controllers/bookController');

jest.mock('../models');

describe('BookController', () => {
  let req, res;

  beforeEach(() => {
    req = {
      query: {},
      body: {},
      params: {}
    };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };
    jest.clearAllMocks();
  });

  it('Deve listar todos os livros', async () => {
    const mockBooks = {
      rows: [
        { id: 1, title: 'Livro 1', author: 'Autor 1' },
        { id: 2, title: 'Livro 2', author: 'Autor 2' }
      ],
      count: 2
    };

    Book.findAll = jest.fn().mockResolvedValue(mockBooks.rows);
    Book.count = jest.fn().mockResolvedValue(mockBooks.count);

    await bookController.getAllBooks(req, res);

    expect(res.json).toHaveBeenCalled();
  });

  it('Deve adicionar livros via seed', async () => {
    Book.bulkCreate = jest.fn().mockResolvedValue([]);
    Book.count = jest.fn().mockResolvedValue(0);

    await bookController.seedBooks(req, res);

    expect(res.json).toHaveBeenCalled();
  });
});