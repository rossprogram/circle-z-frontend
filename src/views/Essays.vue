<template>
<v-form :key="key">
  <v-container fluid>
    <v-row><v-col><v-card>
    <v-card-title>An interesting mathematical problem</v-card-title>
    <v-card-subtitle>What is an interesting mathematical problem you have worked on?</v-card-subtitle>
    <v-card-text class="py-0">
      <v-textarea
	outlined
	label="Your response"
	v-model="interestingProblem"
	>
      </v-textarea>
    </v-card-text>
    <v-card-actions>
      <v-btn
	text
	@click="saveApplication"
	color="primary"
        :disabled="Object.keys(this.updatedApplication).length == 0"
	>
	Save
      </v-btn>
    </v-card-actions>
  </v-card></v-col></v-row>

  <v-row><v-col><v-card>
    <v-card-title>An interesting project</v-card-title>
    <v-card-subtitle>Have you worked on an interesting mathematical project?  If so, how was your experience?</v-card-subtitle>
    <v-card-text class="py-0">
      <v-textarea
	outlined
	label="Your response"
	v-model="interestingProjects"
	>
      </v-textarea>
    </v-card-text>
    <v-card-actions>
      <v-btn
	text
	@click="saveApplication"
	color="primary"
        :disabled="Object.keys(this.updatedApplication).length == 0"
	>
	Save
      </v-btn>
    </v-card-actions>
  </v-card></v-col></v-row>

  <v-row><v-col><v-card>
    <v-card-title>Competitions</v-card-title>
    <v-card-subtitle>Have you participated in mathematical contests or competitions?  How were your experiences?</v-card-subtitle>
    <v-card-text class="py-0">
      <v-textarea
	outlined
	label="Your response"
	v-model="competitions"
	>
      </v-textarea>
    </v-card-text>
    <v-card-actions>
      <v-btn
	text
	@click="saveApplication"
	color="primary"
        :disabled="Object.keys(this.updatedApplication).length == 0"
	>
	Save
      </v-btn>
    </v-card-actions>
  </v-card></v-col></v-row>

  <v-row><v-col><v-card>
    <v-card-title>Other programs</v-card-title>
    <v-card-subtitle>Have you participated in other mathematics programs, such as a summer mathcamp or a "math circle" meeting after school?  If so, what programs have you participated in?</v-card-subtitle>
    <v-card-text class="py-0">
      <v-textarea
	outlined
	label="Your response"
	v-model="otherPrograms"
	>
      </v-textarea>
    </v-card-text>
    <v-card-actions>
      <v-btn
	text
	@click="saveApplication"
	color="primary"
        :disabled="Object.keys(this.updatedApplication).length == 0"
	>
	Save
      </v-btn>
    </v-card-actions>
  </v-card></v-col></v-row>

  <v-row><v-col><v-card>
    <v-card-title>Books and websites</v-card-title>
    <v-card-subtitle>What are some of your favorite mathematical books?  Your favorite mathematics websites?</v-card-subtitle>
    <v-card-text class="py-0">
      <v-textarea
	outlined
	label="Your response"
	v-model="books"
	>
      </v-textarea>
    </v-card-text>
    <v-card-actions>
      <v-btn
	text
	@click="saveApplication"
	color="primary"
        :disabled="Object.keys(this.updatedApplication).length == 0"
	>
	Save
      </v-btn>
    </v-card-actions>
  </v-card></v-col></v-row>

  <v-row><v-col><v-card>
    <v-card-title>Intended major and career</v-card-title>
    <v-card-subtitle>When you attend college, what do you intend to major in?  What are your career goals?</v-card-subtitle>
    <v-card-text class="py-0">
      <v-textarea
	outlined
	label="Your response"
	v-model="intendedMajor"
	>
      </v-textarea>
    </v-card-text>
    <v-card-actions>
      <v-btn
	text
	@click="saveApplication"
	color="primary"
        :disabled="Object.keys(this.updatedApplication).length == 0"
	>
	Save
      </v-btn>
    </v-card-actions>
  </v-card></v-col></v-row>

  <v-row><v-col><v-card>
    <v-card-title>Collaboration</v-card-title>
    <v-card-subtitle>Do you normally work on mathematics alone?  Do you have experience working in groups?</v-card-subtitle>
    <v-card-text class="py-0">
      <v-textarea
	outlined
	label="Your response"
	v-model="collaboration"
	>
      </v-textarea>
    </v-card-text>
    <v-card-actions>
      <v-btn
	text
	@click="saveApplication"
	color="primary"
        :disabled="Object.keys(this.updatedApplication).length == 0"
	>
	Save
      </v-btn>
    </v-card-actions>
  </v-card></v-col></v-row>

  <v-row><v-col><v-card>
    <v-card-title>Other courses</v-card-title>
    <v-card-subtitle>What previous coursework have you pursued in mathematics?  Have you taken courses (either online or face-to-face) outside of your high school?</v-card-subtitle>
    <v-card-text class="py-0">
      <v-textarea
	outlined
	label="Your response"
	v-model="otherCourses"
	>
      </v-textarea>
    </v-card-text>
    <v-card-actions>
      <v-btn
	text
	@click="saveApplication"
	color="primary"
        :disabled="Object.keys(this.updatedApplication).length == 0"
	>
	Save
      </v-btn>
    </v-card-actions>
  </v-card></v-col></v-row>

  <v-row><v-col><v-card>
    <v-card-title>Being away from home</v-card-title>
    <v-card-subtitle>Are you eager to spend many weeks away from home, away from television and movies and computers and video games, away from family, spending all available time on mathematical explorations?</v-card-subtitle>
    <v-card-text class="py-0">
      <v-textarea
	outlined
	label="Your response"
	v-model="eager"
	>
      </v-textarea>
    </v-card-text>
    <v-card-actions>
      <v-btn
	text
	@click="saveApplication"
	color="primary"
        :disabled="Object.keys(this.updatedApplication).length == 0"
	>
	Save
      </v-btn>
    </v-card-actions>
  </v-card></v-col></v-row>
   </v-container>

  <v-flex
    xs12
    text-xs-right
    >

    <v-btn
	   @click="saveApplication"
	   color="primary"
	   class="mr-4 my-4"
           :disabled="Object.keys(this.updatedApplication).length == 0"
	   >
      Save Application
    </v-btn>
  </v-flex>
</v-form>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  computed: {
...mapState(['application']),

  interestingProblem: {
      get() { return this.application.interestingProblem; },
      set(v) { this.$set(this.updatedApplication, 'interestingProblem', v); },
    },
  interestingProjects: {
      get() { return this.application.interestingProjects; },
      set(v) { this.$set(this.updatedApplication, 'interestingProjects', v); },
    },
  competitions: {
      get() { return this.application.competitions; },
      set(v) { this.$set(this.updatedApplication, 'competitions', v); },
    },
  otherPrograms: {
      get() { return this.application.otherPrograms; },
      set(v) { this.$set(this.updatedApplication, 'otherPrograms', v); },
    },
  books: {
      get() { return this.application.books; },
      set(v) { this.$set(this.updatedApplication, 'books', v); },
    },
  eager: {
      get() { return this.application.eager; },
      set(v) { this.$set(this.updatedApplication, 'eager', v); },
    },
  intendedMajor: {
      get() { return this.application.intendedMajor; },
      set(v) { this.$set(this.updatedApplication, 'intendedMajor', v); },
    },
  collaboration: {
      get() { return this.application.collaboration; },
      set(v) { this.$set(this.updatedApplication, 'collaboration', v); },
    },
  otherCourses: {
      get() { return this.application.otherCourses; },
      set(v) { this.$set(this.updatedApplication, 'otherCourses', v); },
    },

  },

  data() {
    return {
      saved: false,
      updatedApplication: {},
      key: 1,
    };
  },
  methods: {
    ...mapActions([
      'getApplication',
      'updateApplication',
    ]),

    saveApplication() {
      this.saved = true;
      return this.updateApplication(this.updatedApplication);
    },
  },

  beforeRouteLeave(to, from, next) {
    if (Object.keys(this.updatedApplication).length > 0 && !this.saved) {
      const answer = window.confirm('Do you really want to leave? You have unsaved changes.');
      if (answer) {
	next();
      } else {
	next(false);
      }
    } else {
      next();
    }
  },

  mounted() {
    return this.getApplication();
  },
};
</script>
