const { Book, Reservation } = require('../models');

const bookController = {
  async getAllBooks(req, res) {
    try {
      const { page = 1, limit = 10, search, status } = req.query;
      const offset = (page - 1) * limit;
      
      let where = {};
      
      if (search) {
        where = {
          [Op.or]: [
            { title: { [Op.like]: `%${search}%` } },
            { author: { [Op.like]: `%${search}%` } },
            { genre: { [Op.like]: `%${search}%` } }
          ]
        };
      }
      
      if (status) {
        where.status = status;
      }
      
      const books = await Book.findAndCountAll({
        where,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['title', 'ASC']]
      });
      
      res.json({
        books: books.rows,
        totalPages: Math.ceil(books.count / limit),
        currentPage: parseInt(page),
        totalBooks: books.count
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async createBook(req, res) {
    try {
      const { title, author, genre, isbn } = req.body;
      const book = await Book.create({ title, author, genre, isbn });
      res.status(201).json(book);
    } catch (error) {
      res.status(400).json({ error: error.message });
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