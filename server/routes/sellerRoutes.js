const {
  itemAddRequest,
  allRequestedItems,
  allAddedItems,
  soldItems,
} = require("../controllers/itemController");
const router = require("express").Router();

router.get("/all-requested-items", allRequestedItems);
router.get("/all-added-items", allAddedItems);
router.get("/sold-items", soldItems);
router.post("/item-add-request", itemAddRequest);

module.exports = router;
