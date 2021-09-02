const express = require("express");
const ProductRoutes = express();
const Product = require("../Modeles/Products");
const jwt = require("jsonwebtoken");

ProductRoutes.get("/product", async (req, res) => {
  await Product.find()
    .then((data) => res.send(data))
    .catch((err) => res.send(err));
});
ProductRoutes.post("/product", async (req, res) => {
  //   console.log(req.body);
  //   res.send(req.body);
  const data = {
    product: req.body.product,
    name: req.body.name,
    discription: req.body.discription,
    code: req.body.code,
    color: req.body.color,
  };

  const main = new Product(data);

  await main.save();
  res.json({
    status: "200",
  });
});

module.exports = ProductRoutes;
