import express from 'express';
import axios from 'axios';

const app = express();
app.use(express.json());

const PORT = 3000;
let currentReplica = 0; // To keep track of which replica to use next

// Simple in-memory cache object
const cache = {};

// Round-robin function to switch between two replicas
const getReplicaUrl = () => {
  const replicas = [
    'http://catalogServer1:4000', // First replica
    'http://catalogServer2:4000'  // Second replica
  ];
  currentReplica = (currentReplica + 1) % replicas.length; // Alternate between 0 and 1
  return replicas[currentReplica];
};


// Route to search for books by topic with caching and load balancing
app.get('/Bazar/search/:topic', async (req, res) => {
  const topic = req.params.topic;

  // Check cache first
  if (cache[topic]) {
    console.log('Serving from cache');
    return res.status(200).json(cache[topic]);
  }

  try {
    const replicaUrl = getReplicaUrl(); // Get the replica URL using round-robin
    console.log(`Forwarding request to ${replicaUrl}`);

    const response = await axios.get(`${replicaUrl}/query`, {
      params: { topic }
    });

    // Cache the response
    cache[topic] = response.data;
    res.status(200).json(response.data);

  } catch (error) {
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error('Error forwarding request:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
});

// Route to get info by book ID with caching and load balancing
app.get('/Bazar/info/:id', async (req, res) => {
  const id = req.params.id;

  // Check cache first
  if (cache[id]) {
    console.log('Serving from cache');
    return res.status(200).json(cache[id]);
  }

  try {
    const replicaUrl = getReplicaUrl(); // Get the replica URL using round-robin
    console.log(`Forwarding request to ${replicaUrl}`);

    const response = await axios.get(`${replicaUrl}/query`, {
      params: { id }
    });

    // Cache the response
    cache[id] = response.data;
    res.status(200).json(response.data);

  } catch (error) {
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error('Error forwarding request:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
});

// Route to handle book purchase (decrement quantity) with caching and load balancing
app.post('/Bazar/purchase', async (req, res) => {
  const { id } = req.body;

  try {
    // Get the current replica to handle the request
    const replicaUrl = getReplicaUrl();

    console.log(`Forwarding purchase request to ${replicaUrl}`);

    // Send purchase request to the catalog server to handle quantity decrement
    const response = await axios.post(`${replicaUrl}/handleBookPurchase`, { id });

    // After successfully purchasing the book, invalidate the cache for the updated book info
    delete cache[id]; // Invalidate cache as the data has changed
    res.status(200).json(response.data);

  } catch (error) {
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error('Error forwarding purchase request:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
});

app.listen(PORT, () => {
  console.log(`Frontend server is running on port ${PORT}`);
});
