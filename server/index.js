const express = require("express");
const fs = require("fs-extra");
const bodyParser = require("body-parser");
const rateLimit = require("express-rate-limit");
const path = require("path");
const cors = require("cors");
const graphqlHTTP = require("express-graphql");
const { schema, root } = require("./graphql");
const {
  addFoodsJson,
  addEatenJson,
  removeEatenJson,
  remindFood
} = require("./file");
const { sayAction, reportLunch } = require("./say");
const { cryptoPrice } = require("./cg");

const limiter = rateLimit({
  windowMs: 2 * 60 * 1000, // 1 minutes
  max: 200 // limit each IP to 120 requests per windowMs
});

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(limiter);

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
  })
);

const eatenFile = path.join(__dirname, "../files/eaten.json");
const randomFoodFile = path.join(__dirname, "../files/random_food.json");

app.use(express.static(path.join(__dirname, "../dist")));
app.use(express.static(path.join(__dirname, "../files")));

// To add food
app.post("/api/food", async (req, res) => {
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
app.post("/api/eaten", async (req, res) => {
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
app.delete("/api/eaten", async (req, res) => {
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
app.post("/api/tts", (req, res) => {
  const { message } = req.body;
  if (typeof message !== "string") {
    throw new Error("message must be string");
  }
  sayAction(message);
  res.status(200).json({ success: true });
});

app.get("/api/random_food", async (req, res) => {
  const data = await cryptoPrice("bitcoin");
  const seed = data.data["bitcoin"]["usd"];
  const d = await remindFood(seed);
  await fs.writeFile(randomFoodFile, JSON.stringify(d));
  await reportLunch(d.price, d.food, "bitcoin");
  res.status(200).json({ success: true, data: d });
});

app.listen("3000", () => {
  console.log("app started at port 3000");
});
