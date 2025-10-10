Sistema de Reserva de Livros - Backend
Sobre o Projeto
Sistema completo de reserva de livros desenvolvido em Node.js com arquitetura REST API, permitindo o gerenciamento de usuários, livros e reservas com diferentes níveis de permissão.

**Funcionalidades Implementadas**

*Sistema de Autenticação & Autorização*
Registro de usuários com dois perfis: Admin e Usuário Comum

Login seguro com JWT (JSON Web Tokens)

Middleware de autenticação para proteger rotas sensíveis

Controle de acesso baseado em roles (admin tem permissões especiais)

*Gerenciamento de Livros*
CRUD completo (Criar, Listar, Atualizar, Deletar livros)

Sistema de busca avançada por título, autor ou gênero

Listagem paginada para melhor performance

Filtros por status (disponível/reservado)

Controle de disponibilidade automático

*Sistema de Reservas*
Reserva de livros disponíveis para usuários comuns

Cancelamento de reservas (próprias ou por admin)

Listagem personalizada (minhas reservas vs todas reservas)

Atualização automática do status dos livros

Validação de conflitos (não permite reservas duplicadas)

*Gestão de Usuários*
Perfil do usuário logado

CRUD de usuários (apenas para administradores)

Validações de segurança na exclusão de usuários

Proteção contra exclusão de usuários com reservas ativas

**Tecnologias Utilizadas**
*Backend*
Node.js - Runtime JavaScript

Express.js - Framework web

SQLite - Banco de dados relacional

Sequelize - ORM para banco de dados

JWT - Autenticação por tokens

bcryptjs - Criptografia de senhas

CORS - Comunicação entre domínios

Ferramentas de Desenvolvimento
Nodemon - Reinicialização automática em desenvolvimento

Jest - Framework de testes

Supertest - Testes de integração HTTP

**Arquitetura do Projeto**

backend/
├── 📁 config/           # Configuração do banco de dados
├── 📁 controllers/      # Lógica de negócio e regras
├── 📁 models/          # Modelos de dados e associações
├── 📁 routes/          # Definição de endpoints API
├── 📁 middlewares/     # Autenticação e validações
├── 📁 tests/           # Testes automatizados
├── ⚙️ server.js        # Ponto de entrada da aplicação
└── 📄 package.json     # Dependências e scripts
**Endpoints da API**
*Autenticação*
Método	Endpoint	Descrição	Acesso
POST	/api/auth/register	Registrar novo usuário	Público
POST	/api/auth/login	Fazer login	Público
*Livros*
Método	Endpoint	Descrição	Acesso
GET	/api/books	Listar livros (com busca)	Público
POST	/api/books	Criar novo livro	Admin
PUT	/api/books/:id	Atualizar livro	Admin
DELETE	/api/books/:id	Deletar livro	Admin
*Reservas*
Método	Endpoint	Descrição	Acesso
POST	/api/reservations	Criar reserva	Usuário
GET	/api/reservations/my-reservations	Minhas reservas	Usuário
GET	/api/reservations	Todas as reservas	Admin
PUT	/api/reservations/:id/cancel	Cancelar reserva	Usuário/Admin
*Usuários*
Método	Endpoint	Descrição	Acesso
GET	/api/users/profile	Meu perfil	Usuário
GET	/api/users	Listar todos usuários	Admin
POST	/api/users	Criar usuário	Admin
PUT	/api/users/:id	Atualizar usuário	Admin
DELETE	/api/users/:id	Deletar usuário	Admin



**Equipe de Desenvolvimento**
Bianca Ribeiro de Souza - GES 226, turma A

Maria Rita Raposo Rosa - GEC, 2019, turma B

Lavinia Vitória Ribeiro Amaral - GES 514, turma A

Julia Alves Alvarenga Pereira - GEC 2036, turma B

**Licença**
Este projeto está sob a licença ISC.