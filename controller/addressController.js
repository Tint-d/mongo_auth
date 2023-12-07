const { ObjectId } = require("mongodb");
const { getDB } = require("../db/db");
const { BadRequest, NotFound } = require("../util/AppError");
const { tryCatch } = require("../util/tryCatch");
const { v4: uuidv4 } = require("uuid");

exports.searchAddress = tryCatch(async (req, res) => {
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
        {
          $match: {
            "address.street": { $regex: regex },
          },
        },
        {
          $project: {
            _id: 0,
            name: 1,
            address: {
              $cond: {
                if: { $regexMatch: { input: "$address.street", regex: regex } },
                then: "$address",
                else: null,
              },
            },
          },
        },
        // { $limit: limit },
      ])
      .toArray();
  } else {
    result = existUser ? existUser.address.slice(0, limit) : null; // Retrieve all addresses or limit based on the provided number
  }
  res.status(200).json({ message: true, data: result });
});

exports.setAddress = tryCatch(async (req, res) => {
  const db = getDB();
  const userCollection = db.collection("user");
  const { street, city, state } = req.body;
  if (!street || !city || !state) {
    throw new BadRequest("Please fill fields!");
  }

  const userId = req.userId;

  const existUser = await userCollection.findOne({ _id: new ObjectId(userId) });
  if (!existUser) {
    throw new BadRequest("User doesn't exist!");
  }

  let result;
  if (existUser.address) {
    throw new BadRequest("Address already exist!");
  } else {
    const address = { street, city, state, id: uuidv4() };
    result = await userCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { address } }
    );
  }

  res.status(200).json({ message: "Create successfully", data: result });
});

exports.modifyAddress = tryCatch(async (req, res) => {
  const db = getDB();
  const collection = db.collection("user");
  const userId = req.userId;
  const { street, city, state } = req.body;

  const existingUser = await collection.findOne({ _id: new ObjectId(userId) });
  const userAddress = existingUser.address;
  if (!existingUser) {
    throw new NotFound("User is not found!");
  }

  const updateObj = {
    $set: {
      "address.street": street !== undefined ? street : userAddress.street,
      "address.city": city !== undefined ? city : userAddress.city,
      "address.state": state !== undefined ? state : userAddress.state,
    },
  };

  const filter = { _id: new ObjectId(userId) };
  const options = { returnOriginal: false };

  const result = await collection.findOneAndUpdate(filter, updateObj, options);
  res
    .status(200)
    .json({ message: "Update Successfully", data: result.address });
});
