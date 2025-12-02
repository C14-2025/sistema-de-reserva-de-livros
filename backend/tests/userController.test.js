// tests/userController.test.js - VERSÃO CORRIGIDA
const userController = require("../controllers/userController");

// Mock dos modelos - CORRIGIDO
jest.mock("../models", () => ({
  User: {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    prototype: {
      update: jest.fn(),
      destroy: jest.fn()
    }
  },
  Reservation: {
    count: jest.fn()
  },
  Book: {} // Mock simples
}));

const { User, Reservation } = require("../models");

describe("UserController", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      user: {}
    };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };
    jest.clearAllMocks();
  });

  // ============================================
  // TESTES PARA: getProfile - CORRIGIDO
  // ============================================
  describe("getProfile", () => {
    test("deve retornar perfil do usuário logado sem senha", async () => {
      req.user = { id: 1 };

      const mockUser = {
        id: 1,
        name: "João Silva",
        email: "joao@email.com",
        role: "user",
        Reservations: []
      };

      User.findByPk = jest.fn().mockResolvedValue(mockUser);

      await userController.getProfile(req, res);

      // CORREÇÃO: Ajuste da estrutura do include
      expect(User.findByPk).toHaveBeenCalledWith(1, {
        attributes: { exclude: ['password'] },
        include: [{
          model: Reservation,
          include: [{}] // Book mockado - formato simplificado
        }]
      });
      expect(res.json).toHaveBeenCalledWith(mockUser);
    });

    test("deve retornar erro 400 quando falhar ao buscar perfil", async () => {
      req.user = { id: 1 };
      User.findByPk = jest.fn().mockRejectedValue(
        new Error("Erro no banco")
      );

      await userController.getProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ 
        error: "Erro no banco" 
      });
    });
  });

  // ============================================
  // TESTES PARA: createUser (já funciona)
  // ============================================
  describe("createUser", () => {
    test("deve criar usuário e retornar 201 sem senha no response", async () => {
      req.body = {
        name: "Novo Usuário",
        email: "novo@email.com",
        password: "senha123",
        role: "user"
      };

      User.findOne = jest.fn().mockResolvedValue(null);
      
      const mockCreatedUser = {
        id: 3,
        name: "Novo Usuário",
        email: "novo@email.com",
        password: "hashed_password",
        role: "user",
        createdAt: "2024-01-01",
        updatedAt: "2024-01-01"
      };

      User.create = jest.fn().mockResolvedValue(mockCreatedUser);

      await userController.createUser(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ 
        where: { email: "novo@email.com" } 
      });
      expect(User.create).toHaveBeenCalledWith({
        name: "Novo Usuário",
        email: "novo@email.com",
        password: "senha123",
        role: "user"
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        id: 3,
        name: "Novo Usuário",
        email: "novo@email.com",
        role: "user",
        createdAt: "2024-01-01",
        updatedAt: "2024-01-01"
      });
      const responseData = res.json.mock.calls[0][0];
      expect(responseData).not.toHaveProperty('password');
    });

    test("deve retornar erro 400 quando email já existe", async () => {
      req.body = {
        name: "Usuário Existente",
        email: "existente@email.com",
        password: "123456"
      };

      User.findOne = jest.fn().mockResolvedValue({
        id: 1,
        email: "existente@email.com"
      });

      await userController.createUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ 
        error: "Email já cadastrado" 
      });
      expect(User.create).not.toHaveBeenCalled();
    });

    test("deve retornar erro 400 quando criação falha", async () => {
      req.body = {
        name: "Erro",
        email: "erro@email.com",
        password: "123456"
      };

      User.findOne = jest.fn().mockResolvedValue(null);
      User.create = jest.fn().mockRejectedValue(
        new Error("Erro ao criar usuário")
      );

      await userController.createUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ 
        error: "Erro ao criar usuário" 
      });
    });
  });

  // ============================================
  // TESTES PARA: getAllUsers - CORRIGIDO
  // ============================================
  describe("getAllUsers", () => {
    test("deve retornar todos os usuários sem senhas", async () => {
      const mockUsers = [
        {
          id: 1,
          name: "João",
          email: "joao@email.com",
          role: "user",
          Reservations: []
        },
        {
          id: 2,
          name: "Maria",
          email: "maria@email.com",
          role: "admin",
          Reservations: []
        }
      ];

      User.findAll = jest.fn().mockResolvedValue(mockUsers);

      await userController.getAllUsers(req, res);

      // CORREÇÃO: Formato simplificado do include
      expect(User.findAll).toHaveBeenCalledWith({
        attributes: { exclude: ['password'] },
        include: [{
          model: Reservation,
          include: [{}] // Formato simplificado
        }]
      });
      expect(res.json).toHaveBeenCalledWith(mockUsers);
    });

    test("deve retornar erro 400 quando falhar ao buscar usuários", async () => {
      User.findAll = jest.fn().mockRejectedValue(
        new Error("Erro no banco de dados")
      );

      await userController.getAllUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ 
        error: "Erro no banco de dados" 
      });
    });
  });

  // ============================================
  // TESTES PARA: getUserById - CORRIGIDO
  // ============================================
  describe("getUserById", () => {
    test("deve retornar usuário por ID sem senha", async () => {
      req.params = { id: "1" };
      
      const mockUser = {
        id: 1,
        name: "João",
        email: "joao@email.com",
        role: "user",
        Reservations: []
      };

      User.findByPk = jest.fn().mockResolvedValue(mockUser);

      await userController.getUserById(req, res);

      // CORREÇÃO: Formato simplificado
      expect(User.findByPk).toHaveBeenCalledWith("1", {
        attributes: { exclude: ['password'] },
        include: [{
          model: Reservation,
          include: [{}] // Formato simplificado
        }]
      });
      expect(res.json).toHaveBeenCalledWith(mockUser);
    });

    test("deve retornar erro 404 quando usuário não existe", async () => {
      req.params = { id: "999" };
      User.findByPk = jest.fn().mockResolvedValue(null);

      await userController.getUserById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ 
        error: "Usuário não encontrado" 
      });
    });

    test("deve retornar erro 400 quando falhar ao buscar usuário", async () => {
      req.params = { id: "1" };
      User.findByPk = jest.fn().mockRejectedValue(
        new Error("Erro no banco")
      );

      await userController.getUserById(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ 
        error: "Erro no banco" 
      });
    });
  });

  // APENAS a seção updateUser corrigida - substitua toda a seção

  // ============================================
  // TESTES PARA: updateUser - VERSÃO FINAL CORRIGIDA
  // ============================================
  describe("updateUser", () => {
    test("deve atualizar usuário com sucesso", async () => {
  req.params = { id: "1" };
  req.body = {
    name: "Nome Atualizado",
    email: "novoemail@email.com",
    role: "admin"
  };

  // Objeto que será modificado pelo update
  let mockUserData = {
    id: 1,
    name: "Nome Antigo",
    email: "antigo@email.com",
    role: "user",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01"
  };

  // Mock do update que ATUALIZA o objeto
  const mockUpdate = jest.fn().mockImplementation((updates) => {
    // Atualiza os dados do usuário
    mockUserData = {
      ...mockUserData,
      ...updates,
      updatedAt: "2024-01-02" // Novo timestamp
    };
    return Promise.resolve(mockUserData);
  });

  const mockUser = {
    ...mockUserData,
    update: mockUpdate
  };

  User.findByPk = jest.fn().mockResolvedValue(mockUser);
  User.findOne = jest.fn().mockResolvedValue(null);

  await userController.updateUser(req, res);

  expect(User.findByPk).toHaveBeenCalledWith("1");
  expect(User.findOne).toHaveBeenCalledWith({
    where: { email: "novoemail@email.com" }
  });
  expect(mockUpdate).toHaveBeenCalledWith({
    name: "Nome Atualizado",
    email: "novoemail@email.com",
    role: "admin"
  });
  
  // O controller deve retornar os dados ATUALIZADOS
  expect(res.json).toHaveBeenCalledWith({
    id: 1,
    name: "Nome Atualizado",
    email: "novoemail@email.com",
    role: "admin",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-02"
  });
});
    test("deve retornar erro 404 quando usuário não existe", async () => {
      req.params = { id: "999" };
      req.body = { name: "Atualizado" };

      User.findByPk = jest.fn().mockResolvedValue(null);

      await userController.updateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ 
        error: "Usuário não encontrado" 
      });
    });

    test("deve retornar erro 400 quando novo email já está em uso", async () => {
      req.params = { id: "1" };
      req.body = { 
        email: "email_existente@email.com" 
      };

      const mockUser = {
        id: 1,
        email: "antigo@email.com",
        update: jest.fn()
      };

      User.findByPk = jest.fn().mockResolvedValue(mockUser);
      User.findOne = jest.fn().mockResolvedValue({
        id: 2,
        email: "email_existente@email.com"
      });

      await userController.updateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ 
        error: "Email já está em uso" 
      });
      expect(mockUser.update).not.toHaveBeenCalled();
    });
  });

  // ============================================
  // TESTES PARA: deleteUser (já funciona)
  // ============================================
  describe("deleteUser", () => {
    test("deve deletar usuário sem reservas ativas", async () => {
      req.params = { id: "1" };

      const mockUser = {
        id: 1,
        name: "Usuário para Deletar",
        destroy: jest.fn().mockResolvedValue(true)
      };

      User.findByPk = jest.fn().mockResolvedValue(mockUser);
      Reservation.count = jest.fn().mockResolvedValue(0);

      await userController.deleteUser(req, res);

      expect(User.findByPk).toHaveBeenCalledWith("1");
      expect(Reservation.count).toHaveBeenCalledWith({
        where: { 
          userId: "1",
          status: 'active'
        }
      });
      expect(mockUser.destroy).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ 
        message: "Usuário deletado com sucesso" 
      });
    });

    test("deve retornar erro 404 quando usuário não existe", async () => {
      req.params = { id: "999" };
      User.findByPk = jest.fn().mockResolvedValue(null);

      await userController.deleteUser(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ 
        error: "Usuário não encontrado" 
      });
    });

    test("deve retornar erro 400 quando usuário tem reservas ativas", async () => {
      req.params = { id: "1" };

      const mockUser = {
        id: 1,
        destroy: jest.fn()
      };

      User.findByPk = jest.fn().mockResolvedValue(mockUser);
      Reservation.count = jest.fn().mockResolvedValue(2);

      await userController.deleteUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ 
        error: "Não é possível deletar usuário com reservas ativas" 
      });
      expect(mockUser.destroy).not.toHaveBeenCalled();
    });
  });
});