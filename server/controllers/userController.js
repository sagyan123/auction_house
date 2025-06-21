const asyncHandler = require("express-async-handler");
const { User } = require("../models/user");

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */

const deleteUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  if (!userId) throw new Error("400: Bad Request.");

  const user = await User.findOne({ _id: userId });
  if (!item) throw new Error("404: User not found.");

  const deletedUser = await User.findOneAndDelete({ _id: user._id });
  if (!deletedUser) throw new Error("Error deleting item.");

  res.status(200).json({
    message: "User deleted successfully.",
  });
});

module.exports = {
  deleteUser,
};
