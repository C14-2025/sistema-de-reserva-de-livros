// const express = require('express');
// const cors = require('cors');
// const app = express();

// // Middlewares
// app.use(cors());
// app.use(express.json());

// // Importar modelos para sincronizar o banco
// require('./models');

// // Rotas
// try {
//   app.use('/api/auth', require('./routes/authRoutes'));
//   app.use('/api/books', require('./routes/bookRoutes'));
//   app.use('/api/reservations', require('./routes/reservationRoutes'));
//   app.use('/api/users', require('./routes/userRoutes'));
// } catch (error) {
//   console.log('⚠️  Algumas rotas não foram carregadas:', error.message);
// }

// // Rota inicial
// app.get('/', (req, res) => {
//   res.json({ message: 'Sistema de Reserva de Livros - API' });
// });

// // Rota de fallback para rotas não encontradas
// app.use('*', (req, res) => {
//   res.status(404).json({ error: 'Rota não encontrada' });
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Servidor rodando na porta ${PORT}`);
// });

const express = require('express');
const cors = require('cors');
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Importar modelos para sincronizar o banco
require('./models');

// Sistema de diagnóstico de rotas
console.log('🔍 Carregando rotas...');

// Teste cada rota individualmente
try {
  app.use('/api/auth', require('./routes/authRoutes'));
  console.log('✅ Rotas de auth carregadas');
} catch (error) {
  console.log('❌ Erro nas rotas de auth:', error.message);
}

try {
  app.use('/api/books', require('./routes/bookRoutes'));
  console.log('✅ Rotas de books carregadas');
} catch (error) {
  console.log('❌ Erro nas rotas de books:', error.message);
}

try {
  app.use('/api/reservations', require('./routes/reservationRoutes'));
  console.log('✅ Rotas de reservations carregadas');
} catch (error) {
  console.log('❌ Erro nas rotas de reservations:', error.message);
}

try {
  app.use('/api/users', require('./routes/userRoutes'));
  console.log('✅ Rotas de users carregadas');
} catch (error) {
  console.log('❌ Erro nas rotas de users:', error.message);
}

console.log('🎯 Todas as rotas processadas');

// Rota inicial
app.get('/', (req, res) => {
  res.json({ 
    message: 'Sistema de Reserva de Livros - API',
    status: 'Online',
    timestamp: new Date().toISOString()
  });
});

// Rota de saúde da API
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK',
    database: 'SQLite',
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📚 Sistema de Reserva de Livros - Backend`);
  console.log(`📍 URL: http://localhost:${PORT}`);
});