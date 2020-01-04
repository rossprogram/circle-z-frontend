<template>
<v-container fluid>
  <v-row><v-col><v-card>
	<v-card-title>Applications</v-card-title>
	<v-card-subtitle>{{Object.keys(applications).length}} application{{Object.keys(applications).length == 1 ? '' : 's'}}</v-card-subtitle>

	<v-list-item two-line v-for="application in applications"
		     :href="`/applications/${application.id}`"
		     :key="application.id">
	  <v-list-item-icon>
            <v-icon v-if="application.submitted">mdi-inbox-full</v-icon>
	    <v-icon v-else>mdi-inbox</v-icon>
	  </v-list-item-icon>
	  <v-list-item-content>
            <v-list-item-title>{{ application.firstName }} {{ application.lastName }}</v-list-item-title>
	    <v-list-item-subtitle v-if="application.updatedAt">Last updated {{ application.updatedAt | moment("from", "now") }}</v-list-item-subtitle>
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
  },


  data() {
    return {
    };
  },
  methods: {
    ...mapActions([
      'getApplications',
    ]),


  },

  mounted() {
    return this.getApplications();
  },
};
</script>
