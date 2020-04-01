import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Applications from '../views/Applications.vue';
import Application from '../views/Application.vue';
import Evaluators from '../views/Evaluators.vue';
import Evaluator from '../views/Evaluator.vue';
import Evaluation from '../views/Evaluation.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  {
    path: '/evaluators',
    name: 'evaluators',
    component: Evaluators,
  },
  {
    path: '/evaluators/:id',
    name: 'evaluator',
    component: Evaluator,
  },
  {
    path: '/evaluation/:id',
    name: 'evaluation',
    component: Evaluation,
  },
  {
    path: '/applications',
    name: 'applications',
    component: Applications,
  },
  {
    path: '/applications/:id',
    name: 'application',
    component: Application,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
