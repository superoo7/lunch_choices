const path = require("path");
const fs = require("fs-extra");
const seedrandom = require("seedrandom");

const foodsFile = path.join(__dirname, "../files/foods.json");
const eatenFile = path.join(__dirname, "../files/eaten.json");

const getFoodsJson = async () => {
  const foodsJson = await fs.readFile(foodsFile, "utf-8");
  return JSON.parse(foodsJson);
};

const addFoodsJson = async food => {
  if (typeof food !== "string") {
    throw new Error("food must be string");
  }
  const foods = await getFoodsJson();
  foods.push(food);
  await fs.writeFile(foodsFile, JSON.stringify(foods));
  return foods;
};

const getEatenJson = async () => {
  const eatenJson = await fs.readFile(eatenFile, "utf-8");
  return JSON.parse(eatenJson);
};

const addEatenJson = async eaten => {
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
  return eatenFoods;
};

const removeEatenJson = async eaten => {
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
  return eatenFoods;
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
  addFoodsJson,
  getEatenJson,
  addEatenJson,
  removeEatenJson,
  remindFood
};
