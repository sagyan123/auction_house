const path = require("path");
const { login, register } = require("../controllers/authController");
const { getItem, allBidders } = require("../controllers/itemController");
const router = require("express").Router();

const server = (req, res) => {
  res.sendFile(path.join(__dirname + "/../server.html"));
};

router.get("/", server);
router.post("/login", login);
router.post("/register", register);
router.get("/item/:itemId", getItem);
router.get("/all-bidders/:itemId", allBidders);

module.exports = router;
