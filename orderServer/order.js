import express from 'express';
import axios from 'axios'; 

const app = express();
const PORT = 5000;

app.use(express.json());

app.post('/purchase', async (req, res) => {
    const { id } = req.body;

    try {
        // call catalogServer to handle purchase and stock update
        const response = await axios.post(`http://localhost:4000/handleBookPurchase`, {
            id: id
        });

        return res.status(response.status).json(response.data);
        
    } catch (error) {
        if (error.response) {
            // forward the error response from the catalog server
            return res.status(error.response.status).json(error.response.data);
        } else {
            console.error('Error processing purchase:', error.message);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Order server is running on port ${PORT}`);
});
