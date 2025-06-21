const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/user.routes'); // Assuming you have a users.js route file
const adminRoutes = require('./routes/admin.routes'); // Assuming you have an admin.js route file
const cartRoutes = require('./routes/cart.routes'); // Assuming you have a cart.js route file
dotenv.config();
app.use(express.json()); // Correct: Mounting middleware
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: 'http://localhost:5173', // React frontend URL
  credentials: true                // ✅ Allow cookies to be sent
}));

app.use(cookieParser());

const ConnectToDB = require('./db/db');
ConnectToDB();


app.use('/users', userRoutes); // Correct: Mounting a router
app.use('/admin', adminRoutes); // Correct: Mounting a router
app.use('/cart', cartRoutes); // Correct: Mounting a router
app.get('/', (req, res) => {
  res.send("hello world");
});

module.exports = app;