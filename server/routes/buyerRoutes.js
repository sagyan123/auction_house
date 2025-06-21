const {
  bidItem,
  allBidItems,
  allBoughtItems,
  allAuctioningItems,
} = require("../controllers/itemController");
const router = require("express").Router();

router.get("/all-auctioning-items", allAuctioningItems);
router.get("/all-bid-items", allBidItems);
router.get("/all-bought-items", allBoughtItems);
router.post("/item-bid/:itemId", bidItem);

module.exports = router;
