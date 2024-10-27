const express = require('express');
const axios = require('axios');


const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000; // Define the port

// Welcome route (optional, uncomment if needed)
// app.get('/Bazar', async (req, res) => {
//   res.send('Welcome to Our small Bookstore..');
// });

// Route to search for topics
app.get('/Bazar/search/:topic', async (req, res) => {
  try {
    const topic = req.params.topic;
    console.log('topic:', topic);

    const response = await axios.get('http://localhost:4000/query', {
      params: { topic }
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error forwarding request:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to get info by ID
app.get('/Bazar/info/:id', async (req, res) => {
  try {
    const id = req.params.id;
    console.log('id:', id);

    const response = await axios.get('http://catalogServer:4000/query', {
      params: { id }
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error forwarding request:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to purchase a book by ID
app.post('/Bazar/purchase/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const response = await axios.post('http://orderServer:5000/purchase', { id: id });

    if (response.status === 200 && response.data.success) {
      res.status(200).json(response.data);
    } else {
      if (response.data.cause === "not found") {
        res.status(404).json({ msg: "Book not found" });
      } else {
        res.status(404).json({ msg: "Stock is empty" });
      }
    }
  } catch (error) {
    console.error('Error processing purchase:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Frontend server is running on port ${PORT}`);
});
