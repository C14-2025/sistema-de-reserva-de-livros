const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware');

router.get('/', bookController.getAllBooks);
router.post('/', authMiddleware, adminMiddleware, bookController.createBook);
router.put('/:id', authMiddleware, adminMiddleware, bookController.updateBook);
router.delete('/:id', authMiddleware, adminMiddleware, bookController.deleteBook);

module.exports = router;