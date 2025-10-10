const authController = require("../controllers/authController");

describe("AuthController", () => {
  test("Deve registrar um novo usuário corretamente", async () => {
    // Simula uma requisição com dados de usuário
    const req = {
      body: { name: "João", email: "joao@example.com", password: "123456" },
    };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

    await authController.register(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalled();
  });

  test("Deve retornar erro se o login for inválido", async () => {
    const req = {
      body: { email: "naoexiste@example.com", password: "errado" },
    };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

    await authController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
  });
});
