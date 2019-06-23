<template>
  <div>
    <div class="container">
      <div class="row mb-2">
        <h1>{{ chosen }}</h1>
      </div>
      <div class="row" v-if="chosen==='Foods'">
        <table class="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Foods</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(f, key) in foods" :key="key" :class="isEaten(f)?'bg-light':''">
              <th scope="row">{{ key + 1 }}</th>
              <td :style="isEaten(f) ? 'text-decoration: line-through;': ''">{{ f }}</td>
            </tr>
          </tbody>
        </table>
        <div class="input-group mb-3">
          <input @keyup.enter="addFood" type="text" class="form-control" placeholder="Add Food">
        </div>
      </div>
      <div class="row" v-else-if="chosen==='Eaten'">
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
                <button @click="deleteEaten(f)" type="button" class="btn btn-danger">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="input-group mb-3">
          <input @keyup.enter="addEaten" type="text" class="form-control" placeholder="Add Eaten">
        </div>
      </div>
      <div class="row" v-else-if="chosen==='Developer'">
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
      <div class="column jumbotron mt-5" v-else-if="chosen==='TTS'">
        <h5 class="pb-1">Create Text-To-Speech</h5>
        <div class="input-group mb-3">
          <input @keyup.enter="createTTS" type="text" class="form-control" placeholder="Create TTS">
        </div>
        <p class="text-danger">BEWARE, MIGHT ANNOYED SOMEONE LOL</p>
      </div>
      <div class="row" v-if="chosen==='RandomFood'">
        <button @click="getRandomFood" class="btn btn-lg btn-success">Random Food</button>
        <div class="col-12 jumbotron">
          <h4 v-if="randomFood.food">Food: {{ randomFood.food }}</h4>
          <h4 v-if="randomFood.price">Bitcoin Price: {{ randomFood.price }}</h4>
        </div>
      </div>
      <div class="column jumbotron" v-else>
        <h1>Welcome to What to eat for lunch site</h1>
        <a
          href="http://192.168.0.192:3000"
          target="_blank"
          rel="noopener noreferrer"
        >192.168.0.192:3000</a>
      </div>
    </div>
  </div>
</template>

<script>
import "./bootstrap.min.css";

export default {
  name: "app",
  data() {
    return {
      eaten: [],
      randomFood: {}
    };
  },
  methods: {
    getRandomFood() {
      fetch("/api/random_food")
        .then(d => d.json())
        .then(d => {
          this.randomFood = d.data;
        });
    },
    createTTS(e) {
      const that = this;
      const val = e.target.value;
      if (val === "") {
        window.showSnackbar("No value entered");
        return;
      }
      fetch("/api/tts", {
        method: "POST",
        body: JSON.stringify({ message: val }),
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(function(res) {
          return res.json();
        })
        .then(function(data) {
          if (data.success === false) {
            window.showSnackbar(data.message);
          } else {
            e.target.value = "";
            window.showSnackbar("Send TTS");
          }
        })
        .catch(function(err) {
          console.log(err);
        });
    },
    deleteEaten(val) {
      const that = this;
      fetch("/api/eaten", {
        method: "DELETE",
        body: JSON.stringify({ eaten: val }),
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(function(res) {
          return res.json();
        })
        .then(function(data) {
          if (data.success === false) {
            window.showSnackbar(data.message);
          } else {
            that.eaten = data;
            window.showSnackbar("Deleted " + val);
          }
        })
        .catch(function(err) {
          console.log(err);
        });
    },
    addEaten(e) {
      const that = this;
      const val = e.target.value;
      if (val === "") {
        window.showSnackbar("No value entered");
        return;
      }
      fetch("/api/eaten", {
        method: "POST",
        body: JSON.stringify({ eaten: val }),
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(function(res) {
          return res.json();
        })
        .then(function(data) {
          if (data.success === false) {
            window.showSnackbar(data.message);
          } else {
            that.eaten = data;
            e.target.value = "";
            window.showSnackbar("Added " + val);
          }
        })
        .catch(function(err) {
          console.log(err);
        });
    },
    addFood(e) {
      const that = this;
      const val = e.target.value;
      if (val === "") {
        window.showSnackbar("No value entered");
        return;
      }
      fetch("/api/food", {
        method: "POST",
        body: JSON.stringify({ food: val }),
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(function(res) {
          return res.json();
        })
        .then(function(data) {
          if (data.success === false) {
            window.showSnackbar(data.message);
          } else {
            that.foods = data;
            e.target.value = "";
            window.showSnackbar("Added " + val);
          }
        })
        .catch(function(err) {
          console.log(err);
        });
    },
    isEaten(f) {
      return this.eaten.indexOf(f) >= 0;
    },
    setChosen(chosen) {
      this.chosen = chosen;
      const chosenHash = "#" + chosen;
      if (history.pushState) {
        history.pushState(null, null, chosenHash);
      } else {
        location.hash = chosenHash;
      }
    },

    getEaten() {
      const that = this;
      fetch("/eaten.json")
        .then(function(res) {
          return res.json();
        })
        .then(function(data) {
          that.eaten = data;
        });
    }
  },
  computed: {},
  created() {
    const hash = location.hash.substr(1);
    this.chosen = hash;
    this.getFoods();
    this.getEaten();
  }
};
</script>

<style>
</style>
