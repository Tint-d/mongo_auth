const { Router } = require("express");
const {
  getPost,
  getOnePost,
  setPost,
  modifyPost,
  deletePost,
  searchPost,
} = require("../controller/postController");
const { authenticateToken } = require("../middleware/authenticateToken");

const postRouter = Router();

postRouter.route("/").get(authenticateToken, getPost);
postRouter.route("/").get(authenticateToken, searchPost);
postRouter.route("/:id").get(authenticateToken, getOnePost);
postRouter.route("/create").post(authenticateToken, setPost);
postRouter.route("/update/:id").put(authenticateToken, modifyPost);
postRouter.route("/delete/:id").delete(deletePost);

module.exports = postRouter;
