const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, reservationController.createReservation);
router.get('/my-reservations', authMiddleware, reservationController.getUserReservations);
router.get('/', authMiddleware, adminMiddleware, reservationController.getAllReservations);
router.get('/:id', authMiddleware, reservationController.getReservationById);
router.put('/:id/cancel', authMiddleware, reservationController.cancelReservation);

module.exports = router;