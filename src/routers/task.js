const express = require("express");
const router = new express.Router();
const auth = require("../middleware/auth");
const Task = require("../models/task");

// Task endpoints
router.post("/tasks", auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    author: req.user._id,
  });
  try {
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send(err);
  }
  // task
  //   .save()
  //   .then((response) => res.status(201).send(response))
  //   .catch((err) => res.status(400).send(err));
});

// GET /tasks?completed=true
// GET /tasks?limit=10&skip=10 i.e 0 means first set of 10 and 10 second set of 10 and so on.....
// GET /tasks?sortBy=createdAt_asc Or createdAt_desc or createdAt:asc
router.get("/tasks", auth, async (req, res) => {
  const match = {};
  const sort = {};

  if (req.query.completed) {
    match.completed = req.query.completed === "true";
  }

  if (req.query.sortBy) {
    const queryParts = req.query.sortBy.split(":");
    sort[queryParts[0]] = queryParts[1] === "desc" ? -1 : 1;
  }

  try {
    // const tasks = await Task.find({ author: req.user._id });
    await req.user
      .populate({
        path: "tasks",
        // match property is used to match the completed value with the database completed value
        match,
        options: {
          limit: parseInt(req.query.limit),
          skip: parseInt(req.query.skip),
          sort,
          // 1 -> asc, 2-> desc
          // completed: 1,  -1 -> completed (true) tasks, 1-> incompleted (false) tasks
        },
      })
      .execPopulate();
    res.send(req.user.tasks);
  } catch (e) {
    res.status(500).send(e);
  }

  // Task.find({})
  //   .then((tasks) => res.send(tasks))
  //   .catch((err) => res.status(500).send(err));
});

router.get("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;

  try {
    const task = await Task.findOne({ _id, author: req.user._id });
    if (!task) return res.status(404).send();

    res.status(202).send(task);
  } catch (e) {
    res.status(500).send();
  }
  // Task.findById(_id)
  //   .then((task) => {
  // if (!task) return res.status(404).send();

  // res.status(202).send(task);
  //   })
  //   .catch((err) => res.status(500).send());
});

router.patch("/tasks/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["description", "completed"];
  const isValid = updates.every((update) => allowedUpdates.includes(update));

  if (!isValid)
    return res.status(400).send({ error: "Invalid task updates!!" });

  const _id = req.params.id;

  try {
    // const task = await Task.findByIdAndUpdate(_id, req.body, {
    //   new: true,
    //   runValidators: true,
    // });

    const task = await Task.findOne({ _id, author: req.user._id });
    if (!task) return res.status(404).send();

    updates.forEach((update) => (task[update] = req.body[update]));
    task.save();

    res.send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;

  try {
    const task = await Task.findOneAndDelete({ _id, author: req.user._id });
    if (!task) return res.status(404).send();

    res.send(task);
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;
