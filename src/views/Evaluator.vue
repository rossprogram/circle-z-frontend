<template>
<v-container fluid>
  <v-row justify="space-around">
    <v-checkbox
      v-model="onlyJuniorCounselors"
      label="Junior counselors"
      ></v-checkbox>
    <v-checkbox
      v-model="onlyFirstyears"
      label="First-years"
      ></v-checkbox>


  </v-row>

    <v-row><v-col><v-card>
	  <v-card-title>Evaluations</v-card-title>
	  <v-list-item three-line v-for="evaluation in filteredEvaluations"
		       :href="`/evaluation/${evaluation.id}`"
		       :key="evaluation.id">
      <v-list-item-icon>
        <v-icon v-if="evaluation.decision === 'accept'" style="color: green;">mdi-account-check</v-icon>
	<v-icon v-else-if="evaluation.decision === 'reject'" style="color: red;">mdi-account-cancel</v-icon>
	<v-icon v-else-if="evaluation.decision === 'waitlist'" style="color: orange;">mdi-account-clock</v-icon>
	<v-icon v-else style="color: gray;">mdi-account-question</v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title>{{ applications[evaluation.application].firstName }} {{ applications[evaluation.application].firstName }}
	      <span v-if="applications[evaluation.application].juniorCounselor">(JC)</span>
	      <span style="float: right;" >
		  <span v-if="applications[evaluation.application].birthday">{{ birthdayToAge(applications[evaluation.application].birthday) }}</span>
	          <v-icon v-if="applications[evaluation.application].gender === 'Male'">mdi-gender-male</v-icon>
		  <v-icon v-else-if="applications[evaluation.application].gender === 'Female'">mdi-gender-female</v-icon>
		  <v-icon v-else>mdi-gender-transgender</v-icon>
		  <vue-country-flag style="vertical-align: top;" v-for="country in applications[evaluation.application].citizenship" :key="country" :country="country" size='medium'/>
	      </span>

	  <vue-stars :name="evaluation.id" style="float: right;" v-if="evaluation.overallScore" readonly :value="evaluation.overallScore"></vue-stars><span style="float: right; margin-right: 1em;">{{ evaluation.problemScores.map( (score) => (score === 'A' || score === 'B' || score === 'C') ? score : '?' ).join(' ') }}</span> </v-list-item-title>
	<v-list-item-subtitle>{{ evaluation.comments }} <span style="float: right;">{{ evaluation.updatedAt | moment("from", "now") }}</span></v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    </v-card></v-col></v-row>

</v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex';

// Across top: name, male/female, citizenship, age, JC-previous-applications

export default {
  computed: {
    ...mapState(['applications', 'evaluationsByEvaluator']),

    evaluatorEvaluations: {
      get() {
	return this.evaluationsByEvaluator[this.$route.params.id];
      },
    },

    filteredEvaluations: {
      get() {
	function ifthen(a, b) {
	  if (a) return b;
	  return true;
	}

	return Object.values(this.evaluatorEvaluations).filter((evaluation) => {
	  const application = this.applications[evaluation.application];

	  return ifthen(this.onlyJuniorCounselors, application.juniorCounselor)
	    && ifthen(this.onlyFirstyears, !application.juniorCounselor);
	    // && ifthen(this.onlyNonempty, application.firstName || application.lastName)
	    // && ifthen(this.onlyMale, application.gender === 'Male')
	    // && ifthen(this.onlyUSA, application.citizenship.indexOf('US') >= 0)
	    // && ifthen(this.onlyNonUSA, application.citizenship.indexOf('US') === -1)
	    // && ifthen(this.onlyFemale, application.gender === 'Female')
	    // && ifthen(this.onlyUnevaluated, application.evaluationCount === 0)
	    // && ifthen(this.onlyEvaluated, application.evaluationCount > 0)
	    // && ifthen(this.onlyEvaluatedByMe, this.myEvaluations.filter(x => x.application === application.id).length > 0);
	}).sort((a, b) => this.compareEvaluations(a, b));
      },
},


  },

  data() {
    return {
      onlyJuniorCounselors: false,
      onlyFirstyears: true,
    };
  },
  methods: {
    ...mapActions([
      'getEvaluatorEvaluations',
      'getApplications',
    ]),

    compareEvaluations(a, b) {
      let left = 0;
      if (a.overallScore) left = a.overallScore;
      let right = 0;
      if (b.overallScore) right = b.overallScore;
      return left - right;
    },

    birthdayToAge(born) {
      const ageDifMs = Date.now() - (new Date(born));
      const ageDate = new Date(ageDifMs);
      return Math.abs(ageDate.getUTCFullYear() - 1970);
    },


  },

  mounted() {
    this.getApplications();
    return this.getEvaluatorEvaluations(this.$route.params.id);
  },
};
</script>
