const express = require('express');
const router = express.Router();
const Cart = require('../models/cart.model');
const authMiddleware = require('../middlewares/auth.middleware');
const cartController = require('../controllers/cart.controller');
//const {isAdmin} = require('../middlewares/admin.middleware')
// ➕ Add item to cart
router.post('/add',cartController.add);

// 🗑️ Remove item
router.post('/remove', authMiddleware.authUser,cartController.remove);

// 📥 Get cart
router.post('/get', authMiddleware.authUser,cartController.getCart);

module.exports = router;
