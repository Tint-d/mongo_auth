const express = require("express");
const jwt = require("jsonwebtoken");
const { tryCatch } = require("../util/tryCatch");
const { BadRequest, NotFound, Unauthorized } = require("../util/AppError");
const { getDB } = require("../db/db");
const bcrypt = require("bcrypt");
const { ObjectId } = require("mongodb");

const secert = process.env.JWT_SERECT;

exports.signUp = tryCatch(async (req, res) => {
  const db = getDB();
  const collection = db.collection("user");
  const { name, email, password, password_confirmation } = req.body;
  const users = await collection.find({}).toArray();
  const existUser = users.find((user) => user.email === email);
  if (existUser) {
    throw new BadRequest("Email have been already exist!");
  }
  if (password !== password_confirmation) {
    throw new BadRequest("Password and Password_confirmation do not match!");
  }
  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = {
    name,
    email,
    password: hashedPassword,
    password_confirmation,
  };
  const result = await collection.insertOne(newUser);
  res.status(200).json({ message: "Register Successfully", data: result });
});

exports.login = tryCatch(async (req, res) => {
  const db = getDB();
  const collection = db.collection("user");
  const { email, password } = req.body;
  const users = await collection.find({}).toArray();
  let existUser = users.find((user) => user.email === email);
  // console.log(existUser);
  if (!existUser || !bcrypt.compareSync(password, existUser.password)) {
    throw new BadRequest("Email have been already exist!");
  }

  const token = generateToken(existUser._id);
  existUser.token = token;
  res.status(200).json({ message: "Login Successfully", data: { existUser } });
});

exports.logout = tryCatch(async (req, res) => {
  const user = req.user;
  res.status(200).json({ message: "Logout Successfully" });
});

exports.userDetail = tryCatch(async (req, res) => {
  const db = getDB();
  const userCollection = db.collection("user");

  const userId = req.userId;

  const user = await userCollection.findOne({ _id: new ObjectId(userId) });

  if (!user) {
    throw new NotFound("User not found");
  }

  res.status(200).json({ data: user });
});

const generateToken = (userId) => {
  try {
    const decoded = jwt.sign({ userId }, secert);
    return decoded;
  } catch (error) {
    throw new Unauthorized("Invalid Access Token!");
  }
};
