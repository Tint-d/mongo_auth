const { Router } = require("express");
const { authenticateToken } = require("../middleware/authenticateToken");
const {
  setAddress,
  modifyAddress,
  searchAddress,
} = require("../controller/addressController");

const addressRouter = Router();

addressRouter.route("/").get(authenticateToken, searchAddress);
addressRouter.route("/create").post(authenticateToken, setAddress);
addressRouter.route("/update").put(authenticateToken, modifyAddress);

module.exports = addressRouter;
