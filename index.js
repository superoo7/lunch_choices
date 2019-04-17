const say = require("say");
const seedrandom = require("seedrandom");
const cron = require("node-cron");
const axios = require("axios");

const FOODS = [
  "chicken rice",
  "dimsum",
  "thai",
  "vietnam",
  "korean",
  "appu",
  "bah kut teh",
  "wan tan mee",
  "li",
  "nyonya",
  "ted boy",
  "nandos",
  "lean",
  "penang",
  "peng wah",
  "naughty nuri",
  "antipodean",
  "vegetarian",
  "vary pasta",
  "clay pot chicken rice",
  "yong tao fu",
  "village park nasi lemak"
];

function remindFood(seed) {
  let counter = 1;
  const rng = seedrandom(seed);
  const i = Math.floor(rng() * FOODS.length);
  const food = FOODS[i];

  say.speak(`Today bitcoin is at ${seed}`);

  const clear = setInterval(() => {
    counter++;
    if (counter > 5) {
      clearInterval(clear);
    }
    say.speak(`Today we eat ${food}`, "Samantha", 1.0);
  }, 5000);
}

const bitcoinPrice = () => {
  return axios.get(
    "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd"
  );
};

cron.schedule("45 12 * * 1-5", () => {
  bitcoinPrice().then(data => {
    const seed = data.data["bitcoin"]["usd"];
    remindFood(seed);
  });
});
