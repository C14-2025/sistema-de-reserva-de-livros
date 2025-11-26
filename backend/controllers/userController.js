const { User, Reservation, Book } = require('../models');

const userController = {
  // Listar todos os usuários (apenas admin)
  async getAllUsers(req, res) {
    try {
      const users = await User.findAll({
        attributes: { exclude: ['password'] }, // Não retornar senha
        include: [{
          model: Reservation,
          include: [Book]
        }]
      });
      
      res.json(users);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Obter usuário por ID
  async getUserById(req, res) {
    try {
      const { id } = req.params;
      
      const user = await User.findByPk(id, {
        attributes: { exclude: ['password'] },
        include: [{
          model: Reservation,
          include: [Book]
        }]
      });
      
      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }
      
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Criar usuário (admin apenas)
  async createUser(req, res) {
    try {
      const { name, email, password, role } = req.body;
      
      const userExists = await User.findOne({ where: { email } });
      if (userExists) {
        return res.status(400).json({ error: 'Email já cadastrado' });
      }
      
      const user = await User.create({ name, email, password, role });
      
      // Retornar usuário sem a senha
      const userWithoutPassword = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      };
      
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Atualizar usuário
  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const { name, email, role } = req.body;
      
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }
      
      // Verificar se email já existe (exceto para o próprio usuário)
      if (email && email !== user.email) {
        const emailExists = await User.findOne({ where: { email } });
        if (emailExists) {
          return res.status(400).json({ error: 'Email já está em uso' });
        }
      }
      
      await user.update({ name, email, role });
      
      // Retornar usuário sem senha
      const userWithoutPassword = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      };
      
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Deletar usuário
  async deleteUser(req, res) {
    try {
      const { id } = req.params;
      
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }
      
      // Verificar se o usuário tem reservas ativas
      const activeReservations = await Reservation.count({
        where: { 
          userId: id,
          status: 'active'
        }
      });
      
      if (activeReservations > 0) {
        return res.status(400).json({ 
          error: 'Não é possível deletar usuário com reservas ativas' 
        });
      }
      
      await user.destroy();
      res.json({ message: 'Usuário deletado com sucesso' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Obter perfil do usuário logado
  async getProfile(req, res) {
    try {
      const user = await User.findByPk(req.user.id, {
        attributes: { exclude: ['password'] },
        include: [{
          model: Reservation,
          include: [Book]
        }]
      });
      
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};

module.exports = userController;