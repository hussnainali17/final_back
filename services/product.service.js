const products = require('../models/product.model');

module.exports.createProduct= async ({ title, description, price, stock, category, images }) => {
    if (!title || !price) {
        throw new Error('Title and price are required');
    }

    const newProduct = {
        title,
        description,
        price,
        stock: stock || 0,
        category: category || 'General',
        images: images || [],
        createdAt: new Date(),
    };

    const product = await products.create(newProduct);
    return product;
}
module.exports.getAllProducts = async () => {
    const allProducts = await products.find();
    return allProducts;
}

module.exports.DeleteProduct = async (id) => {
    const result = await products.findByIdAndDelete(id);
    if (!result) {
        throw new Error('Product not found');
    }
    return result;
}

module.exports.UpdateProduct = async (id, updates) => {
    const product = await products.findOneAndUpdate({ _id: id }, updates, { new: true, runValidators: true });
    if (!product) {
        throw new Error('Product not found');
    }
    return product;
}
module.exports.getProductById = async (id) => {
    const product = await products.findById(id);
    if (!product) {
        throw new Error('Product not found');
    }
    return product;
}

// services/productService.js
//const Product = require('../models/Product');

module.exports.searchProducts = async (query) => {
  // 1. Find matching products by name
  const matchedProducts = await products.find({
    title: { $regex: query, $options: 'i' }
  });
  // 2. Extract categories from matched products
  const categories = [...new Set(matchedProducts.map(p => p.category))];

  // 3. Find more products in those categories (excluding exact matches)
  const relatedProducts = await products.find({
    category: { $in: categories },
    name: { $not: { $regex: query, $options: 'i' } }
  });

  return { matchedProducts, relatedProducts };
};


