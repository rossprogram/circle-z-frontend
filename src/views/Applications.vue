<template>
<v-container fluid>
  <v-row justify="space-around">
    <v-checkbox
      v-model="onlyNonempty"
      label="Non-empty"
      ></v-checkbox>
    <v-checkbox
      v-model="onlyJuniorCounselors"
      label="Junior counselors"
      ></v-checkbox>
    <v-checkbox
      v-model="onlyFirstyears"
      label="First-years"
      ></v-checkbox>

    <v-checkbox
      v-model="onlySubmitted"
      label="Submitted"
      ></v-checkbox>
    <v-checkbox
      v-model="onlyUnevaluated"
      label="Unevaluated"
      ></v-checkbox>
    <v-checkbox
      v-model="onlyEvaluated"
      label="Evaluated"
      ></v-checkbox>
    <v-checkbox
      v-model="onlyEvaluatedByMe"
      label="Evaluated by me"
      ></v-checkbox>
    <v-checkbox
      v-if="profile.isSuperuser"
      v-model="onlyMale"
      label="Male"
      ></v-checkbox>
    <v-checkbox
      v-if="profile.isSuperuser"
      v-model="onlyFemale"
      label="Female"
      ></v-checkbox>
    <v-checkbox
      v-if="profile.isSuperuser"
      v-model="onlyUSA"
      label="USA"
      ></v-checkbox>
    <v-checkbox
      v-if="profile.isSuperuser"
      v-model="onlyNonUSA"
      label="Non-USA"
      ></v-checkbox>
  </v-row>

  <v-row justify="space-around">
    <v-select
      v-model="sortBy"
      :items="sortMethods"
      item-text="name"
      item-value="alpha2"
      label="Sort by"
      />
    <v-checkbox
      v-model="reverseSort"
      label="Reverse"
      ></v-checkbox>
  </v-row>

  <v-row><v-col><v-card>
	<v-card-title>Applications</v-card-title>
	<v-card-subtitle>{{filteredApplications.length}} application{{filteredApplications.length == 1 ? '' : 's'}}</v-card-subtitle>
	<v-list-item two-line v-for="application in filteredApplications"
		     :href="`/applications/${application.id}`"
		     :key="application.id">
	  <v-list-item-icon>
            <v-icon v-if="application.submitted">mdi-inbox-full</v-icon>
	    <v-icon v-else>mdi-inbox</v-icon>
	  </v-list-item-icon>
	  <v-list-item-content>
            <v-list-item-title>
	      {{ application.firstName }} {{ application.lastName }}
	      <span v-if="application.juniorCounselor">(JC)</span>
	      <span style="float: right;" v-if="profile.isSuperuser">
		  <span v-if="application.birthday">{{ birthdayToAge(application.birthday) }}</span>
	          <v-icon v-if="application.gender === 'Male'">mdi-gender-male</v-icon>
		  <v-icon v-else-if="application.gender === 'Female'">mdi-gender-female</v-icon>
		  <v-icon v-else>mdi-gender-transgender</v-icon>
		  <vue-country-flag style="vertical-align: top;" v-for="country in application.citizenship" :key="country" :country="country" size='medium'/>
	      </span>
	    </v-list-item-title>
	    <v-list-item-subtitle v-if="application.updatedAt">Last updated {{ application.updatedAt | moment("from", "now") }}.  Evaluated by {{ application.evaluationCount }} evaluator{{application.evaluationCount.length == 1 ? '' : 's' }}.
	      <span v-if="myEvaluations.filter( (x) => x.application == application.id ).length > 0">
		Evaluated by me.
	      </span>
	    </v-list-item-subtitle>
	  </v-list-item-content>
	</v-list-item>
  </v-card></v-col></v-row>
</v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  computed: {
    ...mapState(['applications', 'profile', 'myEvaluations']),

filteredApplications: {
get() {
function ifthen(a, b) {
if (a) return b;
return true;
}

  return Object.values(this.applications).filter(application => (
    ifthen(this.onlySubmitted, application.submitted)
      && ifthen(this.onlyJuniorCounselors, application.juniorCounselor)
      && ifthen(this.onlyFirstyears, !application.juniorCounselor)
      && ifthen(this.onlyNonempty, application.firstName || application.lastName)
      && ifthen(this.onlyMale, application.gender === 'Male')
      && ifthen(this.onlyUSA, application.citizenship.indexOf('US') >= 0)
      && ifthen(this.onlyNonUSA, application.citizenship.indexOf('US') === -1)
      && ifthen(this.onlyFemale, application.gender === 'Female')
      && ifthen(this.onlyUnevaluated, application.evaluationCount === 0)
      && ifthen(this.onlyEvaluated, application.evaluationCount > 0)
      && ifthen(this.onlyEvaluatedByMe, this.myEvaluations.filter(x => x.application === application.id).length > 0)
  )).sort((a, b) => this.compareApplications(a, b));
},
},

  },

  data() {
    return {
      sortMethods: ['random', 'last updated', 'number of evaluations'],
      sortBy: 'random',
      onlyJuniorCounselors: false,
      onlyNonempty: true,
      onlyFirstyears: true,
      onlyEvaluatedByMe: false,
      onlySubmitted: true,
      onlyMale: false,
      onlyFemale: false,
      onlyUSA: false,
      onlyNonUSA: false,
      onlyUnevaluated: true,
      onlyEvaluated: false,
      reverseSort: false,
    };
  },
  methods: {
    ...mapActions([
      'getApplications',
      'getMyEvaluations',
    ]),

    birthdayToAge(born) {
      const ageDifMs = Date.now() - (new Date(born));
      const ageDate = new Date(ageDifMs);
      return Math.abs(ageDate.getUTCFullYear() - 1970);
    },

    hashString(s) {
      let hash = 0;
      if (s.length === 0) {
        return hash;
      }

      for (let i = 0; i < s.length; i += 1) {
        const char = s.charCodeAt(i);
        hash = ((hash << 5) - hash) + char; // eslint-disable-line no-bitwise
        hash &= hash;// eslint-disable-line no-bitwise
      }
      return hash;
    },

    compareApplications(a, b) {
      const sign = this.reverseSort ? 1 : -1;

      if (this.sortBy === 'last updated') return sign * ((new Date(a.updatedAt).getTime()) - (new Date(b.updatedAt).getTime()));

      if (this.sortBy === 'number of evaluations') return sign * (a.evaluationCount - b.evaluationCount);

      return sign * (this.hashString(this.profile.id + a.id) - this.hashString(this.profile.id + b.id));
    },
  },

  mounted() {
    this.getMyEvaluations();
    return this.getApplications();
  },
};
</script>
