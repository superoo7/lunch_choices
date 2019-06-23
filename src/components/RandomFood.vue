<template>
  <div class="row">
    <h3 class="col-12">Random Food with Crypto Price</h3>
    <div class="col-12 my-3">
      <button @click="getRandomFood('bitcoin')" class="mx-2 btn btn-lg btn-success">Bitcoin</button>
      <button @click="getRandomFood('ethereum')" class="mx-2 btn btn-lg btn-success">Ethereum</button>
      <button @click="getRandomFood('steem')" class="mx-2 btn btn-lg btn-success">Steem</button>
    </div>
    <div class="col-12 jumbotron">
      <h4 v-if="randomFood.food">Food: {{ randomFood.food }}</h4>
      <h4 v-if="randomFood.price">{{randomFood.id}} Price: {{ randomFood.price }}</h4>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return { randomFood: {} };
  },
  methods: {
    async getRandomFood(coin) {
      const res = await fetch("/graphql", {
        method: "POST",
        body: JSON.stringify({
          query: `{
  randomFood(id: "${coin}") {
    id
    price
    food
  }
}
`
        }),
        headers: {
          "Content-Type": "application/json"
        }
      });
      const { data } = await res.json();
      this.randomFood = data.randomFood;
    }
  }
};
</script>
