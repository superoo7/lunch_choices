<template>
  <div id="app">
    <header>
      <ul class="nav nav-pills nav-fill">
        <router-link
          class="nav-item nav-link"
          v-for="(n, key) in nav"
          :key="key"
          :to="n"
          :class="n===chosen?'active':''"
        >{{ n }}</router-link>
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
</style>
