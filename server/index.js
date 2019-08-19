const express = require("express");
const rateLimit = require("express-rate-limit");
const path = require("path");
const { schema, resolvers } = require("./graphql");
const {
  addFoodsJson,
  addEatenJson,
  removeEatenJson,
  remindFood
} = require("./file");
const { sayAction, reportLunch } = require("./say");
const { cryptoPrice } = require("./cg");
const { GraphQLServer } = require("graphql-yoga");

const server = new GraphQLServer({
  typeDefs: schema,
  resolvers
});
server.start(
  {
    port: 3000,
    cors: true,
    endpoint: "/graphql",
    playground: "/graphql"
  },
  () => console.log("Server is running on http://localhost:3000")
);

const limiter = rateLimit({
  windowMs: 2 * 60 * 1000, // 1 minutes
  max: 200 // limit each IP to 120 requests per windowMs
});

server.express.use(limiter);
server.express.use(express.static(path.join(__dirname, "../dist")));
server.express.use(express.static(path.join(__dirname, "../files")));

// To add food
server.express.post("/api/food", async (req, res) => {
  // expect json in an array;
  try {
    const { food } = req.body;
    const foods = await addFoodsJson(food);
    res.status(200).json(foods);
  } catch (err) {
    res.status(403).json({ success: false, message: err.message });
  }
});

// To add eaten
server.express.post("/api/eaten", async (req, res) => {
  // expect json in an array;
  try {
    const { eaten } = req.body;
    const eatenFoods = await addEatenJson(eaten);
    res.status(200).json(eatenFoods);
  } catch (err) {
    res.status(403).json({ success: false, message: err.message });
  }
});

// To remove eaten
server.express.delete("/api/eaten", async (req, res) => {
  // expect json in an array;
  try {
    const { eaten } = req.body;
    const eatenFoods = await removeEatenJson(eaten);
    res.status(200).json(eatenFoods);
  } catch (err) {
    res.status(403).json({ success: false, message: err.message });
  }
});

// create tts
server.express.post("/api/tts", (req, res) => {
  const { message } = req.body;
  if (typeof message !== "string") {
    throw new Error("message must be string");
  }
  sayAction(message);
  res.status(200).json({ success: true });
});
