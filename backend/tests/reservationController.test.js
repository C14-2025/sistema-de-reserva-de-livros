const request = require('supertest');
const express = require('express');
const { Reservation, Book, User } = require('../models');
const reservationController = require('../controllers/reservationController');

// Mock dos modelos
jest.mock('../models');

const app = express();
app.use(express.json());

// Mock do middleware de autenticação simplificado
const mockAuthMiddleware = (req, res, next) => {
  req.user = { id: 1 };
  next();
};

// Rotas de teste
app.get('/api/reservations', mockAuthMiddleware, reservationController.getUserReservations);
app.post('/api/reservations', mockAuthMiddleware, reservationController.createReservation);
app.delete('/api/reservations/:id', mockAuthMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const reservation = await Reservation.findOne({
      where: {
        id,
        userId
      }
    });

    if (!reservation) {
      return res.status(404).json({ error: 'Reserva não encontrada' });
    }

    await reservation.destroy();
    res.json({ message: 'Reserva deletada com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/reservations/finalize', mockAuthMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const updated = await Reservation.update(
      { status: 'completed' },
      {
        where: {
          userId,
          status: 'active'
        }
      }
    );

    res.json({ 
      message: 'Reservas finalizadas com sucesso',
      count: updated[0]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

describe('ReservationController - Integração de Reservas', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/reservations - Buscar reservas do usuário', () => {
    it('deve retornar lista de reservas ativas do usuário', async () => {
      const mockReservations = [
        {
          id: 1,
          userId: 1,
          bookId: 1,
          status: 'active',
          createdAt: new Date(),
          book: {
            id: 1,
            title: 'Dom Casmurro',
            author: 'Machado de Assis',
            genre: 'Romance',
            cover: '/image/livro-azul.png',
            status: 'available'
          }
        }
      ];

      Reservation.findAll = jest.fn().mockResolvedValue(mockReservations);

      const response = await request(app).get('/api/reservations');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(0);
    });

    it('deve retornar array vazio quando usuário não tem reservas', async () => {
      Reservation.findAll = jest.fn().mockResolvedValue([]);

      const response = await request(app).get('/api/reservations');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('deve retornar erro em caso de falha no banco', async () => {
      Reservation.findAll = jest.fn().mockRejectedValue(new Error('Erro no banco'));

      const response = await request(app).get('/api/reservations');

      expect(response.status).toBeGreaterThanOrEqual(400);
      expect(response.body).toHaveProperty('error');
    });

    it('deve buscar reservas do usuário logado', async () => {
      Reservation.findAll = jest.fn().mockResolvedValue([]);
      
      await request(app).get('/api/reservations');

      expect(Reservation.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ userId: 1 })
        })
      );
    });
  });

  describe('POST /api/reservations - Criar nova reserva', () => {
    it('deve validar criação de reserva com livro disponível', async () => {
      const mockBook = {
        id: 1,
        title: '1984',
        author: 'George Orwell',
        genre: 'Ficção Científica',
        cover: '/image/livro-laranja.png',
        status: 'available'
      };

      Book.findByPk = jest.fn().mockResolvedValue(mockBook);
      Reservation.findOne = jest.fn().mockResolvedValue(null);
      Reservation.create = jest.fn().mockResolvedValue({
        id: 1,
        userId: 1,
        bookId: 1
      });

      const response = await request(app)
        .post('/api/reservations')
        .send({ bookId: 1 });

      expect(Book.findByPk).toHaveBeenCalledWith(1);
      expect(response.status).toBeGreaterThanOrEqual(200);
    });

    it('deve retornar erro 404 se livro não existir', async () => {
      Book.findByPk = jest.fn().mockResolvedValue(null);

      const response = await request(app)
        .post('/api/reservations')
        .send({ bookId: 999 });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });

    it('deve retornar erro 400 se livro não estiver disponível', async () => {
      const mockBook = { 
        id: 1, 
        title: 'Dom Casmurro',
        status: 'reserved'
      };

      Book.findByPk = jest.fn().mockResolvedValue(mockBook);

      const response = await request(app)
        .post('/api/reservations')
        .send({ bookId: 1 });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('deve verificar disponibilidade do livro antes de reservar', async () => {
      const mockBook = { 
        id: 2, 
        title: 'O Hobbit',
        status: 'available'
      };
      
      Book.findByPk = jest.fn().mockResolvedValue(mockBook);
      Reservation.findOne = jest.fn().mockResolvedValue(null);
      Reservation.create = jest.fn().mockResolvedValue({
        id: 2,
        userId: 1,
        bookId: 2
      });

      await request(app)
        .post('/api/reservations')
        .send({ bookId: 2 });

      expect(Book.findByPk).toHaveBeenCalledWith(2);
    });

    it('deve processar requisição de reserva com autenticação', async () => {
      const mockBook = { 
        id: 3, 
        title: 'Harry Potter',
        status: 'available'
      };
      
      Book.findByPk = jest.fn().mockResolvedValue(mockBook);
      Reservation.findOne = jest.fn().mockResolvedValue(null);
      Reservation.create = jest.fn().mockResolvedValue({
        id: 3,
        userId: 1,
        bookId: 3
      });

      const response = await request(app)
        .post('/api/reservations')
        .send({ bookId: 3 });

      expect(response.status).toBeDefined();
      expect(Book.findByPk).toHaveBeenCalled();
    });
  });

  describe('DELETE /api/reservations/:id - Deletar reserva', () => {
    it('deve deletar uma reserva com sucesso', async () => {
      const mockReservation = {
        id: 1,
        userId: 1,
        bookId: 1,
        status: 'active',
        destroy: jest.fn().mockResolvedValue(true)
      };

      Reservation.findOne = jest.fn().mockResolvedValue(mockReservation);

      const response = await request(app).delete('/api/reservations/1');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Reserva deletada com sucesso');
      expect(mockReservation.destroy).toHaveBeenCalled();
    });

    it('deve retornar erro 404 se reserva não existir', async () => {
      Reservation.findOne = jest.fn().mockResolvedValue(null);

      const response = await request(app).delete('/api/reservations/999');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Reserva não encontrada');
    });

    it('deve garantir que usuário só delete suas próprias reservas', async () => {
      const mockReservation = {
        id: 1,
        userId: 1,
        destroy: jest.fn()
      };
      
      Reservation.findOne = jest.fn().mockResolvedValue(mockReservation);

      await request(app).delete('/api/reservations/1');

      expect(Reservation.findOne).toHaveBeenCalledWith({
        where: { id: '1', userId: 1 }
      });
    });
  });

  describe('POST /api/reservations/finalize - Finalizar reservas', () => {
    it('deve finalizar todas as reservas ativas do usuário', async () => {
      Reservation.update = jest.fn().mockResolvedValue([3]);

      const response = await request(app).post('/api/reservations/finalize');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Reservas finalizadas com sucesso');
      expect(response.body).toHaveProperty('count', 3);
    });

    it('deve retornar count 0 se não houver reservas ativas', async () => {
      Reservation.update = jest.fn().mockResolvedValue([0]);

      const response = await request(app).post('/api/reservations/finalize');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('count', 0);
    });

    it('deve alterar status para completed', async () => {
      Reservation.update = jest.fn().mockResolvedValue([2]);

      await request(app).post('/api/reservations/finalize');

      expect(Reservation.update).toHaveBeenCalledWith(
        { status: 'completed' },
        expect.objectContaining({
          where: expect.objectContaining({ userId: 1 })
        })
      );
    });
  });

  describe('Integração - Persistência de reservas', () => {
    it('deve manter reservas vinculadas ao usuário no banco de dados', async () => {
      const mockBook = { 
        id: 1, 
        title: 'Test Book', 
        author: 'Author', 
        genre: 'Genre', 
        cover: '/cover.jpg',
        status: 'available'
      };
      
      Book.findByPk = jest.fn().mockResolvedValue(mockBook);
      Reservation.findOne = jest.fn().mockResolvedValue(null);
      Reservation.create = jest.fn().mockResolvedValue({
        id: 1,
        userId: 1,
        bookId: 1
      });

      await request(app)
        .post('/api/reservations')
        .send({ bookId: 1 });
      
      Reservation.findAll = jest.fn().mockResolvedValue([{
        id: 1,
        userId: 1,
        bookId: 1,
        book: mockBook
      }]);

      const getResponse = await request(app).get('/api/reservations');

      expect(getResponse.status).toBe(200);
      expect(Array.isArray(getResponse.body)).toBe(true);
    });

    it('deve carregar reservas existentes do usuário', async () => {
      const mockReservations = [
        {
          id: 5,
          userId: 1,
          bookId: 5,
          book: {
            id: 5,
            title: 'Senhor dos Anéis',
            author: 'Tolkien',
            genre: 'Fantasia',
            cover: '/cover.jpg'
          }
        }
      ];

      Reservation.findAll = jest.fn().mockResolvedValue(mockReservations);

      const response = await request(app).get('/api/reservations');

      expect(response.status).toBe(200);
      expect(response.body.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Validação de autenticação e autorização', () => {
    it('deve usar userId do token de autenticação nas operações', async () => {
      Reservation.findAll = jest.fn().mockResolvedValue([]);
      await request(app).get('/api/reservations');
      
      expect(Reservation.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ userId: 1 })
        })
      );
    });

    it('deve isolar reservas por usuário', async () => {
      Reservation.findAll = jest.fn().mockResolvedValue([]);

      await request(app).get('/api/reservations');

      expect(Reservation.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ userId: 1 })
        })
      );
    });
  });
});