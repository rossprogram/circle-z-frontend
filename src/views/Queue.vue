<template>
<v-container fluid fill-height>
  <v-row><v-col :cols="12"><h1>Your Family</h1></v-col></v-row>

  <v-row><v-col :cols="12">
  <v-card class="my-6" v-for="homework in recentAssignments.filter( x => myFamily[x.user] )"
:outlined="homework.isGraded"
:key="homework.id">
  <homework-grade :id="homework.id"/>
  </v-card>
  </v-col></v-row>

  <v-row><v-col :cols="12"><h1>Ungraded homework</h1></v-col></v-row>

  <v-row><v-col :cols="12">
  <v-card class="my-6" v-for="homework in recentAssignments.filter( x => ! myFamily[x.user] && ! x.isGraded)" :key="homework.id">
  <homework-grade :id="homework.id"/>
</v-card>
    </v-col></v-row>
</v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import HomeworkGrade from '../components/HomeworkGrade.vue';

export default {
  components: {
    HomeworkGrade,
  },

  computed: {
    ...mapState(['users', 'assignments', 'profile', 'homeworks', 'userAssignments']),

    recentAssignments() {
      const result = Object.values(this.userAssignments).map(Object.values).flat(2);
      result.sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt));
      return result;
    },

    myFamily() {
      const result = {};

      Object.keys(this.users).forEach((u) => {
	if (this.users[u].family === this.profile.family) result[u] = true;
      });

      return result;
    },
  },

  data() {
    return {
    };
  },


  methods: {
    ...mapActions([
      'getAssignments',
      'getHomeworks',
      'getUsers',
      'submitHomework',
    ]),

    submit() {
      this.submitHomework({ user: this.profile.id, assignment: this.id, pdf: this.pdf });
    },

  },

  mounted() {
    this.getUsers();
    this.getHomeworks();
    return this.getAssignments();
  },

};
</script>
