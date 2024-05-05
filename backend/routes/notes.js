import express from 'express';

import { createNote, deleteNote, getNotes, updateNote, getSelectedNoteDetail } from '../controllers/note.controller.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Routes for notes

// POST: Create a new note
router.post('/create', createNote);

// GET: Retrieve all notes
router.get('/getNotes',getNotes);

// GET: Get the selected note details for update
router.get('/getSelectdNote/:id', getSelectedNoteDetail);

// PUT: Update a note
router.put('/update/:id', updateNote);

// DELETE: Delete a note
router.delete('/delete/:id', deleteNote);

export default router;