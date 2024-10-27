import express from "express";
import { data, getBooksByTopic, getBookInfo } from "./database.js";

const app = express();
const PORT = 4000;
app.use(express.json());

app.get("/query", (req, res) => {
  const { topic, id } = req.query;

  if (id) {
    //search book by id
    const book = getBookInfo(id);

    if (book) {
      return res.status(200).json(book);
    } else {
      return res.status(404).json({ error: "Book not found" });
    }
  }

  if (topic) {
    // search by topic
    const booksByTopic = getBooksByTopic(topic);
    if (booksByTopic.length === 0) {
      return res.status(404).json({ error: "No books were found for this topic" });
    }
    return res.status(200).json(booksByTopic);
  }

  return res.status(400).json({ error: "parameters are not enough" });
});

app.post('/handleBookPurchase', (req, res) => {
  const { id } = req.body;

  const book = getBookInfo(id);  // check if the book exists
  if (!book) {
      return res.status(404).json({ message: 'Book not found' });
  }

  if (book.quantity <= 0) {  //if the book is out of stock
      return res.status(400).json({ message: 'Stock is empty' }); // changed to 400 for clarity
  }

  book.quantity -= 1;//stock

  return res.status(200).json({ message: 'Book purchased successfully', book });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Catalog server is running on port ${PORT}`);
});