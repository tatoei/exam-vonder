import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

// Connect to MongoDB
mongoose.connect('mongodb+srv://toeiisararawee:toeiisararawee@cluster0.1rbut.mongodb.net/')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

const app = express();

app.use(cors());
app.use(express.json());

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});