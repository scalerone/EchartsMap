import Vue from "vue"
import Router from "vue-router"

Vue.use(Router)

export default new Router({
  mode: 'hash',
  routes: [
    {
      path: '/',
      name: 'sankey',
      component: () => import(/* webpackChunkName: "sankey" */ "@/views/sankey"),
    },
    {
      path: '/home',
      name: 'home',
      component: () => import(/* webpackChunkName: "home" */ "@/views/home"),
    },
  ]
})
