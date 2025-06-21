const express = require('express');
const router = express.Router();
const Product = require('../models/product.model');
const isAdmin = require('../middlewares/admin.middleware');
const { authUser } = require('../middlewares/auth.middleware');
const productController = require('../controllers/product.controller');



router.post('/products_add', authUser, isAdmin, productController.createProduct);

// READ ALL
 router.get('/products', productController.getAllProducts);
//router.get('/products', productController.getAllProducts);

// READ ONE
router.get('/product/:id', productController.getProductById);
//router.get('/products/:id', productController.getProductById);

// UPDATE
router.put('/products/:id', authUser, isAdmin, productController.UpdateProduct);
//router.put('/products/:id', productController.UpdateProduct);
// DELETE
router.delete('/products/:id', authUser, isAdmin, productController.DeleteProduct);
// router.delete('/products/:id', productController.DeleteProduct);

router.get('/search',productController.searchProducts)

module.exports = router;
