<template>
  <div class="column jumbotron">
    <h1>Welcome to What to eat for lunch site</h1>
    <a :href="currentUrl" target="_blank" rel="noopener noreferrer">{{currentUrl}}</a>
    <h5 class="mt-5">Created by Johnson</h5>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentUrl: window.location.href
    };
  }
};
</script>

