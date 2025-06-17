import { Request, Response } from "express";
import { pool } from "../db";

// Get all books
export const getAllBooks = async (req: Request, res: Response): Promise<void> => {
    const { page = 1, limit = 10, genre } = req.query;
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);
    
    let baseQuery = `
        SELECT books.*, authors.name AS author_name 
        FROM books 
        LEFT JOIN authors ON books.author_id = authors.id
    `;
    const values: any[] = [];

    if (genre) {
        baseQuery += ` WHERE books.genre = $1`;
        values.push(genre);
        baseQuery += ` ORDER BY publish_date DESC LIMIT $2 OFFSET $3`;
        values.push(parseInt(limit as string), offset);
    } else {
        baseQuery += ` ORDER BY publish_date DESC LIMIT $1 OFFSET $2`;
        values.push(parseInt(limit as string), offset);
    }

    try {
        const result = await pool.query(baseQuery, values);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching books:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


// Get a book by ID
export const getBookById = async (req: Request, res: Response): Promise<void> => {
    const bookId = parseInt(req.params.id);
    
    if (isNaN(bookId)) {
        res.status(400).json({ error: 'Invalid book ID' });
        return;
    }

    try {
        const result = await pool.query('SELECT books.*, authors.name AS author_name FROM books LEFT JOIN authors ON books.author_id = authors.id WHERE books.id = $1', [bookId]);
        
        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Book not found' });
            return;
        }
        
        res.status(200).json(result.rows[0]);
    }catch (error) {
        console.error('Error fetching book:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Create a new book
export const createBook = async (req: Request, res: Response): Promise<void> => {
    const { title, genre, publish_date, author_id } = req.body;

    if (!title || !author_id || !genre || !publish_date) {
        res.status(400).json({ error: 'All fields are required' });
        return;
    }

    try {
        const result = await pool.query(
            'INSERT INTO books (title, author_id, genre, publish_date) VALUES ($1, $2, $3, $4) RETURNING *',
            [title, author_id, genre, publish_date]
        );
        
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating book:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Update a book
export const updateBook = async (req: Request, res: Response): Promise<void> => {
    const bookId = parseInt(req.params.id);
    const { title, genre, publish_date, author_id } = req.body;

    if (isNaN(bookId)) {
        res.status(400).json({ error: 'Invalid book ID' });
        return;
    }

    if (!title || !author_id || !genre || !publish_date) {
        res.status(400).json({ error: 'All fields are required' });
        return;
    }

    try {
        const result = await pool.query(
            'UPDATE books SET title = $1, author_id = $2, genre = $3, publish_date = $4 WHERE id = $5 RETURNING *',
            [title, author_id, genre, publish_date, bookId]
        );

        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Book not found' });
            return;
        }

        res.status(200).json(result.rows[0]);
    }catch (error) {
        console.error('Error updating book:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// Delete a book
export const deleteBook = async (req: Request, res: Response): Promise<void> => {
    const bookId = parseInt(req.params.id);

    if (isNaN(bookId)) {
        res.status(400).json({ error: 'Invalid book ID' });
        return;
    }

    try {
        const result = await pool.query('DELETE FROM books WHERE id = $1 RETURNING *', [bookId]);

        if (result.rows.length === 0) {
            res.status(404).json({ error: 'Book not found' });
            return;
        }

        res.status(204).send();
    } catch (error) {
        console.error('Error deleting book:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}