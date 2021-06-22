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
	    v-text="'Video'"
            >
            <v-icon>account</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item :to="`/watch-party/`">
	      <v-list-item-icon><v-icon>mdi-party-popper</v-icon></v-list-item-icon>
            <v-list-item-title>Watch Together</v-list-item-title>
          </v-list-item>
          <v-list-item :to="`/videos/`">
	      <v-list-item-icon><v-icon>mdi-filmstrip</v-icon></v-list-item-icon>
            <v-list-item-title>Previous recordings</v-list-item-title>
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
	    v-text="'Zoom'"
            >
            <v-icon>account</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item :href="saml">
	      <v-list-item-icon><v-icon>mdi-video</v-icon></v-list-item-icon>
            <v-list-item-title>Log into Zoom</v-list-item-title>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item
	    target="_blank"
	    href="https://rossprogram-org.zoom.us/j/97492237273">
	    <v-list-item-icon><v-icon>mdi-bank</v-icon></v-list-item-icon>
            <v-list-item-title>Auditorium</v-list-item-title>
          </v-list-item>
	  <v-list-item >
            <v-list-item-title>Room
	    <v-btn v-for="(id, index) in roomIds"
		   :key="index"
		   target="_blank"
		   :href="`https://rossprogram-org.zoom.us/j/${id}`"
		   icon>
	      <v-icon>mdi-numeric-{{ index + 1}}-box</v-icon>
	    </v-btn>
	    </v-list-item-title>
	  </v-list-item>
          <v-list-item :to="`/rooms/`">
	      <v-list-item-icon><v-icon>mdi-home-city</v-icon></v-list-item-icon>
            <v-list-item-title>All Rooms</v-list-item-title>
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
          <v-list-item :to="`/users/${profile.id}`">
	      <v-list-item-icon><v-icon>mdi-account-group</v-icon></v-list-item-icon>
            <v-list-item-title>People</v-list-item-title>
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
	<chat></chat>
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
	'94283884786',
	'96986251680',
	'97595923102',
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
