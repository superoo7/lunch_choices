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
const schema = gqlSchema;

const Query = {
  // Query
  gql: () => {
    return gqlSchema;
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
  }
};

const Mutation = {
  // Mutation
  addFood: async (_, { food }) => {
    const foods = await addFoodsJson(food);
    return foods;
  },
  addEaten: async (_, { eaten }) => {
    const eatenFoods = await addEatenJson(eaten);
    return eatenFoods;
  },
  removeEaten: async (_, { eaten }) => {
    const eatenFoods = await removeEatenJson(eaten);
    return eatenFoods;
  },
  say: async (_, { msg }) => {
    try {
      sayAction(msg);
      return true;
    } catch (error) {
      return false;
    }
  },
  randomFood: async (_, { id = "bitcoin" }) => {
    const { data } = await cryptoPrice(id);
    const price = data[id]["usd"];
    const { food } = await remindFood(price);
    reportLunch(price, food, id);
    return {
      food,
      id,
      price
    };
  }
};

const resolvers = {
  Query,
  Mutation
};

module.exports = {
  schema,
  resolvers
};
