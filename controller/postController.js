const { ObjectId } = require("mongodb");
const { tryCatch } = require("../util/tryCatch");
const { NotFound, BadRequest } = require("../util/AppError");
const { getDB } = require("../db/db");
const { v4: uuidv4 } = require("uuid");

exports.getPost = tryCatch(async (req, res) => {
  const db = getDB();
  const collection = db.collection("user");
  const userId = req.userId;
  const existUser = await collection.findOne({ _id: new ObjectId(userId) });
  if (existUser) {
    throw new NotFound("User is not found!");
  }

  const result = await collection.find({}).toArray();
  res.status(200).json({ message: true, data: result });
});

exports.searchPost = tryCatch(async (req, res) => {
  const db = getDB();
  const collection = db.collection("user");
  const userId = req.userId;
  const existUser = await collection.findOne({ _id: new ObjectId(userId) });
  const searchTerm = req.query.searchTerm;
  const limit = Number(req.query.limit);
  let result;

  if (searchTerm) {
    const regex = new RegExp(searchTerm, "i");
    result = await collection
      .aggregate([
        { $match: { _id: new ObjectId(userId) } },
        { $unwind: "$post" },
        { $match: { "post.content": { $regex: regex } } },
        {
          $project: {
            _id: 0,
            post: {
              $cond: {
                if: { $regexMatch: { input: "$post.content", regex: regex } },
                then: "$post",
                else: null,
              },
            },
          },
        },
        { $limit: limit },
      ])
      .toArray();
  } else {
    result = existUser ? existUser.post.slice(0, limit) : null;
  }
  res.status(200).json({ message: true, data: result });
});

exports.setPost = tryCatch(async (req, res) => {
  const db = getDB();
  const postCollection = db.collection("post");
  const userCollection = db.collection("user");
  const post = req.body.post;
  const userId = req.userId;
  const newPostId = uuidv4();
  if (!post) {
    throw new BadRequest("Post object must not be empty!");
  }

  const user = await userCollection.findOne({ _id: new ObjectId(userId) });
  if (!user) {
    throw new NotFound("User not found!");
  }
  const newPost = {
    id: newPostId,
    content: post,
  };

  if (!user?.post) {
    await userCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { post: [newPost] } }
    );
  } else {
    await userCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $push: { post: newPost } }
    );
  }

  const result = await postCollection.insertOne({ post, userId });
  res.status(201).json({ message: "Create successfully", data: result });
});

exports.getOnePost = tryCatch(async (req, res) => {
  const db = getDB();
  const collection = db.collection("user");

  const userId = req.userId;
  const users = await collection.findOne({ _id: new ObjectId(userId) });
  if (!users) {
    throw new NotFound(`User not found with id: ${userId}`);
  }
  const id = req.params.id;
  const posts = users.post;
  const result = posts.find((post) => post.id === id);
  res.status(200).json({ message: true, data: result });
});

exports.modifyPost = tryCatch(async (req, res) => {
  const db = getDB();
  const userCollection = db.collection("user");

  const userId = req.userId;
  const postIdToUpdate = req.params.id;
  const updatedPostData = req.body;
  if (Object.keys(updatedPostData).length === 0) {
    throw new BadRequest("Must provide at least one updated field!");
  }

  const user = await userCollection.findOne({ _id: new ObjectId(userId) });

  if (!user) {
    throw new NotFound("User not found!");
  }

  if (!user.post || user.post.length === 0) {
    throw new NotFound("No posts found!");
  }

  const postToUpdate = user.post.find((post) => post.id === postIdToUpdate);

  if (!postToUpdate) {
    throw new NotFound("Post not found!");
  }

  Object.assign(postToUpdate, updatedPostData);

  const result = await userCollection.updateOne(
    { _id: new ObjectId(userId) },
    { $set: { post: user.post } }
  );

  if (result.modifiedCount === 0) {
    return res
      .status(404)
      .json({ message: "No post found or no changes applied" });
  }

  res.status(200).json({ message: "Update successful", data: result });
});

exports.deletePost = tryCatch(async (req, res) => {
  const db = getDB();
  const collection = db.collection("post");
  const id = { _id: new ObjectId(req.params.id) };
  await collection.deleteOne(id);
  res.status(200).json({ message: "Delete Successfully" });
});
