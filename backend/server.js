const express = require('express');
const cors = require('cors');
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Importar modelos para sincronizar o banco
require('./models');

// Rotas
try {
  app.use('/api/auth', require('./routes/authRoutes'));
  app.use('/api/books', require('./routes/bookRoutes'));
  app.use('/api/reservations', require('./routes/reservationRoutes'));
  app.use('/api/users', require('./routes/userRoutes'));
} catch (error) {
  console.log('⚠️  Algumas rotas não foram carregadas:', error.message);
}

// Rota inicial
app.get('/', (req, res) => {
  res.json({ message: 'Sistema de Reserva de Livros - API' });
});

// Rota de fallback para rotas não encontradas
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
