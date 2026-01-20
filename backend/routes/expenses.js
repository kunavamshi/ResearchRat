const express = require('express');
const router = express.Router();
const { getAllExpenses, addExpense, deleteExpense, clearAllExpenses } = require('../controllers/expenseController');

router.get('/', getAllExpenses);
router.post('/', addExpense);
router.delete('/:id', deleteExpense);
router.delete('/', clearAllExpenses);

module.exports = router;
