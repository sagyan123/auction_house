const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["buyer", "seller", "admin"],
      required: true,
      default: "buyer",
    },
  },
  {
    timestamps: true,
  }
);

const adminSchema = new mongoose.Schema({
  approvedItems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
    },
  ],
});

const buyerSchema = new mongoose.Schema({
  buys: [
    {
      item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
      },
      price: {
        type: Number,
        required: true,
      },
      _id: false,
    },
  ],
  bids: [
    {
      item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
      },
      price: {
        type: Number,
        required: true,
      },
      _id: false,
    },
  ],
});

const sellerSchema = new mongoose.Schema({
  requestedItems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
    },
  ],
  addedItems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
    },
  ],
  soldItems: [
    {
      item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
      },
      price: {
        type: Number,
        required: true,
      },
      _id: false,
    },
  ],
});

const User = mongoose.model("User", userSchema);
const Admin = User.discriminator("Admin", adminSchema);
const Buyer = User.discriminator("Buyer", buyerSchema);
const Seller = User.discriminator("Seller", sellerSchema);

module.exports = {
  User,
  Buyer,
  Seller,
  Admin,
};
