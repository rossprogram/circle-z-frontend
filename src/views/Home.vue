<template>
  <v-container fluid fill-height>
        <v-flex xs12 sm12>
<h1>Welcome to the Online Ross Mathematics Program</h1>
<p>This website provides resources so you will succeed in the Ross
Program.  <span v-if="profile">Along the top bar, you will find access to the Zoom rooms,
previous recorded videos, as well as the problem sets and a homework
submission system.</span></p>
<p>If you run into trouble, please feel free to
contact <a href="mailto:ross@rossprogram.org">ross@rossprogram.org</a>
for assistance<span v-if="profile">&mdash; or click on the button in the lower right hand
corner to open a chat window where you can shout for help</span>.</p>

<p v-if="!profile">The first step is to <router-link to="/login">login to your Circle Z account</router-link>.</p>

<v-btn v-if="!profile" to="/login" color="primary">Login</v-btn>

</v-flex>
</v-container>
</template>

<script>
import { mapState } from 'vuex';

export default {
computed: {
...mapState(['profile']),
},
};
</script>
