const express = require("express");
const fs = require("fs-extra");
const bodyParser = require("body-parser");
const rateLimit = require("express-rate-limit");
const path = require("path");
const graphqlHTTP = require("express-graphql");
const { schema, root } = require("./graphql");
const { getFoodsJson, getEatenJson, remindFood } = require("./file");
const { sayAction, reportLunch } = require("./say");
const { cryptoPrice } = require("./cg");

const limiter = rateLimit({
  windowMs: 2 * 60 * 1000, // 1 minutes
  max: 200 // limit each IP to 120 requests per windowMs
});

const app = express();

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

const foodsFile = path.join(__dirname, "../files/foods.json");
const eatenFile = path.join(__dirname, "../files/eaten.json");
const randomFoodFile = path.join(__dirname, "../files/random_food.json");

app.use(express.static(path.join(__dirname, "../dist")));
app.use(express.static(path.join(__dirname, "../files")));

// To add food
app.post("/api/food", async (req, res) => {
  // expect json in an array;
  try {
    const { food } = req.body;
    if (typeof food !== "string") {
      throw new Error("food must be string");
    }
    const foods = await getFoodsJson();
    foods.push(food);
    await fs.writeFile(foodsFile, JSON.stringify(foods));
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
    if (typeof eaten !== "string") {
      throw new Error("eaten must be string");
    }
    const foods = await getFoodsJson();
    if (foods.indexOf(eaten) < 0) {
      throw new Error("eaten is not in foods.json");
    }
    const eatenFoods = await getEatenJson();
    if (eatenFoods.indexOf(eaten) >= 0) {
      throw new Error("eaten is in eaten.json already");
    }
    eatenFoods.push(eaten);
    await fs.writeFile(eatenFile, JSON.stringify(eatenFoods));
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
    if (typeof eaten !== "string") {
      throw new Error("eaten must be string");
    }
    let eatenFoods = await getEatenJson();
    const i = eatenFoods.indexOf(eaten);
    if (i < 0) {
      throw new Error("eaten is not in eaten.json");
    }
    eatenFoods = eatenFoods.filter((_d, key) => key !== i);
    await fs.writeFile(eatenFile, JSON.stringify(eatenFoods));
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
  await reportLunch(d.price, d.food);
  res.status(200).json({ success: true, data: d });
});

app.listen("3000", () => {
  console.log("app started at port 3000");
});
