<template>
  <div class="column jumbotron mt-5">
    <h5 class="pb-1">Create Text-To-Speech</h5>
    <div class="input-group mb-3">
      <input @keyup.enter="createTTS" type="text" class="form-control" placeholder="Create TTS">
    </div>
    <p class="text-danger">BEWARE, MIGHT ANNOYED SOMEONE LOL</p>
  </div>
</template>

<script>
export default {
  methods: {
    async createTTS(e) {
      const val = e.target.value;
      if (val === "") {
        window.showSnackbar("No value entered");
        return;
      }
      await fetch("/graphql", {
        method: "POST",
        body: JSON.stringify({ query: `{say(msg: "${val}")}` }),
        headers: {
          "Content-Type": "application/json"
        }
      });
      e.target.value = "";
      window.showSnackbar("Send TTS msg:\n" + val);
    }
  }
};
</script>
