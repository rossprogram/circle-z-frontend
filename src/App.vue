<template>
  <v-app>
    <v-app-bar
      app
      >
	<v-toolbar-title>ℤ</v-toolbar-title>

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
          <v-list-item to="/calendar/">
	      <v-list-item-icon><v-icon>mdi-calendar</v-icon></v-list-item-icon>
            <v-list-item-title>Calendar</v-list-item-title>
          </v-list-item>
          <v-list-item to="/assignments/">
	      <v-list-item-icon><v-icon>mdi-format-list-numbered</v-icon></v-list-item-icon>
            <v-list-item-title>Homework</v-list-item-title>
          </v-list-item>
          <v-list-item to="/queue/">
	      <v-list-item-icon><v-icon>mdi-playlist-check</v-icon></v-list-item-icon>
            <v-list-item-title>Queue</v-list-item-title>
          </v-list-item>
          <v-list-item to="/files/">
	      <v-list-item-icon><v-icon>mdi-file-multiple</v-icon></v-list-item-icon>
            <v-list-item-title>Files</v-list-item-title>
          </v-list-item>
          <v-list-item to="/reports/" v-if="profile.isStaff || profile.isSuperuser">
	      <v-list-item-icon><v-icon>mdi-account-check</v-icon></v-list-item-icon>
            <v-list-item-title>Reports</v-list-item-title>
          </v-list-item>
          <v-list-item :to="`/rooms/`">
	      <v-list-item-icon><v-icon>mdi-home-city</v-icon></v-list-item-icon>
            <v-list-item-title>Rooms</v-list-item-title>
          </v-list-item>
          <v-list-item :to="`/users/${profile.id}`">
	      <v-list-item-icon><v-icon>mdi-account-group</v-icon></v-list-item-icon>
            <v-list-item-title>People</v-list-item-title>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item :href="saml">
	      <v-list-item-icon><v-icon>mdi-video</v-icon></v-list-item-icon>
            <v-list-item-title>Log into Zoom</v-list-item-title>
          </v-list-item>
          <v-list-item @click="logout">
	      <v-list-item-icon><v-icon>mdi-logout</v-icon></v-list-item-icon>
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

    saml() {
      return `${process.env.VUE_APP_API_URL }/samlp`;
    },
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

<style>
  .v-toolbar__title {
  border-radius: 50%;
  border: 1pt solid black;
  width: 1.87rem;
  height: 1.87rem;
  text-align: center;
  }
</style>
