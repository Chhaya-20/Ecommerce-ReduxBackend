const Cart = require("../model/Cart.js");

const Order = require("../model/Order.js");

const Product = require("../model/Product.js");

exports.AddtoCart = async (req, res) => {
 
  let { id, price } = req.body; //product id
  price = parseInt(price);
  const userId = req.user.id; // user id
  try {
    const result = await Cart.findOne({ id: userId });
    // console.log("Query result:", result);

    if (result === null) {
      
      item = new Cart({
        id: userId,
        cart: [{ id: id, quantity: 1, price: price }],
        totalprice: price,
      });
      await item.save();
      return res.status(200).json("Successfully Added ");
    } else {
      let f = true;
      for (let i = 0; i < result.cart.length; i++) {
        if (result.cart[i].id == id) {
          result.cart[i].quantity = result.cart[i].quantity + 1;
          result.cart[i].price = result.cart[i].price + price;
          result.totalprice = result.totalprice + price;
          await result.cart[i].save();
          f = false;
          break;
        }
      }
      if (f) {
        result.cart.push({ id, quantity: 1, price: price });
        result.totalprice = result.totalprice + price;

        await result.save();
      }

      await result.save();
      return res.status(200).json("Successfully Added ");
    }
    // Rest of your code
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server error");
  }
};

exports.OrderAll = async (req, res) => {
  const userId = req.user.id;

  try {
    // Find the user's cart
    const result = await Cart.findOne({ id: userId });
    if (!result) {
      return res.status(404).send("Cart not found");
    }

    // Check if the cart is empty
    if (result.cart.length === 0) {
      return res.status(400).send("Cart is empty");
    }

    // Find or create the user's order
    let order = await Order.findOne({ id: userId });
    if (!order) {
      // Create a new order if none exists
      order = new Order({ id: userId, orders: result.cart });
    } else {
      // Add cart items to the existing order
      order.orders = order.orders.concat(result.cart);
    }

    // Save the order
    await order.save();
    result.cart = [];
    await result.save();

    return res.status(200).send("Successfully Ordered");
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).send("Internal Server error");
  }
};

exports.getCart = async (req, res) => {
  const userId = req.user.id;
  let ans = {
    items: [], // Array to store items
    totalprice: 0, // Initial total price
  };
  try {
    const result = await Cart.findOne({ id: userId });
    if (!result) {
      return res.status(400).send("Cart is Empty");
    } else {
      // console.log("cart" , result.cart);
      for (let i = 0; i < result.cart.length; i++) {
        const p = await Product.find({ _id: result.cart[i].id });

        ans.items.push({
          quantity: result.cart[i].quantity,
          image: p[0].image,
          price: result.cart[i].price,
          title: p[0].title,
          _id: p[0]._id,
        });
      }
      ans.totalprice = result.totalprice;

      return res.status(200).json(ans);
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).send("Internal Server error");
  }
};

exports.IncAndDec = async (req, res) => {
  const userId = req.user.id;

  const id = req.body.id; // product id
  const p = await Product.findOne({ _id: id });
 
  const result = await Cart.findOne({ id: userId });
  // console.log(result);
 
  const cart = result.cart;
  

  for (let i = 0; i < cart.length; i++) {
    if (cart[i].id === req.body.id) {
      if (req.body.inc === "inc") {
        cart[i].quantity++;
        cart[i].price = cart[i].price + parseInt(p.price);
        result.totalprice = result.totalprice + parseInt(p.price);
        break;
      } else {
        if (cart[i].quantity == 1) {
          cart.splice(i, 1);
          result.totalprice = result.totalprice - parseInt(p.price);

          break;
        } else {
          cart[i].quantity--;
          cart[i].price = cart[i].price - parseInt(p.price);
          result.totalprice = result.totalprice - parseInt(p.price);
          break;
        }
      }
    }
  }
  await result.save(); // Save the updated cart document
  return res.status(200).send("Successfully Added ");
};

exports.buy = async (req, res) => {
  const userId = req.user.id;

  const id = req.body.id; // product id

  const result = await Cart.findOne({ id: userId });
  const p = await Product.findOne({ _id: id });
  const cart = result.cart;

  for (let i = 0; i < cart.length; i++) {
    if (cart[i].id === req.body.id) {
      result.totalprice = result.totalprice - cart[i].price;
      cart.splice(i, 1);

      break;
    }
  }

  await result.save(); // Save the updated cart document
  const order = await Order.findOne({ id: userId });

  if (order) {
    order.orders.push(p);
    await order.save();
  } else {
   
    o = new Order({
      id: userId,
      orders: [p],
    });
    await o.save();
  }

  return res.status(200).send("Successfully Ordered ");
};

exports.getOrder = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await Order.findOne({ id: userId });
    if (!result) {
      return res.status(200).send("No order yet");
    } else {
      // console.log("cart" , result.cart);

      return res.status(200).json(result.orders);
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).send("Internal Server error");
  }
};


//   console.log("here");
//   const userId = req.user.id;
//   try {
//     const result = await Cart.findOne({ id: userId });
//     const order = await Order.findOne({ id: userId });

//     if (!order) {
//       o = new Order({ id: userId, orders: [] });
//       for (let i = 0; i < result.cart.length; i++) {
//         const p = Product.findOne({ _id: result.cart[i].id });
//         o.orders.push(p);
//       }
//       await o.save();
//     } else {
//       //console.log("jefhiegkegelglenglengenl")
//       for (let i = 0; i < result.cart.length; i++) {

//         const p =await  Product.findOne({ _id: result.cart[i].id });

//         order.orders.push(p);
//       }
//       await order.save();
//       console.log(order);
//     }
//   } catch (error) {}
// };

