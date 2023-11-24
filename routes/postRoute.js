const { Router } = require("express");
const {
  getPost,
  getOnePost,
  setPost,
  modifyPost,
  deletePost,
} = require("../controller/postController");
const { authenticateToken } = require("../middleware/authenticateToken");

const postRouter = Router();

postRouter.route("/").get(authenticateToken, getPost);
postRouter.route("/:id").get(getOnePost);
postRouter.route("/create").post(setPost);
postRouter.route("/update/:id").put(modifyPost);
postRouter.route("/delete/:id").delete(deletePost);

module.exports = postRouter;
