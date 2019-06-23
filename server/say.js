const say = require("say");

let lock = false;

const sayAction = text => {
  return new Promise(resolve => {
    say.speak(text, "Samantha", 1.0, resolve);
  });
};

async function reportLunch(price, food) {
  let counter = 1;

  if (lock) {
    return;
  }

  lock = true;

  return sayAction(`Today bitcoin is at ${price}`).then(() => {
    const clear = setInterval(() => {
      counter++;
      if (counter > 3) {
        clearInterval(clear);
        lock = false;
      }
      sayAction(`Today we eat ${food}`);
    }, 5000);
  });
}

module.exports = {
  sayAction,
  reportLunch
};
