const path = require("path");
const fs = require("fs-extra");
const seedrandom = require("seedrandom");

const foodsFile = path.join(__dirname, "../files/foods.json");
const eatenFile = path.join(__dirname, "../files/eaten.json");

const getFoodsJson = async () => {
  const foodsJson = await fs.readFile(foodsFile, "utf-8");
  return JSON.parse(foodsJson);
};

const getEatenJson = async () => {
  const eatenJson = await fs.readFile(eatenFile, "utf-8");
  return JSON.parse(eatenJson);
};

const remindFood = async seed => {
  const _foods = await getFoodsJson();
  const eaten = await getEatenJson();
  const foods = _foods.filter(f => eaten.indexOf(f) < 0);

  const rng = seedrandom(seed);
  const i = Math.floor(rng() * foods.length);
  const food = foods[i];
  const data = { food, price: seed };

  return data;
};

module.exports = {
  getFoodsJson,
  getEatenJson,
  remindFood
};
