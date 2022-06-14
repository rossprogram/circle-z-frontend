<template>
  <v-app>
    <v-app-bar
      app
      >
	<v-toolbar-title><a href="/">ℝ</a></v-toolbar-title>

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
	    v-text="'Calendar'"
            >
            <v-icon>account</v-icon>
          </v-btn>
        </template>

	<v-list>
        <v-list-item to="/">
	  <v-list-item-icon><v-icon>mdi-bullhorn</v-icon></v-list-item-icon>
          <v-list-item-title>Announcements</v-list-item-title>
        </v-list-item>
        <v-list-item to="/calendar/">
	  <v-list-item-icon><v-icon>mdi-calendar</v-icon></v-list-item-icon>
          <v-list-item-title>Calendar</v-list-item-title>
        </v-list-item>
        <v-list-item target="_blank" href="https://calendar.google.com/calendar/ical/u963ku10mpsi607amcbepera4s%40group.calendar.google.com/public/basic.ics">
	  <v-list-item-icon><v-icon>mdi-google</v-icon></v-list-item-icon>
          <v-list-item-title>Google Calendar</v-list-item-title>
        </v-list-item>
	</v-list>
      </v-menu>

      <v-menu v-if="profile"
        offset-y transition="slide-y-transition"
      >
        <template v-slot:activator="{ on }">
          <v-btn
	    text
            v-on="on"
	    v-text="'Homework'"
            >
            <v-icon>account</v-icon>
          </v-btn>
        </template>

	<v-list>
        <v-list-item to="/assignments/">
	  <v-list-item-icon><v-icon>mdi-format-list-numbered</v-icon></v-list-item-icon>
          <v-list-item-title>Assignments</v-list-item-title>
        </v-list-item>
        <v-list-item to="/queue/" v-if="profile.isStaff || profile.isSuperuser">
	  <v-list-item-icon><v-icon>mdi-playlist-check</v-icon></v-list-item-icon>
          <v-list-item-title>Queue</v-list-item-title>
        </v-list-item>
        <v-list-item to="/files/">
	  <v-list-item-icon><v-icon>mdi-file-multiple</v-icon></v-list-item-icon>
          <v-list-item-title>Files</v-list-item-title>
        </v-list-item>
	</v-list>
      </v-menu>

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
          <v-list-item :to="`/users/${profile.id}`">
	      <v-list-item-icon><v-icon>mdi-account-group</v-icon></v-list-item-icon>
            <v-list-item-title>People</v-list-item-title>
          </v-list-item>
          <v-list-item to="/activity" v-if="profile.isStaff || profile.isSuperuser">
	      <v-list-item-icon><v-icon>mdi-chart-pie</v-icon></v-list-item-icon>
            <v-list-item-title>Recent activity</v-list-item-title>
          </v-list-item>
          <v-list-item to="/reports/" v-if="profile.isStaff || profile.isSuperuser">
	      <v-list-item-icon><v-icon>mdi-message</v-icon></v-list-item-icon>
            <v-list-item-title>Reports</v-list-item-title>
          </v-list-item>
          <v-list-item to="/checkins/" v-if="profile.isStaff || profile.isSuperuser">
	      <v-list-item-icon><v-icon>mdi-account-check</v-icon></v-list-item-icon>
            <v-list-item-title>Check in</v-list-item-title>
          </v-list-item>
          <v-list-item target="_blank" href="https://store.rossprogram.org/collections/all">
	      <v-list-item-icon><v-icon>mdi-tshirt-crew</v-icon></v-list-item-icon>
            <v-list-item-title>Merchandise</v-list-item-title>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item @click="logout">
	      <v-list-item-icon><v-icon>mdi-logout</v-icon></v-list-item-icon>
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>


    <v-main>
      <v-container fluid class="pa-6" fill-height>
        <v-fade-transition mode="out-in">
	  <router-view />
        </v-fade-transition>
	<chat v-if="profile"></chat>
      </v-container>
    </v-main>
    <Snackbar/>
  </v-app>
</template>

<script>
import { mapState } from 'vuex';
import Chat from '@/components/Chat.vue';
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
    Chat,
  },
  data() {
    return {
      roomIds:
      [
	'95661678187',
	'95145772227',
	'95005886358',
	'97941081315',
	'95854089568',
	'91955193362',
      ],
      publicPath: process.env.BASE_URL,
    };
  },

  methods: {
    logout() {
      this.$store.dispatch('logout')
        .then(() => {
          this.$router.push('/');
        });
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

  .v-application .v-toolbar__title a {
      color: black;
      text-decoration: none;
  }
</style>
