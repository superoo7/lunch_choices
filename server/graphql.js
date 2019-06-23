const { buildSchema } = require("graphql");
const fs = require("fs-extra");
const path = require("path");
const { sayAction, reportLunch } = require("./say");
const {
  getFoodsJson,
  addFoodsJson,
  getEatenJson,
  addEatenJson,
  removeEatenJson,
  remindFood
} = require("./file");
const { cryptoPrice } = require("./cg");

const gqlSchema = fs.readFileSync(
  path.join(__dirname, "./schema.gql"),
  "UTF-8"
);
const schema = buildSchema(gqlSchema);

const root = {
  // Query
  gql: () => {
    return gqlSchema;
  },
  say: async ({ msg }) => {
    try {
      sayAction(msg);
      return true;
    } catch (error) {
      return false;
    }
  },
  foods: async () => {
    const foods = await getFoodsJson();
    return foods;
  },
  eaten: async () => {
    const eaten = await getEatenJson();
    return eaten;
  },
  cryptoPrice: async ({ id }) => {
    const { data } = await cryptoPrice(id);
    return data[id]["usd"];
  },
  randomFood: async ({ id = "bitcoin" }) => {
    const { data } = await cryptoPrice(id);
    const price = data[id]["usd"];
    const { food } = await remindFood(price);
    reportLunch(price, food, id);
    return {
      food,
      id,
      price
    };
  },
  // Mutation
  addFood: async ({ food }) => {
    const foods = await addFoodsJson(food);
    return foods;
  },
  addEaten: async ({ eaten }) => {
    const eatenFoods = await addEatenJson(eaten);
    return eatenFoods;
  },
  removeEaten: async ({ eaten }) => {
    const eatenFoods = await removeEatenJson(eaten);
    return eatenFoods;
  }
};

module.exports = {
  schema,
  root
};
