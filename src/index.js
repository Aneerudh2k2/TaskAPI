const express = require("express");
require("./db/mongoose");
require("dotenv").config();
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");

const app = express();
const port = process.env.PORT;

// const multer = require("multer");
// const upload = multer({
//   dest: "images",
//   limits: {
//     fileSize: 1000000,
//   },
//   fileFilter(req, file, cb) {
//     if (!file.originalname.match(/\.(doc|docx)$/)) {
//       // \. => look for ".", (doc|docx) => checks for string that match doc or docx after the "." char,
//       // $ end the execution
//       return cb(new Error("File must be document"));
//     }

//     cb(undefined, true);
//   },
// });

// app.post(
//   "/upload",
//   upload.single("upload"),
//   (req, res) => {
//     res.send();
//   },
//   // this callback is created to catch an error when middleware throws an error
//   (error, req, res, next) => {
//     res.status(400).send({ error: error.message });
//   }
// );

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
  console.log(`Server is listening to ${port}`);
});

// const func = async () => {
//   let transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: "devcrazapp@gmail.com",
//       pass: "devcrazapp@19",
//     },
//   });

//   let info = await transporter.sendMail(
//     {
//       from: "devcrazapp@gmail.com", // sender address
//       to: "youvaeie.1001@gmail.com", // list of receivers
//       subject: "Hello 💝", // Subject line
//       text: "", // plain text body
//       html: `<h1>Open this to hack you phone 💃</h1><a href="www.bitcoin.org">Clickhere</a>`,
//     },
//     (error, info) => {
//       console.log(info.response);
//     }
//   );
// };

// func();

// app.use((req, res, next) => {
//   if (req.method === "GET") {
//     res.send("GET request are disabled");
//   } else next();
// });

// app.use((req, res, next) => {
//   if (req.method) {
//     res.status(503).send("Site is in maintenance no request are allowed");
//   } else next();
// });

//  irreversible
/* 

const jwt = require("jsonwebtoken");

// const myfun = () => {
//   const token = jwt.sign({ _id: "andajhhnsvb" }, "heyhithisisnodejs", {
//     expiresIn: "7 days",
//   });
//   console.log(token);

//   const data = jwt.verify(token, "heyhithisisnodejs");
//   console.log(data);
// };

// myfun();

*/

/*

this is what exactly res.send() funtion does
when res.send() is called it stringifys the parameteric object
so that function inside the object pet is not stringified


const pet = {
  name: "cow",
};

pet.toJSON = () => { | pet.toJSON = function() {
  console.log(pet);  |     console.log(this)
  return pet;        |     return this
};                   | }


console.log(JSON.stringify(pet));

*/

const Task = require("./models/task");
const User = require("./models/user");

const fun = async () => {
  // getting user data from task id
  // const task = await Task.findById("607af0eab2516b2d1cfc14a7");
  // await task.populate("author").execPopulate();
  // console.log(task);
  // getting task data from user id
  // const user = await User.findById("607af036b2516b2d1cfc14a4");
  // await user.populate("tasks").execPopulate();
  // console.log(user.tasks);
};

fun();
