const axios = require("axios");

const cryptoPrice = crypto => {
  return axios.get(
    `https://api.coingecko.com/api/v3/simple/price?ids=${crypto}&vs_currencies=usd`
  );
};

module.exports = {
  cryptoPrice
};
