import { Router } from 'express';
import { getAllBooks, getBookById, createBook, updateBook, deleteBook } from '../controllers/bookController';
import { apiLimiter } from '../middleware/rateLimiter';
import { bookValidator } from '../validators/bookValidator';
import { validate } from '../middleware/validate';

const router = Router();

router.get('/books', apiLimiter, getAllBooks);
router.get('/books/:id', getBookById); 
// router.post('/books', apiLimiter, createBook);
router.put('/books/:id', updateBook);
router.delete('/books/:id', deleteBook);
router.post('/', bookValidator, apiLimiter, validate, createBook);

export default router;
// This file defines the routes for the book resource in the application.
