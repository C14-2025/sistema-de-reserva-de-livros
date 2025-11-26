# 📚 Sistema de Reserva de Livros – Backend

## 🧩 Sobre o Projeto  
Sistema completo de **reserva de livros**, desenvolvido em **Node.js** com arquitetura **REST API**, permitindo o gerenciamento de **usuários, livros e reservas** com diferentes níveis de permissão.  

---

## Status do projeto
✅ Backend Completo - API 100% funcional
✅ Banco de Dados - SQLite configurado e sincronizado
✅ Autenticação JWT - Sistema de login seguro
✅ Testes Unitários - 8 testes implementados e passando
✅ Documentação - Endpoints completamente documentados
🚀 Pronto para Integração - Frontend pode ser desenvolvido

---

## 🚀 Funcionalidades Implementadas  

### 🔐 Autenticação & Autorização  
- Registro de usuários com dois perfis: **Admin** e **Usuário Comum**  
- Login seguro com **JWT (JSON Web Tokens)**  
- Middleware de autenticação para proteger rotas sensíveis  
- Controle de acesso baseado em **roles** (Admin tem permissões especiais)  

### 📚 Gerenciamento de Livros  
- CRUD completo (**Criar, Listar, Atualizar e Deletar livros**)  
- Sistema de **busca avançada** por título, autor ou gênero  
- **Listagem paginada** para melhor performance  
- Filtros por status (**disponível/reservado**)  
- Controle de **disponibilidade automática**  

### 📅 Sistema de Reservas  
- Usuários comuns podem **reservar livros disponíveis**  
- **Cancelamento de reservas** (pelo usuário ou admin)  
- Listagem personalizada: **minhas reservas / todas as reservas**  
- Atualização automática do **status dos livros**  
- Validação de conflitos (não permite reservas duplicadas)  

### 👤 Gestão de Usuários  
- **Perfil do usuário logado**  
- CRUD completo de usuários (**apenas administradores**)  
- Validações de segurança na exclusão  
- Proteção contra exclusão de usuários com reservas ativas  

---

## 🛠️ Tecnologias Utilizadas  

| Categoria | Tecnologias |
|------------|--------------|
| **Backend** | Node.js, Express.js |
| **Banco de Dados** | SQLite, Sequelize |
| **Autenticação** | JWT, bcryptjs |
| **Comunicação** | CORS |
| **Testes** | Jest, Supertest |
| **Dev Tools** | Nodemon |

---

## Cobertura de Testes
✅ AuthController - Registro e login (2 testes)

✅ BookController - CRUD de livros (2 testes)

✅ ReservationController - Sistema de reservas (2 testes)

✅ UserController - Gestão de usuários (2 testes)

---

## 🧱 Arquitetura do Projeto  

```bash
backend/
├── 📁 config/           # Configuração do banco de dados
├── 📁 controllers/      # Lógica de negócio e regras
├── 📁 models/           # Modelos de dados e associações
├── 📁 routes/           # Definição dos endpoints da API
├── 📁 middlewares/      # Autenticação e validações
├── 📁 tests/            # Testes automatizados
├── ⚙️ server.js         # Ponto de entrada da aplicação
└── 📄 package.json      # Dependências e scripts
```

---

## 🔗 Endpoints da API  

### 🧾 Autenticação  
| Método | Endpoint | Descrição | Acesso |
|--------|-----------|------------|--------|
| POST | `/api/auth/register` | Registrar novo usuário | Público |
| POST | `/api/auth/login` | Fazer login | Público |

### 📖 Livros  
| Método | Endpoint | Descrição | Acesso |
|--------|-----------|------------|--------|
| GET | `/api/books` | Listar livros (com busca) | Público |
| POST | `/api/books` | Criar novo livro | Admin |
| PUT | `/api/books/:id` | Atualizar livro | Admin |
| DELETE | `/api/books/:id` | Deletar livro | Admin |

### 📅 Reservas  
| Método | Endpoint | Descrição | Acesso |
|--------|-----------|------------|--------|
| POST | `/api/reservations` | Criar reserva | Usuário |
| GET | `/api/reservations/my-reservations` | Minhas reservas | Usuário |
| GET | `/api/reservations` | Todas as reservas | Admin |
| PUT | `/api/reservations/:id/cancel` | Cancelar reserva | Usuário/Admin |

### 👥 Usuários  
| Método | Endpoint | Descrição | Acesso |
|--------|-----------|------------|--------|
| GET | `/api/users/profile` | Meu perfil | Usuário |
| GET | `/api/users` | Listar todos usuários | Admin |
| POST | `/api/users` | Criar usuário | Admin |
| PUT | `/api/users/:id` | Atualizar usuário | Admin |
| DELETE | `/api/users/:id` | Deletar usuário | Admin |

---

## 👩‍💻 Equipe de Desenvolvimento  

| Nome | Curso / Turma |
|------|----------------|
| **Bianca Ribeiro de Souza** | GES 226, Turma A |
| **Maria Rita Raposo Rosa** | GEC 2019, Turma B |
| **Lavinia Vitória Ribeiro Amaral** | GES 514, Turma A |
| **Julia Alves Alvarenga Pereira** | GEC 2036, Turma B |

---

## ⚖️ Licença  
Este projeto está sob a **licença ISC**.  
