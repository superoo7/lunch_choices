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
import gql from "graphql-tag";

export default {
  methods: {
    createTTS(e) {
      const val = e.target.value;
      this.$apollo
        .mutate({
          mutation: gql`mutation {say(msg: "${val}")} `,
          update: (store, { data: { say } }) => {
            if (say) {
              e.target.value = "";
              window.showSnackbar("Send TTS msg:\n" + val);
            } else {
              window.showSnackbar("Failed to send TTS message");
            }
          }
        })
        .catch(error => {
          window.showSnackbar(error.message);
        });
    }
  }
};
</script>
