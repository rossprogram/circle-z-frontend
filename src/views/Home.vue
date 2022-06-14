<template>
  <v-container fluid fill-height>
    <v-flex xs12 sm12 v-if="!profile">
<h1>Welcome to the Ross Mathematics Program</h1>
<p>This website provides resources so you will succeed in the in-person Ross
Program.  <span v-if="profile">Along the top bar, you will find access to a homework
submission system.</span></p>
<p>If you run into trouble, please feel free to
contact <a href="mailto:ross@rossprogram.org">ross@rossprogram.org</a>
for assistance<span v-if="profile">&mdash; or click on the button in the lower right hand
corner to open a chat window where you can shout for help</span>.</p>

<p v-if="!profile">The first step is to <router-link to="/login">login to your Circle R account</router-link>.</p>

<v-btn v-if="!profile" to="/login" color="primary">Login</v-btn>

    </v-flex>
        <v-flex xs12 sm12 v-else-if="src === null">
        <v-progress-circular indeterminate loading></v-progress-circular>
	<h1 class="mx-6">Loading announcements&hellip;</h1>
    </v-flex>
    <v-flex xs12 sm12 v-else>
      <vue-markdown :source="src"/>
    </v-flex>

</v-container>
</template>

<script>
import { mapState } from 'vuex';
import VueMarkdown from 'vue-markdown-render';
import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = process.env.VUE_APP_API_URL || '';

export default
{
  components: {
    VueMarkdown,
  },
  data() {
    return {
      src: null,
    };
  },
  computed: {
    ...mapState(['profile']),
  },

  mounted() {
    axios.get('/announcements.md').then((response) => {
      if (response.status === 200) {
	this.src = response.data;
      }
    });
  },
};
</script>
