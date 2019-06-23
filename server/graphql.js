const { buildSchema } = require("graphql");
const fs = require("fs-extra");
const path = require("path");
const { sayAction, reportLunch } = require("./say");
const { getFoodsJson, getEatenJson, remindFood } = require("./file");
const { cryptoPrice } = require("./cg");

const gqlSchema = fs.readFileSync(
  path.join(__dirname, "./schema.gql"),
  "UTF-8"
);
const schema = buildSchema(gqlSchema);

const root = {
  gql: () => {
    return gqlSchema;
  },
  say: async ({ msg }) => {
    try {
      await sayAction(msg);
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
    reportLunch(price, food);
    return {
      food,
      id,
      price
    };
  }
};

module.exports = {
  schema,
  root
};
