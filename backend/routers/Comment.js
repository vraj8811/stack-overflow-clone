const express = require("express");
const router = express.Router();

const commentDB = require("../models/Comment");

router.post("/:id", async (req, res) => {
  try {
    if(!req.body.comment || !req.params.id)
    {
        return res.status(400).send({
            message:"Missing Parameter..!!"
        });
    }
    await commentDB
      .create({
        question_id: req.params.id,
        comment: req.body.comment,
        user: req.body.user,
      })
      .then((doc) => {
        res.status(201).send({
          message: "Comment added successfully",
        });
      })
      .catch((err) => {
        console.error(err.message);
        res.status(400).send({
          message: "Bad format",
        });
      });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({
      message: "Error while adding comments",
    });
  }
});

module.exports = router;