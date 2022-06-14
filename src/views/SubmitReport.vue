<template>
  <v-container fluid fill-height>
    <v-row><v-col>
	<v-card>
	<v-card-title>{{ users[user].firstName }} {{ users[user].lastName }}</v-card-title>
	<v-card-subtitle>Progress Report</v-card-subtitle>
	<v-card-text>
	    <v-layout wrap>
	      <v-flex xs6>
		  <v-select
		    v-model="week"
		    class="mr-6"
		    :items="Array.from(Array(8).keys())"
		    label="Week"
		    prepend-icon="mdi-calendar"
		    ></v-select>
	      </v-flex>
	      <v-flex xs6>
		  <v-select
		    v-model="problemSet"
		    :items="Array.from(Array(30).keys())"
		    label="Problem Set"
		    prepend-icon="mdi-counter"
		    ></v-select>
		</v-flex>
	    </v-layout>
	    <v-layout wrap>
	      <v-flex xs12>
		<p>
	    Please respond to these items.
	    <ol>
	    <li>What NT problem sets have they completed?
	    What sets are they working on now?</li>

	    <li>Does this student attend Ross Collaboration activities in our Zoom rooms?</li>

	    <li>Is this student attending any advance courses at Ross?  If so, which ones?</li>

	    <li>Is this student taking classes, or working on other academic activities, outside of Ross?</li>
	    </ol>
	    </p>
	                  </v-flex>
	      </v-layout>
	    <v-layout wrap>
	      <v-flex xs12>
		<v-textarea
		  outlined
		  label="Your feedback"
                  v-model="text"
		  >
		</v-textarea>
              </v-flex>
	      </v-layout>
	</v-card-text>
    <v-card-actions>
      <v-btn
	text
	@click="submit"
	color="primary"
        :disabled="text.length == 0"
	>
	Submit
      </v-btn>
    </v-card-actions>
    </v-card></v-col></v-row>
</v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  computed: {
    ...mapState(['reports', 'users']),
  },

  data() {
    return {
      user: undefined,
      text: '',
      week: 0,
      problemSet: 0,
    };
  },

  methods: {
    ...mapActions([
      'getReports',
      'getUsers',
      'submitReport',
    ]),

    submit() {
      this.submitReport({
	user: this.user,
	text: this.text,
	week: this.week,
	problemSet: this.problemSet,
      });
      this.$router.push({ path: '/reports/' });
    },
  },


  mounted() {
    this.getUsers();
    this.user = this.$route.params.user;
    return this.getReports();
  },

};
</script>
