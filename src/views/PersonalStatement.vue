<template>
<v-form :key="key">
  <v-container fluid>
    <v-row><v-col><v-card>
	  <v-card-title>Personal Statement</v-card-title>
	  <v-card-subtitle>This essay serves as your introduction to the Admissions Committee, and provides an opportunity for you to discuss your interest in mathematics and your goals for your participation in the Ross Program.  For your Personal Statement, please write an essay discussing the following questions and related topics.</v-card-subtitle>
	  <v-card-text class="py-0">
	    <ul>
	      <li>What aspect of mathematics draws your interest and attention?
		Are you interested in math for its own sake? For the thrill of solving puzzling problems?  Or because math has important applications to other fields?</li>
	      <li>Do you have some strong academic interests in addition to math?  For instance, are you intensively studying physics? Or economics?  Are you serious about Chinese literature, paleontology, or modern dance?</li>
	      <li>What do you hope to gain by attending this challenging summer program?</li>
	      <li>How do you like to spend your time?</li>
	      <li>What are your hobbies or interests outside of school?</li>
	    </ul>
	    <v-textarea
	      class="my-4"
	      outlined
	      rows="12"
	      label="Your personal statement"
	      v-model="personalStatement"
	      ></v-textarea>
	  </v-card-text>
    </v-card></v-col></v-row>
  </v-container>

  <v-flex
    xs12
    text-xs-right
    >

    <v-btn
      @click="saveApplication"
      color="primary"
      class="mr-4"
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

    personalStatement: {
      get() { return this.application.personalStatement; },
      set(v) { this.$set(this.updatedApplication, 'personalStatement', v); },
    },

  },

  data() {
return {
  updatedApplication: {},
  saved: false,
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
