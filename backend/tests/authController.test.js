const authController = require("../controllers/authController");

// Mock do modelo User
jest.mock("../models", () => ({
  User: {
    findOne: jest.fn(),
    create: jest.fn()
  }
}));

// Mock da biblioteca bcryptjs
jest.mock("bcryptjs", () => ({
  hash: jest.fn().mockResolvedValue("hashed_password_123")
}));

// Mock da biblioteca jsonwebtoken
jest.mock("jsonwebtoken", () => ({
  sign: jest.fn().mockReturnValue("mock.jwt.token.123")
}));

const { User } = require("../models");
const jwt = require("jsonwebtoken");


describe("AuthController", () => {
  let req, res;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  // Teste 1: Registro de novo usuário
  test("Deve registrar um novo usuário corretamente", async () => {
    req.body = { 
      name: "João", 
      email: "joao@example.com", 
      password: "123456"
 
    };

    User.findOne.mockResolvedValue(null);
    
    const mockUser = {
      id: 1,
      name: "João",
      email: "joao@example.com",
      password: "hashed_password", // Senha será hasheada pelo modelo
      role: null // Pode ser null se não for fornecido
    };
    
    User.create.mockResolvedValue(mockUser);

    await authController.register(req, res);

    expect(User.findOne).toHaveBeenCalledWith({ where: { email: "joao@example.com" } });
    expect(User.create).toHaveBeenCalledWith({
      name: "João",
      email: "joao@example.com",
      password: "123456",
      role: undefined // Não fornecemos role
    });
    
    // Verificar token
    expect(jwt.sign).toHaveBeenCalledWith(
      { userId: 1 },
      'sistema_reserva_livros_seguranca_2025',
      { expiresIn: '24h' }
    );
    
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      user: {
        id: 1,
        name: "João",
        email: "joao@example.com",
        role: null
      },
      token: "mock.jwt.token.123"
    });
  });

  // Teste 2: Registro com email já existente
  test("Deve retornar erro 400 ao tentar registrar email existente", async () => {
    req.body = { 
      name: "João", 
      email: "existente@example.com", 
      password: "123456" 
    };

    User.findOne.mockResolvedValue({
      id: 1,
      email: "existente@example.com",
      name: "João Existente"
    });

    await authController.register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ 
      error: 'Usuário já existe' 
    });
  });

  // Teste 3: Registro com role 'user' quando especificado
  test("Deve salvar role quando for especificada", async () => {
    req.body = { 
      name: "Maria", 
      email: "maria@example.com", 
      password: "123456",
      role: "user"
    };

    User.findOne.mockResolvedValue(null);
    
    const mockUser = {
      id: 2,
      name: "Maria",
      email: "maria@example.com",
      password: "hashed_password",
      role: "user"
    };
    
    User.create.mockResolvedValue(mockUser);

    await authController.register(req, res);

    expect(User.create).toHaveBeenCalledWith({
      name: "Maria",
      email: "maria@example.com",
      password: "123456",
      role: "user"
    });
    
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      user: expect.objectContaining({
        role: "user"
      })
    }));
  });

  // Teste 4: Registro com role 'admin'
  test("Deve salvar corretamente quando role 'admin' for especificada", async () => {
    req.body = { 
      name: "Admin", 
      email: "admin@example.com", 
      password: "admin123",
      role: "admin" 
    };

    User.findOne.mockResolvedValue(null);
    
    const mockUser = {
      id: 3,
      name: "Admin",
      email: "admin@example.com",
      password: "hashed_password",
      role: "admin"
    };
    
    User.create.mockResolvedValue(mockUser);

    await authController.register(req, res);

    expect(User.create).toHaveBeenCalledWith(expect.objectContaining({
      role: "admin"
    }));
    
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      user: expect.objectContaining({
        role: "admin"
      })
    }));
  });

  // Teste 5: Login com credenciais inválidas (usuário não existe)
  test("Deve retornar erro 401 se o usuário não existir", async () => {
    req.body = { 
      email: "naoexiste@example.com", 
      password: "errado" 
    };

    User.findOne.mockResolvedValue(null);

    await authController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Credenciais inválidas" });
  });

  // Teste 6: Login com senha incorreta 
  test("Deve retornar erro 401 se a senha estiver incorreta", async () => {
    req.body = { 
      email: "usuario@example.com", 
      password: "senha_errada" 
    };

    const mockUser = {
      id: 1,
      email: "usuario@example.com",
      password: "hashed_password_correto",
      name: "Usuário Teste",
      role: "user",
      validPassword: jest.fn().mockResolvedValue(false) // Senha incorreta
    };

    User.findOne.mockResolvedValue(mockUser);

    await authController.login(req, res);

    expect(mockUser.validPassword).toHaveBeenCalledWith("senha_errada");
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Credenciais inválidas" });
  });

  // Teste 7: Login válido
test("Deve retornar token JWT ao fazer login com credenciais válidas", async () => {
  req.body = { 
    email: "sucesso@example.com", 
    password: "senha_correta" 
  };

  const mockUser = {
    id: 1,
    email: "sucesso@example.com",
    password: "hashed_password",
    name: "Usuário Sucesso",
    role: "user",
    validPassword: jest.fn().mockResolvedValue(true)
  };

  User.findOne.mockResolvedValue(mockUser);

  await authController.login(req, res);

  // Verifica se o token foi gerado apenas com userId
  expect(jwt.sign).toHaveBeenCalledWith(
    { userId: 1 },
    'sistema_reserva_livros_seguranca_2025',
    { expiresIn: '24h' }
  );

  expect(res.json).toHaveBeenCalledWith({
    token: "mock.jwt.token.123",
    user: {
      id: 1,
      email: "sucesso@example.com",
      name: "Usuário Sucesso",
      role: "user"
    }
  });
});
  // Teste 8: Login válido com role 'admin' 
  test("Deve incluir role no retorno quando o usuário for admin", async () => {
    req.body = { 
      email: "admin@example.com", 
      password: "admin123" 
    };

    const mockUser = {
      id: 2,
      email: "admin@example.com",
      password: "hashed_password",
      name: "Admin User",
      role: "admin",
      validPassword: jest.fn().mockResolvedValue(true)
    };

    User.findOne.mockResolvedValue(mockUser);

    await authController.login(req, res);

    expect(jwt.sign).toHaveBeenCalledWith(
      { userId: 2 }, 
      'sistema_reserva_livros_seguranca_2025',
      { expiresIn: '24h' }
    );
    
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      user: expect.objectContaining({
        role: "admin"
      })
    }));
  });

  // Teste 9: Erro no servidor durante registro
  test("Deve retornar erro 400 quando houver falha no banco de dados durante registro", async () => {
    req.body = { 
      name: "Erro", 
      email: "erro@example.com", 
      password: "123456" 
    };

    User.findOne.mockResolvedValue(null);
    User.create.mockRejectedValue(new Error("Erro no banco de dados"));

    await authController.register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ 
      error: "Erro no banco de dados" 
    });
  });


  test("Deve retornar erro 400 quando houver falha durante login", async () => {
    req.body = { 
      email: "erro@example.com", 
      password: "123456" 
    };

    User.findOne.mockRejectedValue(new Error("Erro no banco de dados"));

    await authController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ 
      error: "Erro no banco de dados" 
    });
  });

  test("Deve registrar usuário sem role especificada", async () => {
    req.body = { 
      name: "Sem Role", 
      email: "semrole@example.com", 
      password: "123456"
    };

    User.findOne.mockResolvedValue(null);
    
    const mockUser = {
      id: 4,
      name: "Sem Role",
      email: "semrole@example.com",
      password: "hashed_password",
      role: null // Pode ser null
    };
    
    User.create.mockResolvedValue(mockUser);

    await authController.register(req, res);

    expect(User.create).toHaveBeenCalledWith({
      name: "Sem Role",
      email: "semrole@example.com",
      password: "123456",
      role: undefined // Não fornecido
    });
  });

  // : Erro no validPassword
  test("Deve tratar erro no método validPassword", async () => {
    req.body = { 
      email: "errovalid@example.com", 
      password: "senha" 
    };

    const mockUser = {
      id: 1,
      email: "errovalid@example.com",
      name: "Erro Valid",
      role: "user",
      validPassword: jest.fn().mockRejectedValue(new Error("Erro na validação"))
    };

    User.findOne.mockResolvedValue(mockUser);

    await authController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ 
      error: "Erro na validação" 
    });
  });
});