const mongoose = require("mongoose");
const { Schema } = mongoose;

const CartSchema = new Schema({
  id: {
    type: String
  },
  cart: [
    {
      id: {
        type: String
      },
      image:{
        type: String
      },
      quantity:{
        type:Number
      },
      price:{
        type:Number
      }
    }
  ],
  totalprice:{
    type:Number
  }
});

const Cart = mongoose.model("Cart", CartSchema);
module.exports = Cart;
