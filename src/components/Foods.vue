<template>
  <div class="row">
    <table class="table">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Foods</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(f, key) in foods" :key="key" :class="isEaten(f)?'bg-light':''">
          <th scope="row">{{ key + 1 }}</th>
          <td :style="isEaten(f) ? 'text-decoration: line-through;': ''">{{ f }}</td>
        </tr>
      </tbody>
    </table>
    <div class="input-group mb-3">
      <input @keyup.enter="addFood" type="text" class="form-control" placeholder="Add Food">
    </div>
  </div>
</template>

<script lang="js">
export default {
  data() {
    return {
      foods: [],
      eaten: []
    };
  },
  methods: {
    async getFoods() {
      const res = await fetch("/graphql", {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({
          query: "{foods}"
        })
      });
      const { data } = await res.json();
      this.foods = data.foods;
    },
    async getEaten() {
      const res = await fetch("/graphql", {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({
          query: "{eaten}"
        })
      });
      const { data } = await res.json();
      this.eaten = data.eaten;
    },
   async addFood(e) {
      const val = e.target.value;
      if (val === "") {
        window.showSnackbar("No value entered");
        return;
      }
      const res = await fetch("/graphql", {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({
           query: `mutation {addFood(food: "${val}")}`
          })
      });
      const { data } = await res.json();
      const { addFood } = data;
      this.foods = addFood;
      e.target.value = "";
      window.showSnackbar("Added " + val);
    }, 
    isEaten(f) {
      return this.eaten.indexOf(f) >= 0;
    }
  },
  created() {
    this.getFoods();
  }
};
</script>
