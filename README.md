📚 Sistema de Reserva de Livros - Backend
<div class="project-header"> <h1>📚 Sistema de Reserva de Livros - Backend</h1> <div class="badges"> <span class="badge node">Node.js</span> <span class="badge express">Express</span> <span class="badge sqlite">SQLite</span> <span class="badge jwt">JWT</span> </div> </div>
📋 Sobre o Projeto
Sistema completo de reserva de livros desenvolvido em Node.js com arquitetura REST API, permitindo o gerenciamento de usuários, livros e reservas com diferentes níveis de permissão.

🎯 Funcionalidades Implementadas
🔐 Sistema de Autenticação & Autorização
Registro de usuários com dois perfis: Admin e Usuário Comum

Login seguro com JWT (JSON Web Tokens)

Middleware de autenticação para proteger rotas sensíveis

Controle de acesso baseado em roles (admin tem permissões especiais)

📖 Gerenciamento de Livros
CRUD completo (Criar, Listar, Atualizar, Deletar livros)

Sistema de busca avançada por título, autor ou gênero

Listagem paginada para melhor performance

Filtros por status (disponível/reservado)

Controle de disponibilidade automático

🗓️ Sistema de Reservas
Reserva de livros disponíveis para usuários comuns

Cancelamento de reservas (próprias ou por admin)

Listagem personalizada (minhas reservas vs todas reservas)

Atualização automática do status dos livros

Validação de conflitos (não permite reservas duplicadas)

👥 Gestão de Usuários
Perfil do usuário logado

CRUD de usuários (apenas para administradores)

Validações de segurança na exclusão de usuários

Proteção contra exclusão de usuários com reservas ativas

🛠️ Tecnologias Utilizadas
Backend
Node.js - Runtime JavaScript

Express.js - Framework web

SQLite - Banco de dados relacional

Sequelize - ORM para banco de dados

JWT - Autenticação por tokens

bcryptjs - Criptografia de senhas

CORS - Comunicação entre domínios

🏗️ Arquitetura do Projeto
text
backend/
├── 📁 config/           # Configuração do banco de dados
├── 📁 controllers/      # Lógica de negócio e regras
├── 📁 models/          # Modelos de dados e associações
├── 📁 routes/          # Definição de endpoints API
├── 📁 middlewares/     # Autenticação e validações
├── ⚙️ server.js        # Ponto de entrada da aplicação
└── 📄 package.json     # Dependências e scripts
📡 Endpoints da API
<div class="endpoints-grid"> <div class="endpoint-category"> <h3>🔐 Autenticação</h3> <div class="endpoint public">POST /api/auth/register</div> <div class="endpoint public">POST /api/auth/login</div> </div> <div class="endpoint-category"> <h3>📖 Livros</h3> <div class="endpoint public">GET /api/books</div> <div class="endpoint admin">POST /api/books</div> <div class="endpoint admin">PUT /api/books/:id</div> <div class="endpoint admin">DELETE /api/books/:id</div> </div> <div class="endpoint-category"> <h3>🗓️ Reservas</h3> <div class="endpoint user">POST /api/reservations</div> <div class="endpoint user">GET /api/reservations/my-reservations</div> <div class="endpoint admin">GET /api/reservations</div> <div class="endpoint user">PUT /api/reservations/:id/cancel</div> </div> <div class="endpoint-category"> <h3>👥 Usuários</h3> <div class="endpoint user">GET /api/users/profile</div> <div class="endpoint admin">GET /api/users</div> <div class="endpoint admin">POST /api/users</div> <div class="endpoint admin">PUT /api/users/:id</div> <div class="endpoint admin">DELETE /api/users/:id</div> </div> </div>
🚀 Como Executar o Projeto
Pré-requisitos
Node.js (versão 14 ou superior)

npm ou yarn

Instalação e Execução
bash
# Clone o repositório
git clone [url-do-repositorio]

# Entre na pasta do backend
cd sistema-de-reserva-de-livros/backend

# Instale as dependências
npm install

# Execute em modo desenvolvimento
npm run dev

# Servidor estará rodando em: http://localhost:5000
📊 Modelo de Dados
<div class="data-model"> <div class="model-card"> <h4>👤 Usuário (User)</h4> <ul> <li>id, name, email</li> <li>password (criptografada)</li> <li>role (admin/user)</li> <li>timestamps</li> </ul> </div> <div class="model-card"> <h4>📖 Livro (Book)</h4> <ul> <li>id, title, author</li> <li>genre, isbn</li> <li>status (available/reserved)</li> <li>timestamps</li> </ul> </div> <div class="model-card"> <h4>🗓️ Reserva (Reservation)</h4> <ul> <li>id, userId, bookId</li> <li>reservationDate</li> <li>status (active/cancelled)</li> <li>timestamps</li> </ul> </div> </div>
🔒 Segurança Implementada
Senhas criptografadas com bcryptjs

Autenticação JWT com expiração

Proteção de rotas com middleware de autenticação

Validação de permissões por role de usuário

CORS configurado para comunicação segura com frontend

👥 Equipe de Desenvolvimento
<div class="team-grid"> <div class="team-member"> <strong>Bianca Ribeiro de Souza</strong> <div>GES 226, turma A</div> </div> <div class="team-member"> <strong>Maria Rita Raposo Rosa</strong> <div>GEC, 2019, turma B</div> </div> <div class="team-member"> <strong>Lavinia Vitória Ribeiro Amaral</strong> <div>GES 514, turma A</div> </div> <div class="team-member"> <strong>Julia Alves Alvarenga Pereira</strong> <div>GEC 2036, turma B</div> </div> </div>
<div class="footer"> <p><strong>🎉 Backend completo e pronto para integração!</strong></p> </div><style> * { margin: 0; padding: 0; box-sizing: border-box; } body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; } .container { max-width: 1200px; margin: 0 auto; padding: 20px; } .project-header { background: white; padding: 30px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); margin-bottom: 30px; text-align: center; } .project-header h1 { color: #2c3e50; font-size: 2.5em; margin-bottom: 20px; } .badges { display: flex; justify-content: center; gap: 10px; flex-wrap: wrap; } .badge { padding: 8px 16px; border-radius: 20px; font-weight: bold; font-size: 0.9em; color: white; } .badge.node { background: #68a063; } .badge.express { background: #000; } .badge.sqlite { background: #003b57; } .badge.jwt { background: #d63aff; } section { background: white; padding: 30px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); margin-bottom: 30px; } h2 { color: #2c3e50; border-bottom: 3px solid #667eea; padding-bottom: 10px; margin-bottom: 20px; } h3 { color: #34495e; margin: 20px 0 15px 0; } .endpoints-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin-top: 20px; } .endpoint-category { background: #f8f9fa; padding: 20px; border-radius: 10px; border-left: 4px solid #667eea; } .endpoint { padding: 10px 15px; margin: 8px 0; border-radius: 8px; font-family: 'Courier New', monospace; font-weight: bold; color: white; } .endpoint.public { background: #28a745; } .endpoint.user { background: #17a2b8; } .endpoint.admin { background: #dc3545; } .data-model { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-top: 20px; } .model-card { background: #f8f9fa; padding: 20px; border-radius: 10px; border: 2px solid #e9ecef; } .model-card h4 { color: #2c3e50; margin-bottom: 15px; text-align: center; } .model-card ul { list-style: none; } .model-card li { padding: 5px 0; border-bottom: 1px solid #dee2e6; } .team-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-top: 20px; } .team-member { background: #f8f9fa; padding: 20px; border-radius: 10px; text-align: center; border: 2px solid #e9ecef; } .footer { text-align: center; background: white; padding: 20px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); } .footer p { font-size: 1.2em; color: #2c3e50; } code { background: #f4f4f4; padding: 2px 6px; border-radius: 4px; font-family: 'Courier New', monospace; } pre { background: #2d3748; color: #e2e8f0; padding: 20px; border-radius: 8px; overflow-x: auto; margin: 15px 0; } ul { padding-left: 20px; } li { margin: 8px 0; } @media (max-width: 768px) { .project-header h1 { font-size: 2em; } .endpoints-grid, .data-model, .team-grid { grid-template-columns: 1fr; } } </style><script> // Efeito de digitação no título document.addEventListener('DOMContentLoaded', function() { const title = document.querySelector('.project-header h1'); const originalText = title.textContent; title.textContent = ''; let i = 0; function typeWriter() { if (i < originalText.length) { title.textContent += originalText.charAt(i); i++; setTimeout(typeWriter, 50); } } typeWriter(); }); </script>