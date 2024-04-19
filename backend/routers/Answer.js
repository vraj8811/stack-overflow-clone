const express = require("express");
const router = express.Router();
const answerDB = require("../models/Answer");

router.post("/", async (req, res) => {
  try {
    if (!req.body.question_id || !req.body.answer) {
      return res.status(400).send({
        message: "Missing Parameter..!!"
      });
    }
    const answerData = new answerDB({
      question_id: req.body.question_id,
      answer: req.body.answer,
      user: req.body.user,
    });

    await answerData
      .save()
      .then((doc) => {
        res.status(201).send(doc);
      })
      .catch((err) => {
        console.error(err.message);
        res.status(400).send({
          message: "Answer not added successfully",
        });
      });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({
      message: "Error while adding Answer",
    });
  }
});

router.put("/:id/vote", async (req, res) => {
  try {

    const { vote } = req.body;
    if (!vote) {
      return res.status(400).send({
        message: "Missing Parameter..!!"
      });
    }

    const answer = await answerDB.findById(req.params.id);

    if (!answer) {
      return res.status(404).send({
        message: "Answer not found",
      });
    }

    answer.votes = answer.votes + vote;

    await answer.save();
    res.status(200).send(answer);
  } catch (err) {
    console.error(err.message);
    res.status(500).send({
      message: "Error while updating Answer",
    });
  }
});

module.exports = router;