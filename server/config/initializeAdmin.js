const { User, Admin } = require("../models/user");

const initializeAdmin = async () => {
  try {
    const currentAdmin = await User.findOne({
      role: "admin",
    });

    if (!currentAdmin) {
      const newAdmin = await User.create({
        name: process.env.ADMIN_NAME,
        password: process.env.ADMIN_PASSWORD,
        email: process.env.ADMIN_EMAIL,
        role: "admin",
      });
      const extendedAdmin = await Admin.create(newAdmin);
      if (extendedAdmin) console.log("New admin initialized.");
    } else {
      console.log("Admin already exists.");
    }
  } catch (error) {
    console.error("Error initializing new admin:", error);
  }
};

module.exports = initializeAdmin;
