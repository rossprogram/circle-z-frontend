<template>
  <v-container fluid fill-height>
        <v-flex xs12 sm12>
<h1>Apply to the Ross Mathematics Program</h1>
<p>This website will help you as you navigate the Ross application process.</p>
<p>If you run into any trouble, please feel free to contact <a href="mailto:ross@rossprogram.org">ross@rossprogram.org</a> for assistance.</p>

<p v-if="!profile">The first step is to <router-link to="/signup">sign up for an account</router-link> by providing your email address; a password will be emailed to you.</p>
	    <v-btn v-if="!profile" to="/signup" color="primary">Create a Ross account</v-btn>

<p v-if="profile">After you have created an account, you can begin to <router-link to="/apply">work on your application</router-link>.</p>
	    <v-btn v-if="profile" to="/apply" color="primary">Work on your application</v-btn>

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
