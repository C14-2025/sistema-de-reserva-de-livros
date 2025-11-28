const { Book } = require('../models');

const bookController = {
  async getAllBooks(req, res) {
    try {
      const books = await Book.findAll();
      res.json(books);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async seedBooks(req, res) {
    try {
      const booksToAdd = [
        { title: "Dom Casmurro", author: "Machado de Assis", genre: "Romance", cover: "/image/livro-azul.png" },
        { title: "1984", author: "George Orwell", genre: "Ficção Científica", cover: "/image/livro-laranja.png" },
        { title: "O Hobbit", author: "J.R.R. Tolkien", genre: "Fantasia", cover: "/image/livro-vermelho.png" },
        { title: "Orgulho e Preconceito", author: "Jane Austen", genre: "Romance", cover: "/image/livro-azul.png" },
        { title: "O Pequeno Príncipe", author: "Antoine de Saint-Exupéry", genre: "Infantil", cover: "/image/livro-laranja.png" },
        { title: "Harry Potter e a Pedra Filosofal", author: "J.K. Rowling", genre: "Fantasia", cover: "/image/livro-vermelho.png" },
        { title: "O Senhor dos Anéis", author: "J.R.R. Tolkien", genre: "Fantasia", cover: "/image/livro-azul.png" },
        { title: "Jogos Vorazes", author: "Suzanne Collins", genre: "Distopia", cover: "/image/livro-laranja.png" },
        { title: "A Revolução dos Bichos", author: "George Orwell", genre: "Fábula", cover: "/image/livro-vermelho.png" },
      ];

      await Book.bulkCreate(booksToAdd);
      res.json({ message: "Livros adicionados com sucesso!", count: booksToAdd.length });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async updateBook(req, res) {
    try {
      const { id } = req.params;
      const { title, author, genre, isbn, status } = req.body;
      
      const book = await Book.findByPk(id);
      if (!book) {
        return res.status(404).json({ error: 'Livro não encontrado' });
      }
      
      await book.update({ title, author, genre, isbn, status });
      res.json(book);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async deleteBook(req, res) {
    try {
      const { id } = req.params;
      
      const book = await Book.findByPk(id);
      if (!book) {
        return res.status(404).json({ error: 'Livro não encontrado' });
      }
      
      await book.destroy();
      res.json({ message: 'Livro deletado com sucesso' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};

module.exports = bookController;