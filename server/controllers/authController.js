const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const asyncHandler = require("express-async-handler");
// const { Admin } = require("../models/user");
const { User, Buyer, Seller } = require("../models/user");

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */

const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  const user = await User.findOne({ email });

  if (user) throw new Error("409: User already registered.");
  // if (!(name && email && password && role))
  if (!(name && email && password && role) || role == "admin")
    throw new Error("400: Bad request.");

  const salt = await bcryptjs.genSalt(10);
  if (!salt) throw new Error("Error generating bcryptjs salt.");

  const hashedPassword = await bcryptjs.hash(password, salt);
  if (!hashedPassword)
    throw new Error("Error generating bcryptjs hashed password.");

  const newUser = await User.create({
    name,
    email,
    role,
    password: hashedPassword,
  });
  if (!newUser) throw new Error("Error creating new user.");

  let extendedUser = null;

  // if (newUser.role === "admin") extendedUser = await Admin.create(newUser);
  if (newUser.role === "buyer") extendedUser = await Buyer.create(newUser);
  if (newUser.role === "seller") extendedUser = await Seller.create(newUser);

  if (!extendedUser) throw new Error(`Error creating new ${newUser.role}.`);

  res.status(201).json({
    message: "User successfully created. Proceed to login.",
    name: newUser.name,
    email: newUser.email,
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!(email && password)) throw new Error("400: Bad request.");

  const user = await User.findOne({ email });
  if (!user) throw new Error("404: User not found.");

  if (!(await bcryptjs.compare(password, user.password)))
    throw new Error("401: Invalid Credentials.");

  const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.status(200).json({
    message: "User successfully logged in.",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token: jwtToken,
  });
});

module.exports = {
  register,
  login,
};
