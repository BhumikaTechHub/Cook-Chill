const express = require('express');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');

// const hbs = require('hbs');
// const { title } = require('process');
require('dotenv').config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()); // To parse JSON requests
app.use(cors());

app.use('/CSS', express.static(path.join(__dirname, 'CSS')));


// MongoDB connection string
const con_string = process.env.MONGO_URI || "mongodb+srv://bhumikayadav23cse:0KeMa5ztJnKDs2tT@studentscluster.bypu2.mongodb.net/?retryWrites=true&w=majority&appName=StudentsCluster";

// Connect to MongoDB Atlas
mongoose.connect(con_string)
    .then(() => console.log('Database is connected'))
    .catch((err) => console.log('Database connection error:', err));



// User Schema
const userSchema = new mongoose.Schema({
    USERNAME: { type: String, required: true, unique: true },
    EMAIL: { type: String, required: true, unique: true },
    PASSWORD: { type: String, required: true },
});

// Create the model
const User = mongoose.model('User', userSchema);

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'Public', 'VIEWS')); // Set the views folder path

// // Set view engine to Handlebars
// app.set('view engine', 'hbs');
// app.set('views', path.join(__dirname, 'Public', 'VIEWS','handlebars'));

// // Register partials
// hbs.registerPartials(path.join(__dirname, 'Public', 'VIEWS/PARTIALS'));

// // Helper for comparisons
// hbs.registerHelper('eq', (a, b) => a === b);

// Function to render HTML content dynamically with EJS
function renderHtmlWithEjs(filePath, res) {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading HTML file');
            return;
        }
        res.render('layout', {
            title: 'homepage', // Title passed dynamically
            body: data  // Inject HTML content dynamically
        });
    });
}

// Routes for static HTML pages
app.get('/', (req, res) => {
    renderHtmlWithEjs(path.join(__dirname, 'Public/VIEWS/homepage.html'), res);
});

// Function to render HTML content dynamically with the appropriate layout
function renderDynamicHtml(filePath, res, layout, title) {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading HTML file');
            return;
        }
        res.render(layout, {
            title: title || 'Dynamic Page', // Title passed dynamically
            body: data  // Inject HTML content dynamically
        });
    });
}

// Updated Chill routes to use layout-chill.ejs
app.get('/chill/:id', (req, res) => {
    const chillId = req.params.id;
    const filePath = path.join(__dirname, `Public/VIEWS/chill${chillId}.html`);
    renderDynamicHtml(filePath, res, 'layout-chill', `Chill ${chillId}`);
});

// Updated Cook routes to use layout-cook.ejs
app.get('/cook/:id', (req, res) => {
    const cookId = req.params.id;
    const filePath = path.join(__dirname, `Public/VIEWS/cook${cookId}.html`);
    renderDynamicHtml(filePath, res, 'layout-cook', `Cook ${cookId}`);
});

// // Function to render HTML content dynamically with Handlebars
// function renderHtmlWithHbs(filePath, res, layout, title, pageType) {
//     fs.readFile(filePath, 'utf8', (err, data) => {
//         if (err) {
//             res.status(500).send('Error reading HTML file');
//             return;
//         }
//         res.render(layout, {
//             title: title || 'Page',
//             body: data,
//             pageType: pageType
//         });
//     });
// }

// // Routes
// app.get('/', (req, res) => {
//     const filePath = path.join(__dirname, 'Public/VIEWS/homepage.html');
//     renderHtmlWithHbs(filePath, res, 'layout', 'Home Page', 'homepage');
// });

// app.get('/chill/:id', (req, res) => {
//     const chillId = req.params.id;
//     const filePath = path.join(__dirname, `Public/VIEWS/chill${chillId}.html`);
//     renderHtmlWithHbs(filePath, res, 'layout-chill', `Chill ${chillId}`, 'chill');
// });

// app.get('/cook/:id', (req, res) => {
//     const cookId = req.params.id;
//     const filePath = path.join(__dirname, `Public/VIEWS/cook${cookId}.html`);
//     renderHtmlWithHbs(filePath, res, 'layout-cook', `Cook ${cookId}`, 'cook');
// });



// Routes for HTML pages
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'Public/VIEWS/homepage.html')));
app.get('/AboutUs', (req, res) => res.sendFile(path.join(__dirname, 'Public/VIEWS/AboutUs.html')));
app.get('/ContactUs', (req, res) => res.sendFile(path.join(__dirname, 'Public/VIEWS/ContactUs.html')));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'Public/VIEWS/login.html')));
app.get('/sign-up', (req, res) => res.sendFile(path.join(__dirname, 'Public/VIEWS/sign-up.html')));
app.get('/personal', (req, res) => res.sendFile(path.join(__dirname, 'Public/VIEWS/personal.html')));
app.get('/review', (req, res) => res.sendFile(path.join(__dirname, 'Public/VIEWS/review.html')));
app.get('/saved', (req, res) => res.sendFile(path.join(__dirname, 'Public/VIEWS/saved.html')));



// Route to fetch the JSON data
app.get('/api/cook1', (req, res) => {
    const jsonFilePath = path.join(__dirname, 'Public/JSON/cook1.json');
    fs.readFile(jsonFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading JSON file:', err);
            res.status(500).send('Error fetching data');
        } else {
            res.setHeader('Content-Type', 'application/json');
            res.send(data);
        }
    });
});

//COOK 3 

// Recipe Schema
const recipeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    ingredients: { type: String, required: true },
    category: { type: String, required: true, enum: ['Breakfast', 'Lunch', 'Dinner', 'Dessert'] },
    tags: [{ type: String }],
});

const Recipe = mongoose.model('Recipe', recipeSchema);

app.use(bodyParser.json()); // To parse JSON bodies

/* POST route to add a recipe
app.post('/api/recipes', async (req, res) => {
    try {
        const recipe = new Recipe(req.body);
        await recipe.save();
        res.status(201).json({ message: 'Recipe added successfully' });
    } catch (error) {
        console.error('Error adding recipe:', error);
        res.status(500).json({ message: 'Error adding recipe', error });
    }
});

// GET route to fetch recipes
app.get('/api/recipes', async (req, res) => {
    try {
        const recipes = await Recipe.find();
        res.json(recipes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching recipes', error });
    }
});
*/



// Route to save the recipe
app.post('/add-recipe', async (req, res) => {
    const { title, description, ingredients, category, tags } = req.body;

    const newRecipe = new Recipe({ title, description, ingredients, category, tags });

    /* newRecipe.save((err) => {
         if (err) {
             return res.status(500).send('Error saving recipe');
         }
         res.status(200).send('Recipe saved successfully');
     });*/


    try {
        // Save the recipe using async/await
        await newRecipe.save();
        res.status(200).send('Recipe saved successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error saving recipe');
    }

});









































/*Authentication Routes
// Sign Up Route (Create new user)
app.post('/signup', async (req, res) => {
    
    try {
        const { USERNAME, EMAIL,PASSWORD } = req.body;

        //const existingUser = await User.findOne({ EMAIL });
        //if (existingUser) {
          //  return res.status(400).json({ message: 'Email is already registered.' });
       // }
        // Hash the password
        // const hashedPassword = await bcrypt.hash(PASSWORD, 10);
        if (!USERNAME || !EMAIL || !PASSWORD) {
            return res.status(400).json({ message: 'All fields are required.' });
        }


        // // Create new user
        // const newUser = new User({ USERNAME, PASSWORD: hashedPassword });
        // await newUser.save();

        const user = new User({ username: USERNAME, email: EMAIL, password:PASSWORD});
        await user.save();

        res.status(201).json({ message: 'User signed up successfully!' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Error signing up user' });
    }
});*/



app.post('/signup', async (req, res) => {
    try {
        const { USERNAME, EMAIL, PASSWORD } = req.body;

        if (!USERNAME || !EMAIL || !PASSWORD) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(PASSWORD, 10);

        // Create new user
        const user = new User({ USERNAME, EMAIL, PASSWORD: hashedPassword });
        await user.save();

        res.status(201).json({ message: 'User signed up successfully!' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Error signing up user' });
    }
});


// Login Route (Authenticate user)
app.post('/login', async (req, res) => {
    const { USERNAME, PASSWORD } = req.body;

    try {
        // Find the user by username
        const user = await User.findOne({ USERNAME });

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(PASSWORD, user.PASSWORD);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        // Create a JWT token
        const token = jwt.sign({ USERNAME: user.USERNAME }, 'your_secret_key', { expiresIn: '1h' });

        res.status(200).json({ message: 'Login successful', token });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Error logging in user' });
    }
});

// Starting the server
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
