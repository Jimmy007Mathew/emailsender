require('dotenv').config(); // Load .env file

const express = require('express');
const mongoose = require('mongoose');
const checkVaccinationsAndSendReminders = require('./services/vaccinationReminder');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors()); // Enable cross-origin requests\

const cron = require('node-cron');


// Use the MongoDB URL from .env
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));

cron.schedule('07 14 * * *', () => {
    console.log("Running vaccination reminder task...");
    checkVaccinationsAndSendReminders();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));