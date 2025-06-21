const mongoose = require('mongoose');
const cartService = require('../services/cart.service');
const Cart = require('../models/cart.model');
module.exports.add = async (req, res) => {
  
    
  const { items, userId } = req.body;
 

  if (!Array.isArray(items) || items.length === 0 || !userId) {
    return res.status(400).json({ message: 'userId and at least one item with productId and quantity are required' });
  }

  const { productId, quantity } = items[0]; // Assuming only one item for now

  if (!productId || !quantity) {
    return res.status(400).json({ message: 'productId and quantity are required in items[0]' });
  }

  let cart = await Cart.findOne({ userId });

  if (!cart) {
    // Create new cart
    cart = new Cart({ userId, items: [{ productId, quantity }] });
  } else {
    const itemIndex = cart.items.findIndex(item => item.productId && item.productId.toString() === productId);

    if (itemIndex > -1) {
      // Product already in cart, increase quantity
      cart.items[itemIndex].quantity += quantity;
    } else {
      // New product
      cart.items.push({ productId, quantity });
    }
  }

  await cart.save();
  res.json(cart);
};

module.exports.getCart = async (req, res) => {
  const userId = req.body.userId;

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    const cart = await Cart.findOne({ userId })
      .populate('items.productId', 'title price images description stock category');

    if (!cart || cart.items.length === 0) {
      return res.status(200).json({ message: 'Cart is empty', items: [] });
    }

    // Filter out items where product has been deleted (null) or quantity is 0
    const filteredItems = cart.items.filter(item => item.productId && item.quantity > 0);

    return res.status(200).json({
      items: filteredItems,
      totalItems: filteredItems.length
    });

  } catch (err) {
    console.error('Error getting cart:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};


module.exports.remove = async (req, res) => {
  try {
    const { productId, userId } = req.body.data;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(
      item => item.productId.toString() === productId
    );

    if (itemIndex > -1) {
      // Decrement quantity
      cart.items[itemIndex].quantity -= 1;

      // Remove the item if quantity is 0 or less
      if (cart.items[itemIndex].quantity <= 0) {
        cart.items.splice(itemIndex, 1);
      }

      // If all items removed, clear the cart
      if (cart.items.length === 0) {
        await Cart.findOneAndDelete({ userId }); // Optional: delete cart completely
        return res.status(200).json({ message: 'Cart is now empty', cart: [] });
      }

      await cart.save();
      return res.status(200).json({ message: 'Item removed', cart });
    } else {
      return res.status(404).json({ message: 'Item not found in cart' });
    }
  } catch (error) {
    console.error('Error removing item from cart:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};


// module.exports.remove = async (req, res) => {
   
//   const { productId, userId } = req.body.data;
  

//   let cart = await Cart.findOne({ userId });

//   if (!cart) {
//     return res.status(404).json({ message: 'Cart not found' });
//   }

//   const itemIndex = cart.items.findIndex(item =>
//     item.productId.toString() === productId
//   );

//   if (itemIndex > -1) {
//     // Item found
//     cart.items[itemIndex].quantity -= 1;

//     if (cart.items[itemIndex].quantity <= 0) {
//       // Remove item if quantity is 0 or less
//       cart.items.splice(itemIndex, 1);
//     }
//   } else {
//     return res.status(404).json({ message: 'Item not found in cart' });
//   }

//   await cart.save();
//   res.json(cart);
// };
// module.exports.remove=async (req, res) => {
//   const { productId } = req.body;
//   const userId = req.body.userId;

//   let cart = await Cart.findOne({ userId });

//   if (!cart) {
//     return res.status(404).json({ message: 'Cart not found' });
//   }

//   cart.items = cart.items.filter(item => {
//     console.log(item.productId, productId);
//     return item.productId !== productId;
//   });

//   await cart.save();
//   res.json(cart);
// }
