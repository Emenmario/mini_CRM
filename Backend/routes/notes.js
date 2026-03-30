import express from 'express';
import db from '../db.js';
import authMiddleware from '../auth.js';
const router = express.Router();

router.get('/:leadId', async (req, res) => {
    const { leadId } = req.params;
    try {
        const [notes] = await db.execute(
            `SELECT notes.*, users.full_name as author 
             FROM notes 
             JOIN users ON notes.user_id = users.id 
             WHERE notes.lead_id = ? 
             ORDER BY notes.created_at DESC`,
            [leadId]
        );
        res.json(notes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching notes" });
    }
});

router.post('/:leadId', authMiddleware, async (req, res) => {
    const { leadId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    if (!content) return res.status(400).json({ message: "Note cannot be empty" });

    try {
        await db.execute(
            'INSERT INTO notes (lead_id, user_id, content) VALUES (?, ?, ?)',
            [leadId, userId, content]
        );
        res.status(201).json({ message: "Note added!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error saving note" });
    }
});

router.delete('/:noteId', authMiddleware, async (req, res) => {
    const { noteId } = req.params;
    const userId = req.user.id;

    try {
       
        const [result] = await db.execute(
            'DELETE FROM notes WHERE id = ? AND user_id = ?',
            [noteId, userId]
        );

        if (result.affectedRows === 0) {
            return res.status(403).json({ message: "Unauthorized or note not found" });
        }
        res.json({ message: "Note deleted" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting note" });
    }
});

export default router;