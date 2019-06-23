<template>
  <div id="app">
    <header>
      <ul class="nav nav-pills nav-fill">
        <router-link class="nav-item nav-link" v-for="(n, key) in nav" :key="key" :to="n">{{ n }}</router-link>
      </ul>
    </header>
    <main class="mt-5">
      <div class="container">
        <router-view/>
      </div>
    </main>
  </div>
</template>

<script>
import "./bootstrap.min.css";

export default {
  data() {
    return {
      nav: ["Home", "Foods", "Eaten", "TTS", "RandomFood", "Developer"]
    };
  }
};
</script>


<style>
.router-link-active {
  color: #fff;
  background-color: #007bff;
}

.router-link-active:hover {
  color: #fff;
  background-color: #0059dd;
}
</style>
