const mongoose = require("mongoose");

const counterSchema = new mongoose.Schema({
  counterName: { type: String, required: true, unique: true },
  sequenceValue: { type: Number, default: -1 },
});

const itemSchema = new mongoose.Schema({
  lotNumber: {
    type: String,
    default: -1,
  },
  artistName: {
    type: String,
    required: true,
  },
  yearProduced: {
    type: Number,
    required: true,
  },
  subjectClassification: {
    type: String,
    enum: [
      "landscape",
      "seascape",
      "portrait",
      "figure",
      "still-life",
      "nude",
      "animal",
      "abstract",
      "other",
    ],
    required: true,
  },
  category: {
    type: String,
    enum: [
      "drawing",
      "painting",
      "photograph",
      "sculpture",
      "carving",
      "other",
    ],
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  auctionDate: {
    type: Date,
  },
  estimatedPrice: {
    type: Number,
    required: true,
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  approved: {
    type: Boolean,
    required: true,
    default: false,
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  finalPrice: {
    type: Number,
  },
  bids: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      _id: false,
    },
  ],
});

const drawingSchema = new mongoose.Schema({
  drawingMedium: {
    type: String,
    enum: ["pencil", "ink", "charcoal", "other"],
    required: true,
  },
  framed: {
    type: Boolean,
    default: false,
  },
  dimensions: {
    height: {
      type: Number,
      required: true,
    },
    length: {
      type: Number,
      required: true,
    },
  },
});

const paintingSchema = new mongoose.Schema({
  paintingMedium: {
    type: String,
    enum: ["oil", "acrylic", "watercolour", "other"],
    required: true,
  },
  framed: {
    type: Boolean,
    default: false,
  },
  dimensions: {
    height: {
      type: Number,
      required: true,
    },
    length: {
      type: Number,
      required: true,
    },
  },
});

const photographicImageSchema = new mongoose.Schema({
  imageType: {
    type: String,
    enum: ["black-and-white", "colour"],
    required: true,
  },
  dimensions: {
    height: {
      type: Number,
      required: true,
    },
    length: {
      type: Number,
      required: true,
    },
  },
});

const sculptureSchema = new mongoose.Schema({
  materialUsed: {
    type: String,
    enum: ["bronze", "marble", "pewter", "other"],
    required: true,
  },
  dimensions: {
    height: {
      type: Number,
      required: true,
    },
    length: {
      type: Number,
      required: true,
    },
    width: {
      type: Number,
    },
  },
  weight: {
    type: Number,
    required: true,
  },
});

const carvingSchema = new mongoose.Schema({
  materialUsed: {
    type: String,
    enum: ["oak", "beach", "pine", "willow", "other"],
    required: true,
  },
  dimensions: {
    height: {
      type: Number,
      required: true,
    },
    length: {
      type: Number,
      required: true,
    },
    width: {
      type: Number,
      required: true,
    },
  },
  weight: {
    type: Number,
    required: true,
  },
});

itemSchema.add({
  drawingDetails: drawingSchema,
  paintingDetails: paintingSchema,
  photographicImageDetails: photographicImageSchema,
  sculptureDetails: sculptureSchema,
  carvingDetails: carvingSchema,
});

itemSchema.pre("save", async function (next) {
  try {
    if (this.isModified("approved") && this.approved === true) {
      const counter = await Counter.findOneAndUpdate(
        { counterName: "lotNumberCounter" },
        { $inc: { sequenceValue: 1 } },
        { new: true, upsert: true }
      );

      this.lotNumber = counter.sequenceValue.toString().padStart(8, "0");
    }

    next();
  } catch (error) {
    next(error);
  }
});

const Counter = mongoose.model("Counter", counterSchema);
const Item = mongoose.model("Item", itemSchema);

module.exports = {
  Counter,
  Item,
};
