<template>
  <div class="row">
    <table class="table">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Foods Eaten This Week</th>
          <th scope="col">Delete</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(f, key) in store.eaten" :key="key">
          <th scope="row">{{ key + 1 }}</th>
          <td>{{ f }}</td>
          <td>
            <button @click="removeEaten(f)" type="button" class="btn btn-danger">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="input-group mb-3">
      <input @keyup.enter="addEaten" type="text" class="form-control" placeholder="Add Eaten">
    </div>
  </div>
</template>

<script>
import store from "../store";

export default {
  data() {
    return {
      store: store.state
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
      store.setFoods(data.foods);
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
      store.setEaten(data.eaten);
    },
    async addEaten(e) {
      const val = e.target.value;
      if (val === "") {
        window.showSnackbar("No value entered");
        return;
      }
      const res = await fetch("/graphql", {
        method: "POST",
        body: JSON.stringify({
          query: `mutation { addEaten(eaten: "${val}") }`
        }),
        headers: {
          "Content-Type": "application/json"
        }
      });
      const { data } = await res.json();
      store.setEaten(data.addEaten);
      e.target.value = "";
      window.showSnackbar("Added " + val);
    },
    async removeEaten(val) {
      const res = await fetch("/graphql", {
        method: "POST",
        body: JSON.stringify({
          query: `mutation { removeEaten(eaten: "${val}") }`
        }),
        headers: {
          "Content-Type": "application/json"
        }
      });
      const { data } = await res.json();
      window.showSnackbar("Deleted " + val);
      store.setEaten(data.removeEaten);
    }
  },
  created() {
    if (this.store.foods.length === 0) {
      this.getFoods();
    }
    if (this.store.eaten.length === 0) {
      this.getEaten();
    }
  }
};
</script>
