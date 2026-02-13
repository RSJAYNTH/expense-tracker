const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));

// --- Data Layer ---

const readData = () => {
    try {
        if (!fs.existsSync(DATA_FILE)) {
            writeData([]);
            return [];
        }
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data || '[]');
    } catch (err) {
        console.error("Data read error:", err);
        return [];
    }
};

const writeData = (data) => {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
        return true;
    } catch (err) {
        console.error("Data write error:", err);
        return false;
    }
};

// --- Routes ---

// GET /expenses
app.get('/expenses', (req, res) => {
    const expenses = readData();
    res.json(expenses.sort((a, b) => new Date(b.date) - new Date(a.date))); // Newest first
});

// POST /expenses
app.post('/expenses', (req, res) => {
    const { description, amount, category } = req.body;

    if (!description || !amount || !category) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const expenses = readData();
    const newExpense = {
        id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(), // Fallback for older Node
        description,
        amount: parseFloat(amount),
        category,
        date: new Date().toISOString()
    };

    expenses.push(newExpense);
    writeData(expenses);
    res.status(201).json(newExpense);
});

// PUT /expenses/:id
app.put('/expenses/:id', (req, res) => {
    const { id } = req.params;
    const { description, amount, category } = req.body;

    let expenses = readData();
    const index = expenses.findIndex(e => e.id === id);

    if (index === -1) {
        return res.status(404).json({ error: 'Expense not found' });
    }

    // Update only provided fields
    if (description) expenses[index].description = description;
    if (amount) expenses[index].amount = parseFloat(amount);
    if (category) expenses[index].category = category;

    writeData(expenses);
    res.json(expenses[index]);
});

// DELETE /expenses/:id
app.delete('/expenses/:id', (req, res) => {
    const { id } = req.params;
    let expenses = readData();
    const initialLength = expenses.length;
    expenses = expenses.filter(e => e.id !== id);

    if (expenses.length === initialLength) {
        return res.status(404).json({ error: 'Expense not found' });
    }

    writeData(expenses);
    res.json({ message: 'Deleted successfully' });
});

// GET /summary
app.get('/summary', (req, res) => {
    const expenses = readData();

    const total = expenses.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);

    const categoryTotals = expenses.reduce((acc, item) => {
        const cat = item.category || 'Misc';
        acc[cat] = (acc[cat] || 0) + (parseFloat(item.amount) || 0);
        return acc;
    }, {});

    res.json({
        total,
        count: expenses.length,
        categoryTotals
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
