import Vue from 'vue'
import Router from 'vue-router'
import Home from './view/Home.vue'
import Login from "./components/auth/Login.vue";
import store from "./data/store.js";

Vue.use(Router);

const ifNotAuthenticated = (to, from, next) => {
  if (!store.getters.isAuthenticated) {
    next();
    return;
  }
  next("/");
};

const ifAuthenticated = (to, from, next) => {
  if (store.getters.isAuthenticated) {
    next();
    return;
  }
  next("/login");
};

export default new Router({
  routes: [
    {
      path: "/login",
      name: "Login",
      component: Login,
      beforeEnter: ifNotAuthenticated
    },
    {
      path: '/',
      name: 'home',
      component: Home,
      beforeEnter: ifAuthenticated
    },
    {
      path: '/employees',
      name: 'employees',
      component: () => import('./components/employee/Employee.vue'),
      beforeEnter: ifAuthenticated
    },
    {
      path: '/activities',
      name: 'activities',
      component: () => import('./components/activity/Activity.vue'),
      beforeEnter: ifAuthenticated
    },
    {
      path: '/holidays',
      name: 'holidays',
      component: () => import('./components/production_calendar/ProductionCalendar.vue'),
      beforeEnter: ifAuthenticated
    }
  ]
})
