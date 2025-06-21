const { Counter } = require("../models/item");

const initializeLotNumberCounter = async () => {
  try {
    const currentCounter = await Counter.findOne({
      counterName: "lotNumberCounter",
    });

    if (!currentCounter || currentCounter.sequenceValue === -1) {
      await Counter.findOneAndUpdate(
        { counterName: "lotNumberCounter" },
        { $setOnInsert: { sequenceValue: 0 } },
        { upsert: true }
      );
      console.log("Lot number counter initialized.");
    } else {
      console.log("Lot number counter already exists.");
    }
  } catch (error) {
    console.error("Error initializing lot number counter:", error);
  }
};

module.exports = initializeLotNumberCounter;
