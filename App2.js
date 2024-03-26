const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection
mongoose.connect('mongodb://localhost/money_tracker', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Error connecting to MongoDB:', err));

// Serve static files
app.use(express.static('public'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Transaction model
const Transaction = mongoose.model('Transaction', {
    type: String,
    description: String,
    amount: Number
});

// Route to fetch transactions
app.get('/transactions', async (req, res) => {
    try {
        const transactions = await Transaction.find();
        res.json(transactions);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Route to add a transaction
app.post('/transactions', async (req, res) => {
    const { type, description, amount } = req.body;
    try {
        const newTransaction = new Transaction({ type, description, amount });
        await newTransaction.save();
        res.status(201).send('Transaction added successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Start server
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
