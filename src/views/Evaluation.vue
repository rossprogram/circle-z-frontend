<template>
<v-container fluid>
    <v-row><v-col><v-card>
	  <v-card-title>Evaluation by {{ evaluation.evaluator.email }}</v-card-title>
	  <v-card-text class="py-0">
	    <span style="float: right;">{{ evaluation.updatedAt | moment("from", "now") }}</span>

        <v-icon v-if="evaluation.decision === 'accept'" style="color: green;">mdi-account-check</v-icon>
	<v-icon v-else-if="evaluation.decision === 'reject'" style="color: red;">mdi-account-cancel</v-icon>
	<v-icon v-else-if="evaluation.decision === 'waitlist'" style="color: orange;">mdi-account-clock</v-icon>
	<v-icon v-else style="color: gray;">mdi-account-question</v-icon>


        <vue-stars :name="evaluation.id" style="float: right;" v-if="evaluation.overallScore" readonly :value="evaluation.overallScore"></vue-stars><span style="float: right; margin-right: 1em;">{{ evaluation.problemScores.map( (score) => (score === 'A' || score === 'B' || score === 'C') ? score : '?' ).join(' ') }}</span>

	<p>{{ evaluation.comments }}</p>


	  </v-card-text>
	  <v-card-actions>
	  <router-link
  :to="`/applications/${evaluation.application}`"
	    >View application</router-link>
	  </v-card-actions>
    </v-card></v-col></v-row>

</v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex';

// Across top: name, male/female, citizenship, age, JC-previous-applications

export default {
  computed: {
    ...mapState(['evaluationsById']),

    evaluation: {
      get() {
	return this.evaluationsById[this.$route.params.id];
      },
    },

  },

  data() {
    return {
    };
  },
  methods: {
    ...mapActions([
      'getEvaluation',
    ]),
  },

  mounted() {
    return this.getEvaluation(this.$route.params.id);
  },
};
</script>
