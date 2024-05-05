const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const QuestionDB = require("../models/Question");

router.post('/', async (req, res) => {
  try {

    if (!req.body.title || !req.body.body || !req.body.tag) {
      return res.status(400).send({
        message: "Missing Parameter..!!"
      });
    }

    const questionData = new QuestionDB({
      title: req.body.title,
      body: req.body.body,
      tags: req.body.tag,
      user: req.body.user,
    });

    await questionData
      .save()
      .then((doc) => {
        res.status(201).send(doc);
      })
      .catch((err) => {
        console.error(err.message);
        res.status(400).send({
          message: "Question not added successfully",
        });
      });

  } catch (err) {
    console.error(err.message);
    res.status(500).send({
      message: "Error while adding Question",
    });
  }
});

router.get("/", async (req, res) => {
  const error = {
    message: "Error in retrieving questions",
    error: "Bad request",
  };

  QuestionDB.aggregate([
    {
      $lookup: {
        from: "comments",
        let: { question_id: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$question_id", "$$question_id"],
              },
            },
          },
          {
            $project: {
              _id: 1,
              comment: 1,
              created_at: 1
            },
          },
        ],
        as: "comments",
      },
    },
    {
      $lookup: {
        from: "answers",
        let: { question_id: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$question_id", "$$question_id"],
              },
            },
          },
          {
            $project: {
              _id: 1
            },
          },
        ],
        as: "answerDetails",
      },
    },
    {
      $project: {
        __v: 0
      },
    },
  ])
    .exec()
    .then((questionDetails) => {
      res.status(200).send(questionDetails);
    })
    .catch((e) => {
      console.log("Error: ", e);
      res.status(400).send(error);
    });
});

router.get("/:id", async (req, res) => {
  try {
    QuestionDB.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(req.params.id) },
      },
      {
        $lookup: {
          from: "answers",
          let: { question_id: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$question_id", "$$question_id"],
                },
              },
            },
            {
              $project: {
                _id: 1,
                user: 1,
                answer: 1,
                votes: 1,
                question_id: 1,
                created_at: 1,
              },
            },
          ],
          as: "answerDetails",
        },
      },
      {
        $lookup: {
          from: "comments",
          let: { question_id: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$question_id", "$$question_id"],
                },
              },
            },
            {
              $project: {
                _id: 1,
                question_id: 1,
                user: 1,
                comment: 1,
                created_at: 1,
              },
            },
          ],
          as: "comments",
        },
      },
      {
        $project: {
          __v: 0
        },
      },
    ])
      .exec()
      .then((questionDetails) => {
        res.status(200).send(questionDetails);
      })
      .catch((e) => {
        console.log("Error: ", e);
        res.status(400).send(error);
      });
  } catch (err) {
    console.log(err.message);
    res.status(400).send({
      message: "Question not found 1",
    });
  }
});

router.put("/:id/vote", async (req, res) => {
  try {
    const questionId = req.params.id;
    const { vote } = req.body;

    if (!vote) {
      return res.status(400).send({
        message: "Missing Parameter..!!"
      });
    }

    const question = await QuestionDB.findById(questionId);

    if (!question) {
      return res.status(404).send({
        message: "Question not found"
      });
    }

    question.votes += vote;

    await question.save();

    res.status(200).send(question);
  } catch (err) {
    console.error(err.message);
    res.status(500).send({
      message: "Error while updating question votes"
    });
  }
});

router.put("/:id/view", async (req, res) => {
  try {
    const questionId = req.params.id;

    const question = await QuestionDB.findById(questionId);

    if (!question) {
      return res.status(404).send({
        message: "Question not found"
      });
    }

    question.views += 1;

    await question.save();

    res.status(200).send(question);
  } catch (err) {
    console.error(err.message);
    res.status(500).send({
      message: "Error while updating question votes"
    });
  }
});

router.get("/user/getque/:id", async (req, res) => {
  try {
    const uid = req.params.id;
    QuestionDB.aggregate([
      {
        $match: { "user.uid": uid },
      },
      {
        $lookup: {
          from: "answers",
          let: { question_id: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$question_id", "$$question_id"],
                },
              },
            },
            {
              $project: {
                _id: 1,
                user: 1,
                answer: 1,
                votes: 1,
                question_id: 1,
                created_at: 1,
              },
            },
          ],
          as: "answerDetails",
        },
      },
      {
        $lookup: {
          from: "comments",
          let: { question_id: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$question_id", "$$question_id"],
                },
              },
            },
            {
              $project: {
                _id: 1,
                question_id: 1,
                user: 1,
                comment: 1,
                created_at: 1,
              },
            },
          ],
          as: "comments",
        },
      },
      {
        $project: {
          __v: 0
        },
      },
    ])
      .exec()
      .then((questionDetails) => {
        res.status(200).send(questionDetails);
      })
      .catch((e) => {
        console.log("Error: ", e);
        res.status(400).send(error);
      });
  } catch (err) {
    console.log(err.message);
    res.status(400).send({
      message: "Question not found 1",
    });
  }
});

module.exports = router;