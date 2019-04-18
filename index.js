const say = require("say");
const seedrandom = require("seedrandom");
const cron = require("node-cron");
const axios = require("axios");
const express = require("express");
const fs = require("fs-extra");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

const foodsFile = "public/foods.json";
const eatenFile = "public/eaten.json";
const randomFoodFile = "public/random_food.json";

const getFoodsJson = async () => {
  const foodsJson = await fs.readFile(foodsFile, "utf-8");
  return JSON.parse(foodsJson);
};

const getEatenJson = async () => {
  const eatenJson = await fs.readFile(eatenFile, "utf-8");
  return JSON.parse(eatenJson);
};

const sayAction = text => {
  return new Promise((resolve, reject) => {
    say.speak(text, "Samantha", 1.0, resolve);
  });
};

async function reportLunch(seed, food) {
  let counter = 1;

  sayAction(`Today bitcoin is at ${seed}`);

  const clear = setInterval(() => {
    counter++;
    if (counter > 3) {
      clearInterval(clear);
    }
    sayAction(`Today we eat ${food}`);
  }, 5000);
}

async function remindFood(seed, cb) {
  const _foods = await getFoodsJson();
  const eaten = await getEatenJson();
  const foods = _foods.filter(f => eaten.indexOf(f) < 0);

  const rng = seedrandom(seed);
  const i = Math.floor(rng() * foods.length);
  const food = foods[i];
  const data = { food, price: seed };

  return data;
}

const bitcoinPrice = () => {
  return axios.get(
    "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd"
  );
};

// 12.45 pm Monday - Friday
cron.schedule("45 12 * * 1-5", () => {
  bitcoinPrice().then(data => {
    const seed = data.data["bitcoin"]["usd"];
    remindFood(seed);
  });
});

app.use(express.static("public"));

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
  try {
    const { message } = req.body;
    if (typeof message !== "string") {
      throw new Error("message must be string");
    }
    say.speak(message);
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(403).json({ success: false, message: err.message });
  }
});

app.get("/api/random_food", async (req, res) => {
  const data = await bitcoinPrice();
  const seed = data.data["bitcoin"]["usd"];
  const d = await remindFood(seed);
  await fs.writeFile(randomFoodFile, JSON.stringify(d));
  await reportLunch(d.price, d.food);
  res.status(200).json({ success: true, data: d });
});

app.listen("3000", () => {
  console.log("app started at port 3000");
});
