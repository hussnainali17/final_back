const ProductService = require('../services/product.service');


module.exports.createProduct= async (req, res) => {
    try {
        const product = await ProductService.createProduct(req.body);
        res.status(201).json({ message: "Product created successfully", product });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }

 
}
module.exports.getAllProducts = async (req, res) => {
    try {
        const products = await ProductService.getAllProducts();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
module.exports.DeleteProduct= async (req, res) => {
    try {
        const result = await ProductService.DeleteProduct(req.params.id);
        res.status(200).json({ message: "Product deleted successfully", result });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
module.exports.UpdateProduct= async (req, res) => {
    try {
        //console.log(req);
        const product = await ProductService.UpdateProduct(req.params.id, req.body);
        res.status(200).json({ message: "Product updated successfully", product });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports.getProductById = async (req, res) => {
    try {
        const product = await ProductService.getProductById(req.params.id);
        res.status(200).json(product);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};



module.exports.searchProducts = async (req, res) => {
  try {
    const query = req.query.q || '';
    const { matchedProducts, relatedProducts } = await ProductService.searchProducts(query);

    res.json({
      matched: matchedProducts,
      related: relatedProducts
    });
  } catch (error) {
    console.error("Search Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
