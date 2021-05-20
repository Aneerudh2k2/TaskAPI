const mongoose = require("mongoose");

mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

// const u1 = new User({
//   name: "    Anee",
//   email: "ANEE@somemail.COM    ",
//   password: "Password123 ",
// });
// u1.save()
//   .then((res) => console.log(res))
//   .catch((err) => console.log("Error ", err));

// const t1 = new Tasks({
//   description: "Attend meeting at 7",
// });
// t1.save()
//   .then((res) => console.log(res))
//   .catch((err) => console.log(err));
