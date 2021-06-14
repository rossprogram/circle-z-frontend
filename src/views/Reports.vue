<template>
  <v-container fluid fill-height>
    <v-row v-for="report in Object.values(reports)" :key="report.id"><v-col>
	<v-card>
	<v-card-title v-if="report.user">{{ users[report.user].firstName }} {{ users[report.user].lastName }}, Week {{ report.week }}</v-card-title>
	<v-card-subtitle v-if="report.reporter">from {{ users[report.reporter].firstName }} {{ users[report.reporter].lastName }} at {{ report.createdAt | moment('MMMM Do YYYY, h:mma') }},
	  {{ report.createdAt | moment("from", "now") }}.  Problem set {{ report.problemSet }}.</v-card-subtitle>
	<v-card-text>
	  {{ report.text }}
	  </v-card-text>
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
    };
  },

  methods: {
    ...mapActions([
      'getReports',
      'getUsers',
    ]),
  },


  mounted() {
    this.getUsers();
    return this.getReports();
  },

};
</script>
