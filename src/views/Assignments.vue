<template>
<v-container fluid fill-height>

  <v-navigation-drawer app permanent>
	<v-list-item v-if="profile.isStaff" two-line :to="'/assignments/new'">
	  <v-list-item-icon>
            <v-icon>mdi-plus-circle-outline</v-icon>
	  </v-list-item-icon>
	  <v-list-item-content>
            <v-list-item-title>
	      New assignment
	    </v-list-item-title>
	    <v-list-item-subtitle>
	    </v-list-item-subtitle>
	  </v-list-item-content>
	</v-list-item>

	<v-list-item two-line v-for="assignment in sortedAssignments"
		     :to="'/assignments/' + assignment.id"
		     :key="assignment.id">
	  <v-list-item-icon>
            <v-icon v-if="alreadyComplete(assignment.id)">mdi-check</v-icon>
              <v-icon v-if="alreadyGraded(assignment.id)">mdi-sync</v-icon>
              <v-icon v-if="alreadySubmitted(assignment.id)">mdi-help-circle-outline</v-icon>
              <v-icon v-else>mdi-circle-outline</v-icon>
	    </v-list-item-icon>
	    <v-list-item-content>
            <v-list-item-title>
	      {{ assignment.title }}
	    </v-list-item-title>
	    <v-list-item-subtitle>
	      {{ assignment.releasedAt | moment('MMMM Do YYYY') }},
	      {{  assignment.releasedAt | moment("from", "now") }}.
	      <span v-if="profile.isStaff">Sort key: {{ assignment.sortOrder }}</span>
	    </v-list-item-subtitle>
	  </v-list-item-content>
	</v-list-item>
	</v-navigation-drawer>

  <v-row><v-col v-if="id == 'new'" cols="12">
      <v-card class="my-3" v-if="profile.isStaff">
	<v-card-title>New assignment</v-card-title>
	<v-card-subtitle></v-card-subtitle>
	<v-card-text>
	  <v-layout wrap>
	    <v-flex xs12>
	      <v-text-field
		label="Name"
		v-model="title"
		/>
            </v-flex>
	  </v-layout>
	  <v-layout wrap>
	    <v-flex xs12>
	      <v-text-field
		label="URL"
		v-model="url"
		/>
            </v-flex>
	  </v-layout>
	  <v-layout wrap>
	    <v-flex xs6>
	      <v-text-field
		class="mr-3"
		label="Sort order"
		v-model="sortOrder"
		/>
            </v-flex>
	    <v-flex xs6>
		<v-checkbox
		  v-model="extraCredit"
		  label="Extra Credit"
		  ></v-checkbox>
            </v-flex>
	  </v-layout>
	</v-card-text>
	  <v-card-actions>
	    <v-btn
	      text
	      @click="addAssignment"
	      color="primary"
	      >
	      Add assignment
	    </v-btn>
	  </v-card-actions>
      </v-card>
    </v-col>

    <v-col cols="12" v-if="assignments[id]" :key="id"><v-card>
        <v-card-title>
	  {{ assignments[id].title }}
	</v-card-title>
	<v-card-subtitle>
	  {{ assignments[id].releasedAt | moment('MMMM Do YYYY') }},
	  {{  assignments[id].releasedAt | moment("from", "now") }}.
	</v-card-subtitle>
	<v-card-text>
	  <v-layout wrap>
	    <v-flex xs8>
	      <v-text-field
		class="mr-4"
		label="Name"
		:readonly="!profile.isStaff"
		v-model="assignmentTitle"
		/>
            </v-flex>

	    <v-flex xs4>
	      <v-checkbox
		v-model="assignmentExtraCredit"
		label="Extra Credit"
		:readonly="!profile.isStaff"
		:disabled="!profile.isStaff"
		></v-checkbox>
            </v-flex>
          </v-layout>
	  <v-layout wrap v-if="profile.isStaff">
	    <v-flex xs12>
	      <v-text-field
		label="URL"
		v-model="assignmentURL"
		/>
            </v-flex>
	  </v-layout>
	  <v-layout wrap v-if="profile.isStaff">
	    <v-flex xs12>
	      <v-text-field
		label="Sort order"
		type="number"
		v-model.number="assignmentSortOrder"
		/>
            </v-flex>
	  </v-layout>

	  	  <v-layout wrap>
	    <v-flex xs12>
          <v-file-input
            v-model="pdf"
            accept="application/pdf"
            label="Your homework"
            prepend-icon="mdi-file-document"
	    show-size
            />
            </v-flex>
	  </v-layout>
	  	  <v-layout wrap v-if="profile.isStaff">
	    <v-flex xs12>
	      <v-date-picker
	    ref="picker"
	    v-model="assignmentDate"
	    max="2021-07-30"
	    min="2021-06-01"
	    :readonly="!profile.isStaff"
	    ></v-date-picker>
            </v-flex>
	  </v-layout>
	</v-card-text>
	  <v-card-actions>
	    <v-btn
	      v-if="profile.isStaff"
	      text
	      @click="saveAssignment"
	      color="primary"
              :disabled="Object.keys(this.updatedAssignment).length == 0"
	      >
	      Update assignment
</v-btn>
	    <v-btn
	      text
	      :href="assignmentURL"
              color="secondary"
              v-if="assignmentURL"
	      >
	      Download problem set
            </v-btn>
	    <v-btn
	      text
	      @click="submit"
	      color="primary"
              :disabled="!pdf"
	      >
	      Submit your homework
	    </v-btn>
	  </v-card-actions>
  </v-card>
  <v-card class="my-3">
  <v-card-title>Homework log</v-card-title>
  {{ homeworks }}
  </v-card>

</v-col>


  </v-row>
</v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  computed: {
    ...mapState(['assignments', 'profile', 'homeworks']),

    sortedAssignments() {
      const result = Object.values(this.assignments);
      result.sort((a, b) => a.sortOrder - b.sortOrder);
      return result;
    },

    assignment() {
      return this.assignments[this.id];
    },

    assignmentTitle: {
      get() { return this.assignment.title; },
      set(v) { this.$set(this.updatedAssignment, 'title', v); },
    },
    assignmentURL: {
      get() { return this.assignment.url; },
      set(v) { this.$set(this.updatedAssignment, 'url', v); },
    },
    assignmentSortOrder: {
      get() { return this.assignment.sortOrder; },
      set(v) { this.$set(this.updatedAssignment, 'sortOrder', v); },
    },
    assignmentExtraCredit: {
      get() { return this.assignment.extraCredit; },
      set(v) { this.$set(this.updatedAssignment, 'extraCredit', v); },
    },
    assignmentDate: {
      get() {
	const date = new Date(Date.parse(this.assignment.releasedAt));
	return date.toISOString().substring(0, 10);
      },
      set(v) {
	const date = new Date(Date.parse(v));
	const shifted = new Date(date.getTime() + (12 * 60 * 60 * 1000));
	this.$set(this.updatedAssignment, 'releasedAt', shifted);
      },
    },
  },

  data() {
    return {
      id: undefined,
      extraCredit: false,
      dateMenu: null,
      title: '',
      url: '',
      sortOrder: 0,
      pdf: null,
      updatedAssignment: {},
    };
  },

  watch: {
    dateMenu() {
      const { picker } = this.$refs;
      picker.activePicker = 'YEAR';
      setTimeout(() => { picker.activePicker = 'YEAR'; }, 1000);
    },
  },

  methods: {
    ...mapActions([
      'getAssignments',
      'updateAssignment',
      'submitAssignment',
      'submitHomework',
      'getHomeworks',
    ]),

    alreadySubmitted(id) {
      if (this.homeworks) {
 return Object.values(this.homeworks).filter(homework => (homework.user === this.profile.id) && (homework.assignment === id)).length > 0;
}
      return false;
    },

    alreadyGraded(id) {
      if (this.homeworks) {
 return Object.values(this.homeworks).filter(homework => (homework.user === this.profile.id) && (homework.assignment === id) && (homework.isGraded)).length > 0;
}
      return false;
    },

    alreadyComplete(id) {
      if (this.homeworks) {
 return Object.values(this.homeworks).filter(homework => (homework.user === this.profile.id) && (homework.assignment === id) && (homework.isComplete)).length > 0;
}
      return false;
    },

    submit() {
      this.submitHomework({ user: this.profile.id, assignment: this.id, pdf: this.pdf });
      this.pdf = null;
    },

    saveAssignment() {
      this.updateAssignment({ id: this.id, data: this.updatedAssignment });
      this.updatedAssignment = {};
    },

    addAssignment() {
      this.submitAssignment(
	{
	  title: this.title,
	  sortOrder: this.sortOrder,
	  extraCredit: this.extraCredit,
	  url: this.url,
	},
      );
      this.title = '';
      this.url = '';
      this.sortOrder = 0;
      this.extraCredit = false;
    },
  },

  beforeRouteEnter(to, from, next) {
    /* eslint-disable no-param-reassign */
    next((vm) => {
      if (to.params.id) vm.id = to.params.id;
      else vm.id = undefined;
    });
  },

  beforeRouteUpdate(to, from, next) {
    if (to.params.id) this.id = to.params.id;
    else this.id = undefined;
    next();
  },

  mounted() {
    if (this.$route.params.id) {
      this.id = this.$route.params.id;
    } else {
      this.id = undefined;
    }

    this.getHomeworks();
    return this.getAssignments();
  },

};
</script>
