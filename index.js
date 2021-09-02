const express = require("express");
const app = express();
const mongoose = require("mongoose");
app.use(express.json());
const cors = require("cors");
app.use(cors());

require("./config/db");
const User = require("./Modeles/UserSchema");
const Product = require("./Modeles/Products");
const jwt = require("jsonwebtoken");

const protect = require("./helpers/jwtVeryfication");
// app.use(protect);
// app.use(
//   jwtRestify({
//     secret: config.secret,
//     requestProperty: "decoded",
//   }).unless({
//     path: [baseUrl + "/login", /^\/api\/v0\/admin\/users\/.*/],
//   })
// );

require("dotenv").config();

app.use("/", require("./Routes/productRoutes"));

app.get("/user", async (req, res) => {
  await User.find(
    // {
    // $or: [{ age: { $gt: 20 } }, { age: { $lt: 25 } }],
    // age: 30,
    // }
    // {
    //   $or: [{ email: "zamandastgir23@gmail.com" }, { age: 22 }],
    // }
    // { email: "shujasleem@gmail.com" }
    // { email: "shujasleem@gmail.com" }
    {}
  )
    .select("-password")
    .populate("product")
    .then((data) => res.send(data))
    .catch((err) => res.send(err));

  // const bearerToken = req.headers.authorization.split(" ");
  // const token = bearerToken[1];
  // const secret = process.env.SECRET_KEY;
  // console.log(token);
  // jwt.verify(token, secret, async (err, data) => {
  //   if (data) {
  //     await User
  //       .find
  //       // {
  //       // $or: [{ age: { $gt: 20 } }, { age: { $lt: 25 } }],
  //       // age: 30,
  //       // }
  //       // {
  //       //   $or: [{ email: "zamandastgir23@gmail.com" }, { age: 22 }],
  //       // }
  //       // { email: "shujasleem@gmail.com" }
  //       // { email: "shujasleem@gmail.com" }
  //       ()
  //       .then((data) => res.send(data))
  //       .catch((err) => res.send(err));
  //   } else {
  //     res.status(400).send("unauthorized");
  //   }
  // });
});

app.post("/login", async (req, res) => {
  const secret = process.env.SECRET_KEY;

  const token = jwt.sign(
    {
      _id: User._id,
    },
    secret
  );

  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (user)
    res.json({
      status: "200",
      _id: user._id,
      name: user.name,
      email: user.email,
      token: token,
    });
  else {
    res.json({
      status: "400",
      message: "enter correct usrname and password",
    });
  }
});

app.delete("/user", async (req, res) => {
  await User.findOneAndDelete(req.body);
  res.json({
    status: "200",
  });
});

app.put("/user/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, {
      $push: { product: req.body.product },
    });
    res.send(user);
  } catch (error) {
    res.status(400);
  }
});

app.get("/user/:id", async (req, res) => {
  const user = await User.findById(req.params.id).populate("product");

  if (!user) {
    res.status(500).send("not found");
  } else {
    res.send(user);
  }
});

// app.get("/user/:id", (req, res) => {
//   const user = await User.findById(req.params.id);

//   if (!user) {
//     res.status(500).send("not found");
//   } else {
//     res.send(user);
//   }
// });

app.post("/user", async (req, res) => {
  // res.send(req.body);
  const product = await Product.findById(req.body.product);

  if (!product) return res.status(400).send("produc not found");

  const data = {
    name: req.body.name,
    fname: req.body.fname,
    email: req.body.email,
    // age: req.body.age,
    password: req.body.password,
    product: req.body.product,
  };

  const user = await new User(data);

  user.save();
  res.json({
    user,
    status: "200",
  });
});

app.get("/search", async (req, res) => {
  const user = await User.findOne(req.body);
  res.send(user);
});

app.get("/", (req, res) => {});

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);

  res.json({
    error: {
      message: error.message,
    },
  });
});

app.use("*", (req, res) => {
  res.send("Not Found");
});

app.listen(2500, () => {
  console.log("run.......");
});
