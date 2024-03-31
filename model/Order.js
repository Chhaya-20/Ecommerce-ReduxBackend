const mongoose = require("mongoose");
const { Schema } = mongoose;

const OrderSchema = new Schema({
  id: {
    type: String
  },
  orders: []
});

const Order = mongoose.model("Order", OrderSchema);
module.exports = Order;
