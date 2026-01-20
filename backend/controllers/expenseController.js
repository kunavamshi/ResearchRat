const db = require('../db');

exports.getAllExpenses = async (req, res, next) => {
    try {
        const userId = req.user.id; // From authMiddleware
        const [rows] = await db.query(
            'SELECT * FROM expenses WHERE user_id = ? ORDER BY date DESC, created_at DESC',
            [userId]
        );
        res.status(200).json({ success: true, data: rows });
    } catch (error) {
        next(error);
    }
};

exports.addExpense = async (req, res, next) => {
    try {
        const { amount, category, date, note } = req.body;
        const userId = req.user.id; // From authMiddleware

        if (!amount || amount <= 0 || !category || !date) {
            return res.status(400).json({ success: false, message: 'Please provide valid amount, category and date' });
        }

        const [result] = await db.query(
            'INSERT INTO expenses (amount, category, date, note, user_id) VALUES (?, ?, ?, ?, ?)',
            [amount, category, date, note, userId]
        );

        res.status(201).json({
            success: true,
            data: { id: result.insertId, amount, category, date, note, user_id: userId }
        });
    } catch (error) {
        next(error);
    }
};

exports.deleteExpense = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const [result] = await db.query('DELETE FROM expenses WHERE id = ? AND user_id = ?', [id, userId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Expense not found or unauthorized' });
        }

        res.status(200).json({ success: true, message: 'Expense deleted' });
    } catch (error) {
        next(error);
    }
};

exports.clearAllExpenses = async (req, res, next) => {
    try {
        const userId = req.user.id;
        await db.query('DELETE FROM expenses WHERE user_id = ?', [userId]);
        res.status(200).json({ success: true, message: 'All expenses cleared' });
    } catch (error) {
        next(error);
    }
};
