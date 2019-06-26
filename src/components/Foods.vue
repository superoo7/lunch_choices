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
        <tr v-for="(f, key) in foods" :key="key" :class="isEaten(f)?'bg-light':''" class="foodCol">
          <th scope="row">{{ key + 1 }}</th>
          <td
            class="foodColTitle"
            @click="toggleEaten(f)"
            :style="isEaten(f) ? 'text-decoration: line-through;': ''"
          >{{ f }}</td>
        </tr>
      </tbody>
    </table>
    <div class="input-group mb-3">
      <input @keyup.enter="addFood" type="text" class="form-control" placeholder="Add Food">
    </div>
  </div>
</template>

<script lang="js">
import store from "../store";
import gql from "graphql-tag";

export default {
  data() {
    return {
      store: store.state
    };
  },
  apollo: {
    foods: gql`
      query {
        foods
      }
    `,
    eaten: gql`
      query {
        eaten
      }
    `
  },
  methods: {
    toggleEaten(val) {
      this.isEaten(val) ? this.removeEaten(val) : this.addEaten(val);
    },
    addEaten(val) {
      this.$apollo.mutate({
        mutation: gql`
          mutation {
          addEaten(eaten: "${val}")
          }
        `,
        update: (store, { data: { addEaten } }) => {
          store.writeQuery({
            query: gql`
              query {
                eaten
              }
            `,
            data: { eaten: addEaten }
          });
          window.showSnackbar("Added " + val);
        }
      }).catch(error => {
          window.showSnackbar(error.message);
        });
    },
    removeEaten(val) {
      this.$apollo.mutate({
        mutation: gql`mutation { removeEaten(eaten: "${val}") }`,
        update: (store, { data: { removeEaten } }) => {
          store.writeQuery({
            query: gql`
              query {
                eaten
              }
            `,
            data: { eaten: removeEaten }
          });
          window.showSnackbar("Removed " + val);
        }
      })      .catch(error => {
          window.showSnackbar(error.message);
        });
    },
   addFood(e) {
      const val = e.target.value;
      if (val === "") {
        window.showSnackbar("No value entered");
        return;
      }
      this.$apollo.mutate({
        mutation: gql`mutation { addFood(food: "${val}") }`,
        update: (store, { data: { addFood } }) => {
          store.writeQuery({
            query: gql`
              query {
                foods
              }
            `,
            data: { foods: addFood }
          });
          e.target.value = "";
          window.showSnackbar("Added " + val);
        }
      })      .catch(error => {
          window.showSnackbar(error.message);
        });
    }, 
    isEaten(f) {
      return this.eaten ? this.eaten.indexOf(f) >= 0 : false;
    }
  },

};
</script>

<style>
.foodCol:hover {
  background-color: #eee;
}

.foodColTitle:hover {
  text-decoration: line-through;
}
</style>
