const authController = require("../controllers/authController");

//Mock do modelo
jest.mock("../models", () => ({
  User: {
    findOne: jest.fn(),
    create: jest.fn()
  }
}));

//Mock da biblioteca bcryptjs (criptografa senhas)
jest.mock("bcryptjs", () => ({
  hash: jest.fn().mockResolvedValue("hashed_password_123")
}));

//Mock da biblioteca jsonwebtoken (autentica usuários)
jest.mock("jsonwebtoken", () => ({
  sign: jest.fn().mockReturnValue("mock.jwt.token.123")
}));

const { User } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


authController.JWT_SECRET = "test-secret-123";

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


  //Requisição de regitro de novo usuário
  test("Deve registrar um novo usuário corretamente", async () => {
    req.body = { 
      name: "João", 
      email: "joao@example.com", 
      password: "123456",
      role: "user" 
    };

    User.findOne.mockResolvedValue(null);
    User.create.mockResolvedValue({
      id: 1,
      name: "João",
      email: "joao@example.com",
      role: "user"
    });

    await authController.register(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalled();
  });

  //Erro de login
  test("Deve retornar erro se o login for inválido", async () => {
    req.body = { 
      email: "naoexiste@example.com", 
      password: "errado" 
    };

    User.findOne.mockResolvedValue(null);

    await authController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Credenciais inválidas" });
  });
  
  test("Deve retornar erro ao tentar registrar um usuário já existente", async () => {
  req.body = { 
    name: "Maria",
    email: "maria@example.com",
    password: "123456",
    role: "user"
  };

  User.findOne.mockResolvedValue({ id: 99 });

  await authController.register(req, res);

  expect(res.status).toHaveBeenCalledWith(400);
  expect(res.json).toHaveBeenCalledWith({ error: "E-mail já cadastrado" });
});
  jest.mock("bcryptjs", () => ({
  hash: jest.fn(),
  compare: jest.fn().mockResolvedValue(true),
}));

test("Deve fazer login corretamente com credenciais válidas", async () => {
  req.body = { email: "joao@example.com", password: "123456" };

  User.findOne.mockResolvedValue({
    id: 1,
    email: "joao@example.com",
    password: "hashed_password_123",
    role: "user"
  });

  await authController.login(req, res);

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith(
    expect.objectContaining({ token: expect.any(String) })
  );
});
jest.mock("bcryptjs", () => ({
  hash: jest.fn(),
  compare: jest.fn().mockResolvedValue(false),
}));

test("Deve retornar erro quando a senha estiver incorreta", async () => {
  req.body = { email: "joao@example.com", password: "senha_errada" };

  User.findOne.mockResolvedValue({
    id: 1,
    email: "joao@example.com",
    password: "hashed_password_123",
    role: "user"
  });

  await authController.login(req, res);

  expect(res.status).toHaveBeenCalledWith(401);
  expect(res.json).toHaveBeenCalledWith({ error: "Credenciais inválidas" });
});


});

