const express = require("express");
const { authToken } = require("../middlewares/auth");
const { ToyModel, validToy } = require("../models/toyModel");
const router = express.Router();

/* GET home page. */
router.get("/", async (req, res) => {
  try {
    let data = await ToyModel.find({}).limit(10);
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});
router.get("/cat/:catname", async (req, res) => {
  let catPar = req.params.catname;
  try {
    let data = await ToyModel.find({ category: catPar }).limit(10);
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

router.get("/s", async (req, res) => {
  let searchQ = req.query.q;
  try {
    let searchRegQ = new RegExp(searchQ, "i");
    let data = await ToyModel.find({
      $or: [{ name: searchRegQ }, { info: searchRegQ }],
    }).limit(10);
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(400).json({ err: "there is problem, try again later" });
  }
});
router.get("/prices", async (req, res) => {
  let minPrice = Number(req.query.min);
  let maxPrice = Number(req.query.max);
  try {
    let data = await ToyModel.find({})
      .where("price")
      .gt(minPrice)
      .lt(maxPrice)
      .limit(10);
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(400).json({ err: "there is problem, try again later" });
  }
});

//add
router.post("/", authToken, async (req, res) => {
  let validBody = validToy(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let toy = new ToyModel(req.body);
    toy.user_id = req.userData._id;
    await toy.save();
    res.status(201).json(toy);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

//edit
router.put("/:editId", authToken, async (req, res) => {
  let editId = req.params.editId;
  let validBody = validToy(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let toy = await ToyModel.updateOne(
      { _id: editId, user_id: req.userData._id }, //comes from authToken midllewares
      req.body
    );
    res.json(toy);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

//delete
router.delete("/:delId", authToken, async (req, res) => {
  let delId = req.params.delId;
  try {
    let toy = await ToyModel.deleteOne({
      _id: delId,
      user_id: req.userData._id,
    });
    res.json(toy);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

module.exports = router;
