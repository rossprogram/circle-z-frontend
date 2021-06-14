<template>
<v-lazy style="display: inline;" v-model="lazily">
          <v-btn
            icon
	    :to="`/users/${user.id}`"
	    x-large
            >
	    <v-badge
	      v-if="user.isStaff"
              color="info"
	      offset-x="9"
	      offset-y="9"
	      dot
	      tile
	      bottom
	      bordered
	      >
	      <v-avatar
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
	      offset-x="9"
	      offset-y="9"
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
	      offset-x="9"
	      offset-y="9"
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
</v-lazy>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  computed: {
    ...mapState(['users', 'userImages']),

    user() {
      return this.users[this.userId];
    },

    userImage() {
      return this.userImages[this.userId];
    },

    initials() {
      return (this.user.firstName.slice(0, 1) + this.user.lastName.slice(0, 1)).toUpperCase();
    },
  },

  watch: {
    lazily() {
      if (!this.loaded) {
	this.loaded = true;
	this.getUser(this.userId);
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
      'getUser',
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
