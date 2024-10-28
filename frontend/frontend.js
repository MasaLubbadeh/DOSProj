import express from 'express';
import axios from 'axios';

const app = express();
app.use(express.json());

const PORT =  3000; // Define the port

// route to search for topics
app.get('/Bazar/search/:topic', async (req, res) => {
  try {
    const topic = req.params.topic;
    console.log('topic:', topic);

    const response = await axios.get('http://catalogServer:4000/query', {
      params: { topic }
    });

    res.status(200).json(response.data);
  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
  }else{
    console.error('Error forwarding request:', error.message);
    res.status(500).json({ error: 'Internal Server Error' }); }
  }
});

// route to get info by ID
app.get('/Bazar/info/:id', async (req, res) => {
  try {
    const id = req.params.id;
    console.log('id:', id);

    const response = await axios.get('http://catalogServer:4000/query', {
      params: { id }
    });

    res.status(200).json(response.data);
  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
  }else{
    console.error('Error forwarding request:', error.message);
    res.status(500).json({ error: 'Internal Server Error' }); }
  }
});

app.post('/Bazar/purchase/:id', async (req, res) => {
  const id = req.params.id;
  console.log('id:', id);
  try {
      const response = await axios.post('http://orderServer:5000/purchase', { id: id });

      if (response.status === 200) {
          res.status(200).json(response.data);
      } else {
          res.status(response.status).json(response.data);
      }
  } catch (error) {
      if (error.response) {
          return res.status(error.response.status).json(error.response.data);
      } else {
          console.error('catch Error processing purchase:', error.message);
          return res.status(500).json({ error: 'Internal Server Error' });
      }
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Frontend server is running on port ${PORT}`);
});
