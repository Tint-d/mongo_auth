const express = require("express");
const { ObjectId } = require("mongodb");
const { tryCatch } = require("../util/tryCatch");
const { NotFound, BadRequest } = require("../util/AppError");
const { getDB } = require("../db/db");

exports.getPost = tryCatch(async (req, res) => {
  const db = getDB();
  const collection = db.collection("post");
  const name = req.query.name;
  const limit = Number(req.query.limit);
  let result;
  if (name) {
    result = await collection
      .aggregate([{ $match: { "author.name": `${name}` } }])
      .toArray();
  } else {
    result = await collection.find({}).limit(limit).toArray();
  }
  res.status(200).json({ message: true, data: result });
});

exports.setPost = tryCatch(async (req, res) => {
  const db = getDB();
  const collection = db.collection("post");
  let post = req.body.post;

  if (!post) {
    throw new BadRequest("Post object must not be empty!");
  }

  const author = req.body.author;

  if (!author || !author.name || !author.age) {
    throw new BadRequest(
      "Name and age must be provided in author information!"
    );
  }

  const { name, age } = author;

  const newPost = {
    post: post,
    author: { name, age },
    date: new Date(),
  };

  let result = await collection.insertOne(newPost);
  res.status(201).json({ message: "Create successfully", data: result });
});

exports.getOnePost = tryCatch(async (req, res) => {
  const db = getDB();
  const collection = db.collection("post");
  if (!ObjectId.isValid(req.params.id)) {
    console.log("error in not found");
    throw new NotFound(`Invalid or empty id provided: ${req.params.id}`);
  }
  const id = new ObjectId(req.params.id);

  const result = await collection.findOne(id);
  res.status(200).json({ message: true, data: result });
});

exports.modifyPost = tryCatch(async (req, res) => {
  const db = getDB();
  const collection = db.collection("post");

  if (!ObjectId.isValid(req.params.id)) {
    console.log("error in not found");
    throw new NotFound(`Invalid or empty id provided: ${req.params.id}`);
  }
  const id = new ObjectId(req.params.id);

  const updatedPost = req.body;

  if (Object.keys(updatedPost).length === 0) {
    console.log("inside the bad ");
    throw new BadRequest("Must provide at least one updated field!");
  }

  const result = await collection.updateOne({ _id: id }, { $set: updatedPost });

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
