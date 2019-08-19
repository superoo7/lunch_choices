<template>
  <div class="row">
    <div class="col-12">
      <h1>Docs</h1>
    </div>
    <div class="col-12">
      <h3>SSH</h3>
      <pre>
                <code>
ssh pi@192.168.0.192
password: raspberry
                </code>
              </pre>
    </div>
    <div class="col-12">
      <h3>Graphql</h3>
      <p>Endpoint: /graphql</p>
      <a href="/graphql">Graphiql</a>
      <pre>
        <code>
{{gql}}
        </code>
    </pre>
    </div>
  </div>
</template>

<script>
import gql from "graphql-tag";

export default {
  apollo: {
    gql: gql`
      query {
        gql
      }
    `
  }
};
</script>
