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

  // Teste 1:Listagem de livros
  it('Deve listar todos os livros', async () => {
    const mockBooks = [
      { id: 1, title: 'Livro 1', author: 'Autor 1' },
      { id: 2, title: 'Livro 2', author: 'Autor 2' }
    ];

    Book.findAll = jest.fn().mockResolvedValue(mockBooks);

    await bookController.getAllBooks(req, res);

    expect(Book.findAll).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(mockBooks);
  });

  // Teste 2:  Seed de livros
  it('Deve adicionar livros via seed', async () => {
    Book.bulkCreate = jest.fn().mockResolvedValue([]);

    await bookController.seedBooks(req, res);

    expect(Book.bulkCreate).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Livros adicionados com sucesso!",
        count: expect.any(Number)
      })
    );
  });

  // Teste 3:Atualização de livro com sucesso
  it('Deve atualizar um livro existente com sucesso', async () => {
    const mockBook = {
      id: 1,
      title: 'Livro Antigo',
      author: 'Autor Antigo',
      update: jest.fn().mockResolvedValue({
        id: 1,
        title: 'Livro Atualizado',
        author: 'Autor Atualizado',
        genre: 'Ficção',
        isbn: '1234567890',
        status: 'available'
      })
    };

    req.params = { id: '1' };
    req.body = {
      title: 'Livro Atualizado',
      author: 'Autor Atualizado',
      genre: 'Ficção',
      isbn: '1234567890',
      status: 'available'
    };

    Book.findByPk = jest.fn().mockResolvedValue(mockBook);

    await bookController.updateBook(req, res);

    expect(Book.findByPk).toHaveBeenCalledWith('1');
    expect(mockBook.update).toHaveBeenCalledWith({
      title: 'Livro Atualizado',
      author: 'Autor Atualizado',
      genre: 'Ficção',
      isbn: '1234567890',
      status: 'available'
    });
    expect(res.json).toHaveBeenCalled();
  });

  // Teste 4: Erro ao tentar atualizar livro inexistente
  it('Deve retornar erro 404 ao tentar atualizar livro não encontrado', async () => {
    req.params = { id: '999' };
    req.body = { title: 'Título Atualizado' };

    Book.findByPk = jest.fn().mockResolvedValue(null);

    await bookController.updateBook(req, res);

    expect(Book.findByPk).toHaveBeenCalledWith('999');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ 
      error: 'Livro não encontrado' 
    });
  });

  // Teste 5: Exclusão de livro com sucesso
  it('Deve deletar um livro existente com sucesso', async () => {
    const mockBook = {
      id: 1,
      title: 'Livro para Deletar',
      destroy: jest.fn().mockResolvedValue(true)
    };

    req.params = { id: '1' };

    Book.findByPk = jest.fn().mockResolvedValue(mockBook);

    await bookController.deleteBook(req, res);

    expect(Book.findByPk).toHaveBeenCalledWith('1');
    expect(mockBook.destroy).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ 
      message: 'Livro deletado com sucesso' 
    });
  });

  // Teste 6: Erro ao tentar deletar livro inexistente
  it('Deve retornar erro 404 ao tentar deletar livro não encontrado', async () => {
    req.params = { id: '999' };

    Book.findByPk = jest.fn().mockResolvedValue(null);

    await bookController.deleteBook(req, res);

    expect(Book.findByPk).toHaveBeenCalledWith('999');
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ 
      error: 'Livro não encontrado' 
    });
  });

  // Teste 7: Erro no servidor durante listagem
  it('Deve retornar erro 500 quando falhar ao listar livros', async () => {
    Book.findAll = jest.fn().mockRejectedValue(
      new Error('Erro de conexão com o banco')
    );

    await bookController.getAllBooks(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ 
      error: 'Erro de conexão com o banco' 
    });
  });

  // Teste 8: Erro no servidor durante seed
  it('Deve retornar erro 500 quando falhar ao adicionar livros via seed', async () => {
    Book.bulkCreate = jest.fn().mockRejectedValue(
      new Error('Erro ao inserir dados')
    );

    await bookController.seedBooks(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ 
      error: 'Erro ao inserir dados' 
    });
  });
});