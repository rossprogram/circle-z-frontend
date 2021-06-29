<template>
<v-lazy style="display: inline;" v-model="lazily">
  <v-tooltip left>
    <template v-slot:activator="{ on, attrs }">
  <v-btn
    v-bind="attrs"
          v-on="on"
            icon
	    :to="`/users/${userId}`"
	    x-large
            >
	    <v-badge
	      v-if="user.isStaff"
              color="info"
	      offset-x="13"
	      offset-y="13"
	      dot
	      tile
	      bottom
	      bordered
	      >
	      <v-avatar
		class="darken-5"
		color="info"
		size="36"
		>
		<img v-if="userImage" :src="userImage"/>
		<span v-else class="white--text text-h7">{{ initials }}</span>
	      </v-avatar>
	    </v-badge>
	    <v-badge
	      v-else-if="user.isFirstYear"
              color="warning"
	      offset-x="12"
	      offset-y="12"
	      dot
	      bottom
	      bordered
	      >
	      <v-avatar
		color="warning"
		size="36"
		>
		<img v-if="userImage" :src="userImage"/>
		<span v-else class="white--text text-h7">{{ initials }}</span>
	      </v-avatar>
	    </v-badge>
	    <v-badge
	      v-else
              color="error"
	      offset-x="12"
	      offset-y="12"
	      dot
	      top
	      bordered
	      >
	      <v-avatar
		color="warning"
		size="36"
		>
		<img v-if="userImage" :src="userImage"/>
		<span v-else class="white--text text-h7">{{ initials }}</span>
	      </v-avatar>
	    </v-badge>
  </v-btn>
</template>
    <span>{{ name }}</span>
    &nbsp;<v-icon class="white--text" v-if="availableForChat[this.userId] || (user && user.meetingId)">mdi-lan-connect</v-icon>
</v-tooltip>
</v-lazy>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  computed: {
    ...mapState(['users', 'userImages', 'availableForChat']),

    user() {
      if (this.users[this.userId]) return this.users[this.userId];
      return {};
    },

    userImage() {
      return this.userImages[this.userId];
    },

    initials() {
      return (this.user.firstName.slice(0, 1) + this.user.lastName.slice(0, 1)).toUpperCase();
    },

    name() {
      if (this.user) {
	if (this.user.nickname) return (`${this.user.nickname } ${ this.user.lastName}`);
	return (`${this.user.firstName } ${ this.user.lastName}`);
      }
      return 'Unknown User';
    },
  },

  watch: {
    lazily() {
      if (!this.loaded) {
	this.loaded = true;
	if (this.userId) this.getUserFromCache(this.userId);
      }
    },
  },

  data() {
    return {
      lazily: false,
    };
  },

  created() {
  },

  methods: {
    ...mapActions([
      'getUserFromCache',
    ]),
  },

  updated() {

  },

  name: 'Person',
  props: {
    userId: String,
  },

};
</script>
