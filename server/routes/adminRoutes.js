const {
  approveItem,
  allItems,
  editItem,
  deleteItem,
  addItem,
  allBidders,
  allUnapprovedItems,
  allAuctioningItems,
  sellItem,
  allSoldItems,
} = require("../controllers/itemController");
const { deleteUser } = require("../controllers/userController");
const router = require("express").Router();

router.get("/all-items", allItems);
router.get("/all-unapproved-items", allUnapprovedItems);
router.get("/all-auctioning-items", allAuctioningItems);
router.get("/all-sold-items", allSoldItems);
router.post("/item-add", addItem);
router.put("/item-edit/:itemId", editItem);
router.put("/item-approve/:itemId", approveItem);
router.put("/item-sell/:itemId/:bidderId", sellItem);
router.delete("/item-delete/:itemId", deleteItem);
router.delete("/user-delete/:userId", deleteUser);

module.exports = router;
