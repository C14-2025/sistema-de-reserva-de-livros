const { Reservation, Book, User } = require('../models');

const reservationController = {
  // Criar reserva (usuário comum)
  async createReservation(req, res) {
    try {
      const { bookId } = req.body;
      const userId = req.user.id;
      
      // Verificar se livro existe
      const book = await Book.findByPk(bookId);
      if (!book) {
        return res.status(404).json({ error: 'Livro não encontrado' });
      }
      
      // Verificar se livro está disponível
      if (book.status !== 'available') {
        return res.status(400).json({ error: 'Livro não está disponível para reserva' });
      }
      
      // Verificar se usuário já tem reserva ativa para este livro
      const existingReservation = await Reservation.findOne({
        where: {
          userId,
          bookId,
          status: 'active'
        }
      });
      
      if (existingReservation) {
        return res.status(400).json({ error: 'Você já tem uma reserva ativa para este livro' });
      }
      
      // Criar reserva
      const reservation = await Reservation.create({
        userId,
        bookId
      });
      
      // Atualizar status do livro para "reserved"
      await book.update({ status: 'reserved' });
      
      // Retornar reserva com dados do livro
      const reservationWithDetails = await Reservation.findByPk(reservation.id, {
        include: [
          {
            model: Book,
            attributes: ['id', 'title', 'author', 'genre']
          },
          {
            model: User,
            attributes: ['id', 'name', 'email']
          }
        ]
      });
      
      res.status(201).json(reservationWithDetails);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Listar reservas do usuário logado
  async getUserReservations(req, res) {
    try {
      const userId = req.user.id;
      
      const reservations = await Reservation.findAll({
        where: { userId },
        include: [
          {
            model: Book,
            attributes: ['id', 'title', 'author', 'genre', 'status']
          }
        ],
        order: [['reservationDate', 'DESC']]
      });
      
      res.json(reservations);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Listar todas as reservas (apenas admin)
  async getAllReservations(req, res) {
    try {
      const reservations = await Reservation.findAll({
        include: [
          {
            model: Book,
            attributes: ['id', 'title', 'author', 'genre']
          },
          {
            model: User,
            attributes: ['id', 'name', 'email']
          }
        ],
        order: [['reservationDate', 'DESC']]
      });
      
      res.json(reservations);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Cancelar reserva (usuário cancela própria reserva)
  async cancelReservation(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      
      const reservation = await Reservation.findByPk(id, {
        include: [Book]
      });
      
      if (!reservation) {
        return res.status(404).json({ error: 'Reserva não encontrada' });
      }
      
      // Verificar se o usuário é o dono da reserva ou admin
      if (reservation.userId !== userId && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Você só pode cancelar suas próprias reservas' });
      }
      
      if (reservation.status === 'cancelled') {
        return res.status(400).json({ error: 'Reserva já está cancelada' });
      }
      
      // Cancelar reserva
      await reservation.update({ status: 'cancelled' });
      
      // Liberar livro (voltar para disponível)
      await Book.update(
        { status: 'available' },
        { where: { id: reservation.bookId } }
      );
      
      res.json({ message: 'Reserva cancelada com sucesso', reservation });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Obter reserva por ID
  async getReservationById(req, res) {
    try {
      const { id } = req.params;
      
      const reservation = await Reservation.findByPk(id, {
        include: [
          {
            model: Book,
            attributes: ['id', 'title', 'author', 'genre']
          },
          {
            model: User,
            attributes: ['id', 'name', 'email']
          }
        ]
      });
      
      if (!reservation) {
        return res.status(404).json({ error: 'Reserva não encontrada' });
      }
      
      res.json(reservation);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};

module.exports = reservationController;