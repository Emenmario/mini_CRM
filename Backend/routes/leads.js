import express from 'express'
import db from "../db.js"

const router = express.Router();

router.get('/', async (req, res) => {
    const { search, status } = req.query;
    let sql = "SELECT * FROM leads WHERE assigned_to = ?";
    let params = [req.user.id];

    if (search) {
        sql += " AND (name LIKE ? OR email LIKE ?)";
        params.push(`%${search}%`, `%${search}%`);
    }

    if (status && status !== 'All Status') {
        sql += " AND status = ?";
        params.push(status);
    }

    sql += " ORDER BY date_added DESC";

    try {
        const [rows] = await db.execute(sql, params);
        res.json(rows);
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: error.message });
    }
});
router.post("/", async (req, res) => {
    const { name, email, phone, status } = req.body;
    try {
        const [result] = await db.execute(
            "INSERT INTO leads (name, email, phone, status, assigned_to) VALUES (?, ?, ?, ?, ?)",
            [name, email, phone, status || "new", req.user.id]
        );
        res.status(201).json({ id: result.insertId, message: "Lead created" });
    } catch (error) {
        console.error(error)
        if (error.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ message: "This email is already in our system." });
    }
        res.status(500).send(error.message);
    }
});

router.patch("/:id", async (req, res) => {
    const id = req.params.id;
    const { status } = req.body;
    try {
        const [result] = await db.execute(
            "UPDATE leads SET status = ? WHERE id = ? AND assigned_to = ?", 
            [status, id, req.user.id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "unauthorized" });
        }
        res.json({ message: "updated" });
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: error.message });
    }
});

router.delete("/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const [result] = await db.execute(
            "DELETE FROM leads WHERE id = ? AND assigned_to = ?", 
            [id, req.user.id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "unauthorized" });
        }
        res.json({ message: "deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;