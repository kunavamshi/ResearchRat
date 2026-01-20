// Check Auth first
const token = localStorage.getItem('token');
if (!token) {
    window.location.href = 'login.html';
}

const API_URL = '/api/expenses';

// DOM Elements
const expenseForm = document.getElementById('expense-form');
const expenseList = document.getElementById('expense-list');
const totalAmountEl = document.getElementById('total-amount');
const totalTransactionsEl = document.getElementById('total-transactions');
const topCategoryEl = document.getElementById('top-category');
const clearAllBtn = document.getElementById('clear-all-btn');
const logoutBtn = document.getElementById('logout-btn');
const noDataMessage = document.getElementById('no-data-message');
const ctx = document.getElementById('expenseChart').getContext('2d');
const userGreeting = document.getElementById('user-greeting');

// Show user name
const user = JSON.parse(localStorage.getItem('user'));
if (user && userGreeting) {
    userGreeting.innerText = `Hello, ${user.username}`;
}

// Global Fetch Wrapper for Auth
async function authFetch(url, options = {}) {
    const headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };

    const res = await fetch(url, { ...options, headers });

    if (res.status === 401 || res.status === 403) {
        window.location.href = 'login.html';
        return null;
    }

    return res;
}


let expenses = [];
let expenseChart;

// Format Currency (INR)
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR'
    }).format(amount);
};

// Fetch Expenses
async function fetchExpenses() {
    try {
        const res = await authFetch(API_URL);
        if (!res) return;

        const data = await res.json();


        if (data.success) {
            expenses = data.data;
            renderExpenses();
            updateSummary();
            updateChart();
        }
    } catch (error) {
        console.error('Error fetching expenses:', error);
    }
}

// Render Expenses to Table
function renderExpenses() {
    expenseList.innerHTML = '';

    if (expenses.length === 0) {
        noDataMessage.classList.remove('hidden');
        return;
    }

    noDataMessage.classList.add('hidden');

    expenses.forEach(expense => {
        const row = document.createElement('tr');
        const date = new Date(expense.date).toLocaleDateString('en-GB');

        row.innerHTML = `
            <td>${date}</td>
            <td><span class="category-badge">${expense.category}</span></td>
            <td>${expense.note || '-'}</td>
            <td class="amount">${formatCurrency(expense.amount)}</td>
            <td>
                <button class="delete-btn" onclick="deleteExpense(${expense.id})">
                    <span class="icon">🗑</span>
                </button>
            </td>
        `;
        expenseList.appendChild(row);
    });
}

// Add Expense
expenseForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const amount = +document.getElementById('amount').value;
    const category = document.getElementById('category').value;
    const date = document.getElementById('date').value;
    const note = document.getElementById('note').value;

    if (!amount || !category || !date) {
        alert('Please fill in all required fields');
        return;
    }

    const newExpense = { amount, category, date, note };

    try {
        const res = await authFetch(API_URL, {
            method: 'POST',
            body: JSON.stringify(newExpense)
        });
        if (!res) return;

        const data = await res.json();


        if (data.success) {
            expenses.unshift(data.data); // Add to beginning
            renderExpenses();
            updateSummary();
            updateChart();
            expenseForm.reset();
        }
    } catch (error) {
        console.error('Error adding expense:', error);
    }
});

// Delete Expense
async function deleteExpense(id) {
    if (!confirm('Are you sure you want to delete this expense?')) return;

    try {
        const res = await authFetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        if (!res) return;

        const data = await res.json();


        if (data.success) {
            expenses = expenses.filter(exp => exp.id !== id);
            renderExpenses();
            updateSummary();
            updateChart();
        }
    } catch (error) {
        console.error('Error deleting expense:', error);
    }
}

// Clear All Expenses
clearAllBtn.addEventListener('click', async () => {
    if (!confirm('Are you sure you want to clear ALL expenses? This cannot be undone.')) return;

    try {
        const res = await authFetch(API_URL, {
            method: 'DELETE'
        });
        if (!res) return;

        const data = await res.json();


        if (data.success) {
            expenses = [];
            renderExpenses();
            updateSummary();
            updateChart();
        }
    } catch (error) {
        console.error('Error clearing expenses:', error);
    }
});

// Logout
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'login.html';
    });
}


// Update Summary Cards
function updateSummary() {
    const totalAmount = expenses.reduce((acc, exp) => acc + Number(exp.amount), 0);
    const totalTransactions = expenses.length;

    // Highest Spending Category
    const categoryTotals = {};
    expenses.forEach(exp => {
        categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + Number(exp.amount);
    });

    let topCategory = '-';
    let maxAmount = 0;

    for (const [cat, amt] of Object.entries(categoryTotals)) {
        if (amt > maxAmount) {
            maxAmount = amt;
            topCategory = cat;
        }
    }

    totalAmountEl.innerText = formatCurrency(totalAmount);
    totalTransactionsEl.innerText = totalTransactions;
    topCategoryEl.innerText = topCategory;
}

// Update Chart
function updateChart() {
    const categories = ['Food', 'Travel', 'Rent', 'Shopping', 'Others'];
    const categoryTotals = categories.map(cat => {
        return expenses
            .filter(exp => exp.category === cat)
            .reduce((acc, exp) => acc + Number(exp.amount), 0);
    });

    if (expenseChart) {
        expenseChart.destroy();
    }

    expenseChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: categories,
            datasets: [{
                label: 'Expenses by Category',
                data: categoryTotals,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(153, 102, 255, 0.7)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)'
                ],
                borderWidth: 1,
                borderRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

// Initialize
// Expose deleteExpense to window so onclick works
window.deleteExpense = deleteExpense;
fetchExpenses();
