const sequelize = require('../config/database');
const User = require('./User');
const Book = require('./Book');
const Reservation = require('./Reservation');

// Associações
User.hasMany(Reservation, { foreignKey: 'userId' });
Reservation.belongsTo(User, { foreignKey: 'userId' });

Book.hasMany(Reservation, { foreignKey: 'bookId' });
Reservation.belongsTo(Book, { foreignKey: 'bookId' });

// Sincronizar banco
sequelize.sync({ force: false }).then(() => {
  console.log('Banco de dados sincronizado');
});

module.exports = {
  User,
  Book,
  Reservation,
  sequelize
};