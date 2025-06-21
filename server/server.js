require("dotenv").config();
const express = require("express");
const cors = require("cors");
const database = require("./config/database");
const { protect, restrictToRole } = require("./middleware/authMiddleware");
const initializeLotNumberCounter = require("./config/initializeCounter");
const initializeAdmin = require("./config/initializeAdmin");

const port = process.env.PORT || 6000;

database();
initializeLotNumberCounter();
initializeAdmin();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", require("./routes/publicRoutes"));

app.use(
  "/api/buyer",
  protect,
  restrictToRole("buyer"),
  require("./routes/buyerRoutes")
);

app.use(
  "/api/seller",
  protect,
  restrictToRole("seller"),
  require("./routes/sellerRoutes")
);

app.use(
  "/api/admin",
  protect,
  restrictToRole("admin"),
  require("./routes/adminRoutes")
);

app.use(require("./middleware/errorMiddleware"));

app.listen(port, () => {
  try {
    console.log(`Server running on http://localhost:${port}/api`);
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
});
