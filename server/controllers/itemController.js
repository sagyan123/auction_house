const asyncHandler = require("express-async-handler");
const { User } = require("../models/user");
const { Item } = require("../models/item");

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */

const itemAddRequest = asyncHandler(async (req, res) => {
  const user = req.user;
  const {
    artistName,
    yearProduced,
    subjectClassification,
    category,
    description,
    estimatedPrice,
  } = req.body;
  if (
    !(
      artistName &&
      yearProduced &&
      subjectClassification &&
      category &&
      description &&
      estimatedPrice
    )
  )
    throw new Error("400: Bad request.");

  const seller = await User.findOne({ _id: user._id });
  if (!seller) throw new Error("404: Seller user not found.");

  const newItem = new Item({
    artistName,
    yearProduced,
    subjectClassification,
    category,
    estimatedPrice,
    description,
    seller,
  });

  if (category == "drawing") {
    const { drawingMedium, framed, height, length } = req.body;
    if (!(drawingMedium && height && length))
      throw new Error("400: Bad request.");
    newItem.drawingDetails = {
      drawingMedium,
      framed,
      dimensions: {
        height,
        length,
      },
    };
  }

  if (category == "painting") {
    const { paintingMedium, framed, height, length } = req.body;
    if (!(paintingMedium && height && length))
      throw new Error("400: Bad request.");
    newItem.paintingDetails = {
      paintingMedium,
      framed,
      dimensions: {
        height,
        length,
      },
    };
  }

  if (category == "photograph") {
    const { imageType, height, length } = req.body;
    if (!(imageType && height && length)) throw new Error("400: Bad request.");
    newItem.photographicImageDetails = {
      imageType,
      dimensions: {
        height,
        length,
      },
    };
  }

  if (category == "sculpture") {
    const { materialUsed, height, length, width, weight } = req.body;
    if (!(materialUsed && height && length && width && weight))
      throw new Error("400: Bad request.");
    newItem.sculptureDetails = {
      materialUsed,
      dimensions: {
        height,
        length,
        width,
      },
      weight,
    };
  }

  if (category == "carving") {
    const { materialUsed, height, length, width, weight } = req.body;
    if (!(materialUsed && height && length && width && weight))
      throw new Error("400: Bad request.");
    newItem.carvingDetails = {
      materialUsed,
      dimensions: {
        height,
        length,
        width,
      },
      weight,
    };
  }

  const requestedItem = await newItem.save();
  if (!requestedItem) throw new Error("Error requesting to add new item.");

  seller.requestedItems.push(requestedItem._id);
  const sellerWithRequestedItem = await seller.save();
  if (!sellerWithRequestedItem)
    throw new Error("Error linking request with seller.");

  res.status(200).json({
    message: "Item add request placed successfully.",
    requestedItem: {
      ...requestedItem._doc,
      seller: {
        name: sellerWithRequestedItem.name,
        _id: sellerWithRequestedItem.id,
      },
    },
  });
});

const allItems = asyncHandler(async (req, res) => {
  const items = await Item.find();
  if (!items) throw new Error("Error getting all items.");

  res.status(200).json(items);
});

const allUnapprovedItems = asyncHandler(async (req, res) => {
  const unapprovedItems = await Item.find({ approved: false });
  if (!unapprovedItems) throw new Error("Error getting unapproved items.");

  res.status(200).json(unapprovedItems);
});

const allApprovedItems = asyncHandler(async (req, res) => {
  const approvedItems = await Item.find({ approved: true });
  if (!approvedItems) throw new Error("Error getting approved items.");

  res.status(200).json(approvedItems);
});

const allBidItems = asyncHandler(async (req, res) => {
  const user = req.user;

  const bidder = await User.findOne({ _id: user._id }).populate("bids.item");
  if (!bidder) throw new Error("404: Bidder user not found.");

  res.status(200).json(bidder.bids);
});

const allBoughtItems = asyncHandler(async (req, res) => {
  const user = req.user;

  const buyer = await User.findOne({ _id: user._id }).populate("buys.item");
  if (!buyer) throw new Error("404: Buyer user not found.");

  res.status(200).json(buyer.buys);
});

const allRequestedItems = asyncHandler(async (req, res) => {
  const user = req.user;

  const requester = await User.findOne({ _id: user._id }).populate(
    "requestedItems"
  );
  if (!requester) throw new Error("404: Requester user not found.");

  res.status(200).json(requester.requestedItems);
});

const allAddedItems = asyncHandler(async (req, res) => {
  const user = req.user;

  const requester = await User.findOne({ _id: user._id }).populate(
    "addedItems"
  );
  if (!requester) throw new Error("404: Requester user not found.");

  res.status(200).json(requester.addedItems);
});

const allSoldItems = asyncHandler(async (req, res) => {
  const items = await Item.find({ buyer: { $ne: null } });
  if (!items) throw new Error("Error getting all sold items.");

  res.status(200).json(items);
});

const soldItems = asyncHandler(async (req, res) => {
  const user = req.user;

  const seller = await User.findOne({ _id: user._id }).populate(
    "soldItems.item"
  );
  if (!seller) throw new Error("404: Seller user not found.");

  res.status(200).json(seller.soldItems);
});

const allAuctioningItems = asyncHandler(async (req, res) => {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const auctioningItems = await Item.find({
    approved: true,
    auctionDate: today,
    buyer: null,
  });
  if (!auctioningItems) throw new Error("Error getting auctioning items.");

  res.status(200).json(auctioningItems);
});

const allBidders = asyncHandler(async (req, res) => {
  const { itemId } = req.params;

  const item = await Item.findOne({ _id: itemId }).populate("bids.user");
  if (!item) throw new Error("404: Item not found.");

  res.status(200).json(item.bids);
});

const bidItem = asyncHandler(async (req, res) => {
  const user = req.user;
  const { itemId } = req.params;
  const { price } = req.body;
  if (!(itemId && price)) throw new Error("400: Bad Request.");

  const item = await Item.findOne({ _id: itemId });
  if (!item) throw new Error("404: Item not found.");

  const bidder = await User.findOne({ _id: user._id });
  if (!bidder) throw new Error("404: Bidder user not found.");

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  if (item.auctionDate.toISOString() !== today.toISOString())
    throw new Error("403: Today is not the auction date for this item.");
  if (!item.approved) throw new Error("403: Can't bid unapproved item.");
  if (item.buyer) throw new Error("403: Can't bid already sold item.");

  const alreadyBid = bidder.bids.some(
    (bid) => bid.item.toString() === item._id.toString()
  );

  if (alreadyBid) throw new Error("403: The item is already bid.");
  bidder.bids.push({ item: item._id, price });
  item.bids.push({ user: bidder._id, price });

  const bidderWithItem = await bidder.save();
  if (!bidderWithItem) throw new Error("Error adding item to bidder.");

  const itemWithBid = await item.save();
  if (!itemWithBid) throw new Error("Error adding bid to item.");

  res.status(200).json({
    message: "Bid placed successfully.",
    itemWithBid,
  });
});

const sellItem = asyncHandler(async (req, res) => {
  const { bidderId, itemId } = req.params;

  if (!(bidderId && itemId)) throw new Error("400: Bad Request.");

  const item = await Item.findOne({ _id: itemId }).populate("bids.user");
  if (!item) throw new Error("404: Item not found.");

  if (item.buyer) throw new Error("403: Item already sold.");

  const seller = await User.findOne({ _id: item.seller });
  if (!seller) throw new Error("404: Item seller not found.");

  const bid = item.bids.find(
    (oldBid) => oldBid.user._id.toString() === bidderId
  );
  if (!bid) throw new Error("404: Bid not found.");

  item.buyer = bid.user._id;
  item.finalPrice = bid.price;

  if (seller.role === "seller") {
    seller.addedItems = seller.addedItems.filter(
      (addedItem) => addedItem.toString() !== item._id.toString()
    );
    seller.soldItems.push({ item: item._id, price: bid.price });
  }

  const buyer = await User.findOne({ _id: bid.user._id }).populate("bids.item");
  buyer.bids = buyer.bids.filter(
    (bid) => bid.item._id.toString() !== item._id.toString()
  );
  buyer.buys.push({ item: item._id, price: bid.price });

  const soldItem = await item.save();
  if (!soldItem) throw new Error("Error modifying sold item.");

  const itemSeller = await seller.save();
  if (!itemSeller) throw new Error("Error modifying item seller.");

  const itemBuyer = await buyer.save();
  if (!itemBuyer) throw new Error("Error modifying item buyer.");

  res.status(200).json({
    message: "Item successfully sold.",
    item,
  });
});

const getItem = asyncHandler(async (req, res) => {
  const { itemId } = req.params;
  if (!itemId) throw new Error("400: Bad Request.");

  const item = await Item.findOne({ _id: itemId })
    .populate("seller")
    .populate("buyer");
  if (!item) throw new Error("404: Item not found.");

  res.status(200).json({
    ...item._doc,
    seller: {
      _id: item.seller.id,
      name: item.seller.name,
    },
    buyer: {
      _id: item.buyer?.id,
      name: item.buyer?.name,
    },
  });
});

const approveItem = asyncHandler(async (req, res) => {
  const user = req.user;
  const { itemId } = req.params;
  if (!itemId) throw new Error("400: Bad Request.");

  const item = await Item.findOne({ _id: itemId });
  if (!item) throw new Error("404: Item not found.");

  if (item.approved) throw new Error("403: Item already approved.");

  if (!item.auctionDate)
    throw new Error("400: Can't approve without auction date.");

  const approver = await User.findOne({ _id: user._id });
  if (!approver) throw new Error("404: Approver admin not found.");

  const seller = await User.findOne({ _id: item.seller });
  if (!seller) throw new Error("404: Item seller not found.");

  approver.approvedItems.push(item._id);
  item.approved = true;
  item.approvedBy = approver._id;
  seller.requestedItems = seller.requestedItems.filter(
    (requestedItem) => requestedItem.toString() !== item._id.toString()
  );
  seller.addedItems.push(item._id);

  const approverWithItem = await approver.save();
  if (!approverWithItem) throw new Error("Error adding item to approver.");

  const approvedItem = await item.save();
  if (!approvedItem) throw new Error("Error approving item.");

  const sellerWithAddedItem = await seller.save();
  if (!sellerWithAddedItem) throw new Error("Error updating seller items.");

  res.status(200).json({
    message: "Item approved successfully.",
    approvedItem,
  });
});

const addItem = asyncHandler(async (req, res) => {
  const user = req.user;
  const {
    artistName,
    yearProduced,
    subjectClassification,
    category,
    description,
    estimatedPrice,
    auctionDate,
  } = req.body;
  if (
    !(
      artistName &&
      yearProduced &&
      subjectClassification &&
      category &&
      description &&
      estimatedPrice &&
      auctionDate
    )
  )
    throw new Error("400: Bad request.");

  const admin = await User.findOne({ _id: user._id });
  if (!admin) throw new Error("404: Seller user not found.");

  const newItem = new Item({
    artistName,
    yearProduced,
    subjectClassification,
    category,
    estimatedPrice,
    description,
    auctionDate,
    seller: admin,
    approved: true,
  });

  if (category == "drawing") {
    const { drawingMedium, framed, height, length } = req.body;
    if (!(drawingMedium && height && length))
      throw new Error("400: Bad request.");
    newItem.drawingDetails = {
      drawingMedium,
      framed,
      dimensions: {
        height,
        length,
      },
    };
  }

  if (category == "painting") {
    const { paintingMedium, framed, height, length } = req.body;
    if (!(paintingMedium && height && length))
      throw new Error("400: Bad request.");
    newItem.paintingDetails = {
      paintingMedium,
      framed,
      dimensions: {
        height,
        length,
      },
    };
  }

  if (category == "photograph") {
    const { imageType, height, length } = req.body;
    if (!(imageType && height && length)) throw new Error("400: Bad request.");
    newItem.photographicImageDetails = {
      imageType,
      dimensions: {
        height,
        length,
      },
    };
  }

  if (category == "sculpture") {
    const { materialUsed, height, length, width, weight } = req.body;
    if (!(materialUsed && height && length && width && weight))
      throw new Error("400: Bad request.");
    newItem.sculptureDetails = {
      materialUsed,
      dimensions: {
        height,
        length,
        width,
      },
      weight,
    };
  }

  if (category == "carving") {
    const { materialUsed, height, length, width, weight } = req.body;
    if (!(materialUsed && height && length && width && weight))
      throw new Error("400: Bad request.");
    newItem.carvingDetails = {
      materialUsed,
      dimensions: {
        height,
        length,
        width,
      },
      weight,
    };
  }

  const addedItem = await newItem.save();
  if (!addedItem) throw new Error("Error requesting to add new item.");

  admin.approvedItems.push(addedItem._id);
  const adminWithApprovedItem = await admin.save();
  if (!adminWithApprovedItem) throw new Error("Error linking item with admin.");

  res.status(200).json({
    message: "Item addded successfully.",
    added: {
      ...addedItem._doc,
      seller: {
        name: addedItem.seller.name,
        _id: addedItem.seller.id,
      },
    },
  });
});

const editItem = asyncHandler(async (req, res) => {
  const { itemId } = req.params;
  if (!itemId) throw new Error("400: Bad Request.");

  const item = await Item.findOne({ _id: itemId });
  if (!item) throw new Error("404: Item not found.");

  const {
    artistName,
    yearProduced,
    subjectClassification,
    category,
    description,
    auctionDate,
    estimatedPrice,
  } = req.body;

  if (
    !(
      artistName &&
      yearProduced &&
      subjectClassification &&
      category &&
      description
    )
  )
    throw new Error("400: Bad request.");

  item.artistName = artistName;
  item.yearProduced = yearProduced;
  item.subjectClassification = subjectClassification;
  item.category = category;
  item.description = description;
  item.auctionDate = auctionDate;
  item.estimatedPrice = estimatedPrice;
  if (category === "drawing") {
    const { drawingMedium, framed, height, length } = req.body;
    if (!(drawingMedium && height && length))
      throw new Error("400: Bad request.");
    item.drawingDetails = {
      drawingMedium,
      framed,
      dimensions: {
        height,
        length,
      },
    };
  }

  if (category === "painting") {
    const { paintingMedium, framed, height, length } = req.body;
    if (!(paintingMedium && height && length))
      throw new Error("400: Bad request.");
    item.paintingDetails = {
      paintingMedium,
      framed,
      dimensions: { height, length },
    };
  }

  if (category === "photograph") {
    const { imageType, height, length } = req.body;

    if (!(imageType && height && length)) throw new Error("400: Bad request.");

    item.photographicImageDetails = {
      imageType,
      dimensions: { height, length },
    };
  }

  if (category === "sculpture") {
    const { materialUsed, height, length, width, weight } = req.body;

    if (!(materialUsed && height && length && width && weight))
      throw new Error("400: Bad request.");

    item.sculptureDetails = {
      materialUsed,
      dimensions: { height, width, length },
      weight,
    };
  }

  if (category === "carving") {
    const { materialUsed, height, length, width, weight } = req.body;

    if (!(materialUsed && height && length && width && weight))
      throw new Error("400: Bad request.");

    item.carvingDetails = {
      materialUsed,
      weight,
      dimensions: {
        height,
        length,
        width,
      },
    };
  }

  const editedItem = await item.save();
  if (!editedItem) throw new Error("Error requesting to add new item.");

  const editedItemWithSeller = await Item.findOne({
    _id: editedItem._id,
  }).populate("seller");
  if (!editedItemWithSeller.seller) throw new Error("Error getting seller.");

  res.status(200).json({
    message: "Item edited successfully.",
    editedItem: {
      ...editedItem._doc,
      seller: {
        name: editedItemWithSeller.seller.name,
        _id: editedItemWithSeller.seller._id,
      },
    },
  });
});

const deleteItem = asyncHandler(async (req, res) => {
  const { itemId } = req.params;
  if (!itemId) throw new Error("400: Bad Request.");

  const item = await Item.findOne({ _id: itemId });
  if (!item) throw new Error("404: Item not found.");

  const deletedItem = await Item.findOneAndDelete({ _id: item._id });
  if (!deletedItem) throw new Error("Error deleting item.");

  res.status(200).json({
    message: "Item deleted successfully.",
  });
});

module.exports = {
  itemAddRequest,
  allItems,
  allApprovedItems,
  allUnapprovedItems,
  allBidItems,
  allBoughtItems,
  allRequestedItems,
  allAddedItems,
  allSoldItems,
  allAuctioningItems,
  allBidders,
  addItem,
  soldItems,
  approveItem,
  getItem,
  bidItem,
  sellItem,
  editItem,
  deleteItem,
};
