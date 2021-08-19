const express = require("express");
const User = require("../models/user");
const sharp = require("sharp");
const router = new express.Router();
const auth = require("../middleware/auth");
const multer = require("multer");
const { sendWelcomeEmail, sendCancelEmail } = require("../email/account");

// User endpoints
// signing up route

router.get("/", (req, res) => {
  res.send({
    user: {
      toPostUsersDetails: "/users",
      toGetUserProfile_toUpdate_toDelete_with_http_method: "/users/me",
      toGetAvatar: "/users/me/avatar",
      toLogin: "/users/login",
      toLogout: "/users/logout",
      toLogout: "/users/logoutAll",
      toDeleteUser: "/users/me  using delete http method",
      toPostProfilePhoto: "/users/me/avatar using post http method",
      toDelProfilePhoto: "/users/me/avatar using delete http method",
      toGetProfilePhoto: "/users/:id/avatar",
    },
    task: {
      toPostTask: "/tasks",
      toSearchTask: {
        taskPaging: "GET /tasks?limit=10",
        taskSorting:
          "GET /tasks?sortBy=createdAt_asc Or updatedAt_asc and vice versa",
        taskCompleted: "GET /tasks?completed=true/false",
      },
      toUpdateTask: "PATCH /tasks/:id",
      toGetTasks: "GET /tasks/:id",
      toDelTask: "DELETE /tasks/:id",
    },
  });
});

router.post("/users", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    sendWelcomeEmail(user.email, user.name)
      .then((info) => console.log("welcome mail sent: ", info))
      .catch(console.error);
    const token = await user.getAuthToken();
    // toJSON method is automatically called for sending the secured user's data
    // i.e sending without password and token (Reference: see index.js comments)
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }

  // user
  //   .save()
  //   .then((response) => res.status(201).send(response))
  //   .catch((err) => res.status(400).send(err));
});

router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );

    const token = await user.getAuthToken();

    res.send({ user, token }); // refer toJson in model file and index.js for better understanding
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });

    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];

    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

router.get("/users/me", auth, async (req, res) => {
  //  sending user profiles
  res.send(req.user);

  // try {
  //   const users = await User.find({});
  //   res.send(users);
  // } catch (e) {
  //   res.status(500).send(e);
  // }

  // User.find({})
  //   .then((users) => res.send(users))
  //   .catch((err) => res.status(500).send(err));
});

router.patch("/users/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password", "age"];
  const isValid = updates.every((update) => allowedUpdates.includes(update));

  if (!isValid) return res.status(400).send({ error: "Invalid updates!!" });

  try {
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();
    res.send(req.user);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/users/me", auth, async (req, res) => {
  try {
    await req.user.remove();
    sendCancelEmail(req.user.email, req.user.name)
      .then((info) => console.log("Cancellation mail sent: ", info))
      .catch(console.error);
    res.send(req.user);
  } catch (e) {
    res.status(500).send(e);
  }
});

const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("File must be of type jpg, jpeg, png"));
    }

    cb(undefined, true);
  },
});

router.post(
  "/users/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

router.delete("/users/me/avatar", auth, async (req, res) => {
  req.user.avatar = undefined;
  await req.user.save();
  res.status(200).send();
});

router.get("/users/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user || !user.avatar) {
      throw new Error();
    }

    res.set("Content-Type", "image/png");
    res.send(user.avatar);
  } catch (e) {
    res.status(404).send();
  }
});

module.exports = router;

// router.get("/users/:id", auth, async (req, res) => {
//   const _id = req.params.id;

//   try {
//     const user = await User.findById(_id);
//     if (!user) return res.status(404).send();

//     res.status(202).send(user);
//   } catch (e) {
//     res.status(500).send();
//   }

//   // User.findById(_id)
//   //   .then((user) => {
//   // if (!user) return res.status(404).send();

//   // res.status(202).send(user);
//   //   })
//   //   .catch((err) => res.status(500).send());
// });

// router.patch("/users/:id", auth, async (req, res) => {
//   const updates = Object.keys(req.body);
//   const allowedUpdates = ["name", "email", "password", "age"];
//   const isValid = updates.every((update) => allowedUpdates.includes(update));

//   if (!isValid) return res.status(400).send({ error: "Invalid updates!!" });

//   const _id = req.params.id;

//   try {
//     /*
//       Below code is commented bcoz findByIdandUpdate directly works on database
//       so it bypasses the mongoose middleware, for that reason we have mentioned validators
//       that to be used before updating,
//       So while updating password we have to update hashed one so we adding these three lines
//     */

//     // const user = await User.findByIdAndUpdate(_id, req.body, {
//     //   new: true,
//     //   runValidators: true,
//     // });

//     const user = await User.findById(_id);

//     updates.forEach((update) => (user[update] = req.body[update]));

//     await user.save();

//     if (!user) return res.status(404).send();
//     res.send(user);
//   } catch (e) {
//     res.status(400).send(e);
//   }
// });
