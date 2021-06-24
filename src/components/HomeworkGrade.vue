<template>
  <div>

    <v-list>
  <v-list-item two-line>
  <v-list-item-avatar>
    <person :userId="homework.user"/>
  </v-list-item-avatar>
  <v-list-item-content>

    <v-list-item-title>
      {{ assignment.title }} {{ homework.isRedo }}
    </v-list-item-title>
    <v-list-item-subtitle v-if="!homework.isGraded">
        {{ homework.createdAt | moment("from", "now") }}, {{ homework.createdAt | moment('MMMM Do YYYY, h:mma') }}
    </v-list-item-subtitle>
  </v-list-item-content>

  <v-list-item-action>
          <v-tooltip top>
    <template v-slot:activator="{ on, attrs }">
  <v-btn
    v-bind="attrs"
          v-on="on"
    icon :to='`/assignments/${assignment.id}`'><v-icon>mdi-file-find</v-icon></v-btn>
  </template>
    <span>View Assignment</span>
      </v-tooltip>
  </v-list-item-action>
  <v-list-item-action>
	  <v-tooltip top>
    <template v-slot:activator="{ on, attrs }">
  <v-btn
    v-bind="attrs"
          v-on="on"
    icon :href="pdfLink"><v-icon>mdi-download</v-icon></v-btn>
  </template>
    <span>Download</span>
      </v-tooltip>
  </v-list-item-action>
  </v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list v-if="homework.isGraded">
      <v-list-item two-line>
      <v-list-item-icon>
        <v-icon class="green--text" v-if="homework.isComplete">mdi-file-check</v-icon>
        <v-icon class="red--text" v-else-if="homework.isRedo">mdi-file-sync</v-icon>
        <v-icon v-else>mdi-file-question</v-icon>
	</v-list-item-icon>

  <v-list-item-content>
    <v-list-item-title>
      <span v-if="homework.isRedo">Redo requested</span>
      <span v-else-if="homework.isComplete">Marked complete</span>
      <span v-else>Missing grade</span>
    </v-list-item-title>
    <v-list-item-subtitle>
        {{ homework.createdAt | moment("from", "now") }}, {{ homework.createdAt | moment('MMMM Do YYYY, h:mma') }}
    </v-list-item-subtitle>
  </v-list-item-content>
  <v-list-item-avatar>
    <person :userId="homework.creator"/>
  </v-list-item-avatar>
  </v-list-item>
    </v-list>


    <v-card-text v-if="!homework.isGraded">
	    <v-layout flex>
	    <v-radio-group
	      v-model="grade"
	      row
	      >
	      <v-radio
		label="Redo"
		value="redo"
		></v-radio>
	      <v-radio
		label="Complete"
		value="complete"
		></v-radio>
	    </v-radio-group>
            <v-file-input
	      class="flex-grow-1"
            v-model="pdf"
            accept="application/pdf"
            label="Annotated file"
            prepend-icon="mdi-file-document"
	    show-size
	    />
	    </v-layout>
	</v-card-text>
	  <v-card-actions v-if="!homework.isGraded">
	    <v-btn
	      text
	      @click="submit"
	      color="primary"
              :disabled="!(grade && pdf)"
	      >
	      Submit grade
	    </v-btn>
	    </v-card-actions>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  computed: {
    ...mapState(['homeworks', 'assignments']),

    assignment() {
      return this.assignments[this.homework.assignment];
    },

    homework() {
      return this.homeworks[this.id];
    },

    pdfLink() {
      return `${process.env.VUE_APP_API_URL }/homeworks/${ this.homeworks[this.id].id }/pdf`;
    },
  },

  data() {
    return {
      grade: '',
      pdf: null,
    };
  },

  methods: {
    ...mapActions([
      'submitHomework',
    ]),

    submit() {
      this.submitHomework({
 user: this.homework.user,
			    assignment: this.homework.assignment,
			    pdf: this.pdf,
			    isRedo: this.grade === 'redo',
			    isComplete: this.grade === 'complete',
			  });
      this.pdf = null;
    },
  },

  name: 'HomeworkGrade',
  props: {
    id: String,
  },

};
</script>
