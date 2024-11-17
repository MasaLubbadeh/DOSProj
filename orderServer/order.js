import express from 'express';
import axios from 'axios';

const app = express();
const PORT = 5000;

app.use(express.json());

// Helper function to get the appropriate catalog server replica for load balancing
let currentReplica = 0; // To keep track of which replica to use next
const getReplicaUrl = () => {
    const replicas = [
        'http://catalogServer:4000', // First replica
        'http://catalogServerReplica:4000'  // Second replica
    ];
    currentReplica = (currentReplica + 1) % replicas.length; // Alternate between 0 and 1
    return replicas[currentReplica];
};

// Purchase route that interacts with the catalog server
app.post('/purchase', async (req, res) => {
    const { id } = req.body;

    try {
        // Get the appropriate catalog server replica using round-robin
        const replicaUrl = getReplicaUrl();

        console.log(`Forwarding purchase request to ${replicaUrl}`);

        // Call the catalog server to handle purchase and stock update
        const response = await axios.post(`${replicaUrl}/handleBookPurchase`, { id });

        // Return the status and response from the catalog server
        return res.status(response.status).json(response.data);

    } catch (error) {
        if (error.response) {
            // Forward the error response from the catalog server
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
