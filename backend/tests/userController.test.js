const userController = require("../controllers/userController");

describe("UserController", () => {
  test("getProfile deve chamar res.json (retorna perfil do usuário)", async () => {
   
    const req = { user: { id: 1 } };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

    await userController.getProfile(req, res);

    expect(res.json).toHaveBeenCalled();
  });

  test("createUser deve criar usuário e retornar 201; duplicata retorna 400", async () => {
    
    const novo = {
      body: { name: "TesteCriar", email: `teste_criar_${Date.now()}@mail.com`, password: "123456", role: "user" }
    };
    const res1 = { json: jest.fn(), status: jest.fn().mockReturnThis() };

    await userController.createUser(novo, res1);
    expect(res1.status).toHaveBeenCalledWith(201);
    expect(res1.json).toHaveBeenCalled();

   
    const res2 = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    await userController.createUser(novo, res2);
    expect(res2.status).toHaveBeenCalledWith(400);
  });
});
