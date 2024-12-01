const express = require('express');
const path = require('path');
require('dotenv').config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'Public')));

// Routes for HTML pages
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'Public/VIEWS/homepage.html')));
app.get('/about', (req, res) => res.sendFile(path.join(__dirname, 'Public/VIEWS/AboutUs.html')));
app.get('/contact', (req, res) => res.sendFile(path.join(__dirname, 'Public/VIEWS/ContactUs.html')));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'Public/VIEWS/login.html')));
app.get('/signup', (req, res) => res.sendFile(path.join(__dirname, 'Public/VIEWS/sign-up.html')));
app.get('/personal', (req, res) => res.sendFile(path.join(__dirname, 'Public/VIEWS/personal.html')));
app.get('/review', (req, res) => res.sendFile(path.join(__dirname, 'Public/VIEWS/review.html')));
app.get('/saved', (req, res) => res.sendFile(path.join(__dirname, 'Public/VIEWS/saved.html')));

// Dynamic routes for chill pages
app.get('/chill/:id', (req, res) => {
    const chillId = req.params.id;
    const filePath = path.join(__dirname, `Public/VIEWS/chill${chillId}.html`);
    res.sendFile(filePath);
});

// Dynamic routes for cook pages
app.get('/cook/:id', (req, res) => {
    const cookId = req.params.id;
    const filePath = path.join(__dirname, `Public/VIEWS/cook${cookId}.html`);
    res.sendFile(filePath);
});

// Starting the server
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
