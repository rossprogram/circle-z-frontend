<template>
<v-container fluid>
  <v-checkbox
    v-model="onlyJuniorCounselors"
    label="Junior counselors"
    ></v-checkbox>
  <v-checkbox
    v-model="onlySubmitted"
    label="Submitted"
    ></v-checkbox>
  <v-checkbox
    v-model="onlyUnevaluated"
    label="Unevaluated"
    ></v-checkbox>

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
            <v-list-item-title>{{ application.firstName }} {{ application.lastName }}</v-list-item-title>
	    <v-list-item-subtitle v-if="application.updatedAt">Last updated {{ application.updatedAt | moment("from", "now") }}.  Evaluated by {{ application.evaluationCount }} evalutor{{application.evaluationCount.length == 1 ? '' : 's' }}.</v-list-item-subtitle>
	  </v-list-item-content>
	</v-list-item>
  </v-card></v-col></v-row>
</v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  computed: {
    ...mapState(['applications']),

filteredApplications: {
get() {
function ifthen(a, b) {
if (a) return b;
return true;
}

return Object.values(this.applications).filter(application => (ifthen(this.onlySubmitted, application.submitted) && ifthen(this.onlyJuniorCounselors, application.juniorCounselor)
&& ifthen(this.onlyUnevaluated, application.evaluationCount === 0))).sort((a, b) => this.compareApplications(a, b));
},
},

  },


  data() {
    return {
      onlyJuniorCounselors: false,
onlySubmitted: true,
onlyUnevaluated: true,
    };
  },
  methods: {
    ...mapActions([
      'getApplications',
    ]),

compareApplications(a, b) {
      return (new Date(a.updatedAt).getTime()) - (new Date(b.updatedAt).getTime());
    },
  },

  mounted() {
    return this.getApplications();
  },
};
</script>
