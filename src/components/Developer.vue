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
    <div class="col-12">
      <h3>API Call</h3>
    </div>
    <div class="col-6">
      <h4>GET /eaten.json</h4>
      <p>Foods eaten this week</p>
    </div>
    <div class="col-6">
      <h4>GET /foods.json</h4>
      <p>All Available Foods here</p>
    </div>
    <div class="col-6">
      <h4>GET /random_food.json</h4>
      <p>To get the last random food json</p>
      <pre><code>
{
  "food": "naughty nuri",
  "price": 5246.99
}
                  </code></pre>
    </div>
    <div class="col-6">
      <h4>POST /api/food</h4>
      <p>To add a food</p>
      <pre><code>
{
  "food": "Bah kut teh"
}
              </code></pre>
    </div>
    <div class="col-6">
      <h4>POST /api/eaten</h4>
      <p>To add an eaten food (must be in foods.json)</p>
      <pre><code>
{
  "eaten": "Bah kut teh"
}
                </code></pre>
    </div>
    <div class="col-6">
      <h4>DELETE /api/eaten</h4>
      <p>To delete an eaten food (must be in eaten.json)</p>
      <pre><code>
{
  "eaten": "Bah kut teh"
}
                  </code></pre>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return { gql: "" };
  },
  methods: {
    async fetchGQL() {
      const res = await fetch("/graphql", {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({
          query: "{gql}"
        })
      });
      const { data } = await res.json();
      this.gql = data.gql;
    }
  },
  created() {
    this.fetchGQL();
  }
};
</script>
