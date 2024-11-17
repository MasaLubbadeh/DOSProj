import express from "express";
import axios from "axios";
import { data, getBooksByTopic, getBookInfo } from "./database.js";

const app = express();
const PORT = 4000;
app.use(express.json());

let currentReplica = 0; // To keep track of which replica we are working with

// Function to get the URL of the other replica (round-robin logic)
const getOtherReplicaUrl = () => {
  const replicas = [
    'http://catalogServer1:4000', // First replica
    'http://catalogServer2:4000'  // Second replica
  ];
  return replicas[(currentReplica + 1) % replicas.length]; // Switch between 0 and 1
};

// Route to query for books by topic or id
app.get("/query", (req, res) => {
  const { topic, id } = req.query;

  if (id) {
    const book = getBookInfo(id);
    if (book) {
      return res.status(200).json({
        title: book.title,
        quantity: book.quantity,
        price: book.price
      });
    } else {
      return res.status(404).json({ error: "Book not found" });
    }
  }

  if (topic) {
    const booksByTopic = getBooksByTopic(topic);
    const returnedBooks = booksByTopic.map(book => ({
      id: book.id,
      title: book.title
    }));

    if (returnedBooks.length === 0) {
      return res.status(404).json({ error: "No books were found for this topic" });
    }
    return res.status(200).json(returnedBooks);
  }

  return res.status(400).json({ error: "parameters are not enough" });
});

// Route to handle book purchase, decrementing quantity
app.post('/handleBookPurchase', async (req, res) => {
  const { id } = req.body;

  const book = getBookInfo(id);  // Check if the book exists
  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }

  if (book.quantity <= 0) {  // If the book is out of stock
    return res.status(400).json({ message: 'Stock is empty' });
  }

  // Decrement quantity in the current replica
  book.quantity -= 1;

  // Get the URL of the other replica
  const otherReplicaUrl = getOtherReplicaUrl();

  try {
    // Notify the other replica to decrement the quantity there too
    await axios.post(`${otherReplicaUrl}/decrementQuantity`, { id });
    return res.status(200).json({ message: `Book ${book.title} purchased successfully`, book });
  } catch (error) {
    console.error('Error updating the other replica:', error.message);
    // If we can't update the other replica, we can either revert the decrement or handle it as needed
    res.status(500).json({ message: 'Internal error while updating other replica' });
  }
});

// Route to decrement the quantity in the catalog server
app.post('/decrementQuantity', (req, res) => {
  const { id } = req.body;
  const book = getBookInfo(id);

  if (book) {
    book.quantity -= 1; // Decrement quantity on this replica
    return res.status(200).json({ message: `Quantity decremented for ${book.title}`, book });
  }

  return res.status(404).json({ message: 'Book not found' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Catalog server is running on port ${PORT}`);
});
