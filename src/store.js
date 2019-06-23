const store = {
  debug: true,

  state: {
    foods: [],
    eaten: []
  },

  setFoods(newValue) {
    if (this.debug) console.log("setFoods triggered with", newValue);
    this.state.foods = newValue;
  },

  setEaten(newValue) {
    if (this.debug) console.log("setFoods triggered with", newValue);
    this.state.eaten = newValue;
  }
};

export default store;
