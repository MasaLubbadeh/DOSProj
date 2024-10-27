import express from "express";
import { data } from "./database.js";

const app = express();
const PORT = 4000;
app.use(express.json());

app.get("/query", (req, res) => {
  const { topic, id } = req.query;

  if (id) {
    //search book by id
    const book = data.getBookInfo(id);
    if (book) {
      return res.status(200).json(book);
    } else {
      return res.status(404).json({ error: "Book not found" });
    }
  }

  if (topic) {
    // search by topic
    const booksByTopic = data.getBooksByTopic(topic);
    return res.status(200).json(booksByTopic);
  }

  return res.status(400).json({ error: " parameters are not enough " });
});

app.listen(PORT, () => {
  console.log(`catalog server  is running on  port ${PORT}`);
});
