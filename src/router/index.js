import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import People from '../views/People.vue';
import Calendar from '../views/Calendar.vue';
import Files from '../views/Files.vue';
import File from '../views/File.vue';
import Reports from '../views/Reports.vue';
import Assignments from '../views/Assignments.vue';
import SubmitReport from '../views/SubmitReport.vue';
import Queue from '../views/Queue.vue';
import Rooms from '../views/Rooms.vue';
import Videos from '../views/Videos.vue';
import PlayVideo from '../views/PlayVideo.vue';
import PathNotFound from '../views/PathNotFound.vue';

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
    path: '/videos/',
    name: 'videos',
    component: Videos,
  },
  {
    path: '/videos/:id',
    name: 'play-video',
    component: PlayVideo,
  },
  {
    path: '/users/:id',
    name: 'people-id',
    component: People,
  },
  {
    path: '/users/',
    name: 'people',
    component: People,
  },
  {
    path: '/rooms/',
    name: 'rooms',
    component: Rooms,
  },
  {
    path: '/reports/',
    name: 'reports',
    component: Reports,
  },
  {
    path: '/reports/:user',
    name: 'submit-report',
    component: SubmitReport,
  },
  {
    path: '/calendar/:event',
    name: 'calendar-event',
    component: Calendar,
  },
  {
    path: '/calendar/',
    name: 'calendar',
    component: Calendar,
  },
  {
    path: '/assignments/:id',
    name: 'assignments-detail',
    component: Assignments,
  },
  {
    path: '/assignments/',
    name: 'assignments',
    component: Assignments,
  },
  {
    path: '/files/:path(.*.pdf)',
    name: 'file',
    component: File,
  },
  {
    path: '/queue',
    name: 'queue',
    component: Queue,
  },
  {
    path: '/files/:path(.*)',
    name: 'files',
    component: Files,
  },
  { path: '/:pathMatch(.*)*', component: PathNotFound },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
