import Vue from "vue";
import Router from "vue-router";
import Home from "./components/Home.vue";
import Foods from "./components/Foods.vue";
import TTS from "./components/TTS.vue";
import RandomFood from "./components/RandomFood.vue";
import Developer from "./components/Developer.vue";

Vue.use(Router);

export default new Router({
  mode: "hash",
  base: process.env.BASE_URL,
  routes: [
    {
      alias: "/Home",
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/Foods",
      component: Foods
    },
    {
      path: "/TTS",
      component: TTS
    },
    {
      path: "/RandomFood",
      component: RandomFood
    },
    {
      path: "/Developer",
      component: Developer
    }
    // {
    //   path: "/about",
    //   name: "about",
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () =>
    //     import(/* webpackChunkName: "about" */ "./views/About.vue")
    // }
  ]
});
