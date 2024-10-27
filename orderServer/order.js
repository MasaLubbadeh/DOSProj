import express from 'express';
import { data } from '../catalogServer/database.js';

const app = express();
const PORT = 5000;

app.use(express.json());

app.post('/purchase', (req, res) => {
    const { id } = req.body;
    const book = data.getBookInfo(id); // checking if the book exists

    if (!book) { // doesn't exist
        return res.status(404).json({ message: 'Book not found' });
    }

    // check book's quantity (if the book is out of stock)
    if (book.quantity <= 0) {
        return res.status(404).json({ message: 'Book out of stock' });
    }

    // Book found so we should decrement the stock quantity
    book.quantity -= 1;

    // Respond with success
    return res.status(200).json({ message: 'Book purchased successfully', book });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Order server is running on port ${PORT}`);
});
