const request = require("supertest");
const app = require("../server");

describe("User Controller", () => {
  test("Deve listar todos os usuários", async () => {
    const res = await request(app).get("/api/users");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("Deve criar um novo usuário", async () => {
    const novoUsuario = {
      nome: "Teste Usuário",
      email: `teste_${Date.now()}@mail.com`,
      senha: "123456"
    };
    const res = await request(app).post("/api/users").send(novoUsuario);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
  });

  test("Não deve criar usuário sem dados obrigatórios", async () => {
    const res = await request(app).post("/api/users").send({});
    expect(res.statusCode).toBe(400);
  });
});
