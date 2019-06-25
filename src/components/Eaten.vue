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
        <tr v-for="(f, key) in eaten" :key="key">
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
import gql from "graphql-tag";

window.gql = gql;

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
    addEaten(e) {
      const val = e.target.value;
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
          e.target.value = "";
          window.showSnackbar("Added " + val);
        }
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
      });
    }
  }
};
</script>
