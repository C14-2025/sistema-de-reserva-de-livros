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

/
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
});
