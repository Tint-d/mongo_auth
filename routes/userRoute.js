const { Router } = require("express");
const {
  signUp,
  login,
  logout,
  userDetail,
} = require("../controller/userController");
const { authenticateToken } = require("../middleware/authenticateToken");

const userRouter = Router();

// userRouter.route("/detail").get(authenticateToken, userDetail);
userRouter.route("/register").post(signUp);
userRouter.route("/login").post(login);
userRouter.route("/logout").post(authenticateToken, logout);
userRouter.route("/detail").get(authenticateToken, userDetail);

module.exports = userRouter;
