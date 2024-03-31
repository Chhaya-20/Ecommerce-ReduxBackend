const Product = require("../model/Product");

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
   
    res.send(products);
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};
