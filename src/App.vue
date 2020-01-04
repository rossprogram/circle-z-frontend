<template>
  <v-app>
    <v-app-bar
      app
    >
      <v-toolbar-title>ev : ℤ[<em>x</em>] → ℤ</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn v-if="!profile"
	     class="mr-2"
        to="/login"
             text
      >Log In</v-btn>
      <v-menu v-if="profile"
        offset-y transition="slide-y-transition"
      >
        <template v-slot:activator="{ on }">
          <v-btn
	    text
            v-on="on"
	    v-text="profile.email"
            >
            <v-icon left>account-circle</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item to="/applications">
            <v-list-item-title>Applications</v-list-item-title>
          </v-list-item>
          <v-list-item @click="logout">
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-content>
      <v-container fluid class="pa-6">
        <v-fade-transition mode="out-in">
	  <router-view />
        </v-fade-transition>
      </v-container>
    </v-content>
    <Snackbar/>
  </v-app>
</template>

<script>
import { mapState } from 'vuex';
import Snackbar from './components/Snackbar.vue';

export default {
name: 'App',
  computed: {
    ...mapState(['profile']),
  },

  components: {
    Snackbar,
  },
  data() {
return {
      publicPath: process.env.BASE_URL,
    };
  },

  methods: {
    logout() {
      this.$store.dispatch('logout');
    },
  },

};
</script>
