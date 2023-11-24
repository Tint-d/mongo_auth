const { Router } = require("express");
const { signUp, login, logout } = require("../controller/userController");
const { authenticateToken } = require("../middleware/authenticateToken");

const userRouter = Router();

userRouter.route("/register").post(signUp);
userRouter.route("/login").post(login);
userRouter.route("/logout").post(authenticateToken, logout);

module.exports = userRouter;
