<template>
  <v-container fluid fill-height>
        <v-flex xs12 sm12>
<h1>Evaluate Applications to the Ross Mathematics Program</h1>
<p>This website will help you evaluate applications to the Ross Program.</p>
<p>If you run into any trouble, please feel free to contact <a href="mailto:ross@rossprogram.org">ross@rossprogram.org</a> for assistance.</p>

<p v-if="!profile">The first step is to <router-link to="/login">login to your evaluator account</router-link>.</p>
	    <v-btn v-if="!profile" to="/login" color="primary">Login</v-btn>

<p v-if="profile">After you have created an account, you can begin to <router-link to="/applications">view applications</router-link>.</p>
<v-btn v-if="profile" to="/applications" color="primary">View applications</v-btn>

	    &nbsp;<v-btn v-if="profile && profile.isSuperuser" to="/evaluators" color="primary">View evaluators</v-btn>

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
