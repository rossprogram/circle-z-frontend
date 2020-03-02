<template>
<v-container fluid>
  <v-card  style="position: sticky; top: 1in; width: 2in; float: left;">
    <v-card-title>Evaluation</v-card-title>

    <span v-if="profile.isSuperuser">
      <v-icon v-if="application.gender === 'Male'">mdi-gender-male</v-icon>
      <v-icon v-else-if="application.gender === 'Female'">mdi-gender-female</v-icon>
      <v-icon v-else>mdi-gender-transgender</v-icon>
    <vue-country-flag v-for="country in application.citizenship" :key="country" :country="country" size='small'/>
    <span v-if="age">{{ age }} years old</span>
    </span>

    <v-card-text class="py-0">
      <vue-stars name="demo" v-model="overallScore"/>
      <v-textarea
	outline
	label="Your comments"
	rows="2"
	v-model="comments"
	>
      </v-textarea>
       <v-select
        v-model="decision"
        :items="['','accept','reject','waitlist']"
        label="Recommended action"
      ></v-select>

    </v-card-text>
    <v-card-actions>
      <v-btn
	text
	@click="saveEvaluation"
	color="primary"
        :disabled="Object.keys(this.updatedEvaluation).length == 0"
	>
	Save
      </v-btn>
      <v-btn
	text
	@click="removeEvaluation"
	color="danger"
	:disabled="! this.myEvaluation.id"
	>
	Delete
      </v-btn>
    </v-card-actions></v-card>

  <v-container fluid style="padding-left: 2.2in;">
  <v-row><v-col><v-card>
	<v-card-title>Demographic Information</v-card-title>
	<v-card-text>
	  <p>
	    <strong>email:</strong> <a :href="`mailto:${application.user.email}`">{{ application.user.email }}</a><br/>
	    <strong>name:</strong> {{ application.firstName }} {{ application.lastName }}<br/>
	    <strong>nickname:</strong> {{ application.nickname }}<br/>
	    <strong>citizenship:</strong> {{ application.citizenship.join(', ') }}<br/>
	    <strong>gender:</strong> {{ application.gender }}<br/>
	    <strong>birthday:</strong> {{ application.birthday }}<br/>
	    <strong>graduation year:</strong> {{ application.graduationYear }}<br/>
	  </p>


	</v-card-text>

  </v-card></v-col></v-row>

  <v-row><v-col><v-card>
	<v-card-title>Which Programs?</v-card-title>
	<v-card-text>
	  <p>
	    <strong>apply USA:</strong> {{ application.applyingToUSA }}<br/>
	    <strong>arrive USA:</strong> {{ application.arriveAtStartUSA }}<br/>
	    <strong>apply Asia:</strong> {{ application.applyingToAsia }}<br/>
	    <strong>arrive Asia:</strong> {{ application.arriveAtStartAsia }}<br/>
	    <strong>preferredLocation:</strong> {{ application.preferredLocation}}<br/>
	    <strong>previousApplicationYears:</strong> {{ application.previousApplicationYears}}<br/>
	    <strong>juniorCounselor:</strong> {{ application.juniorCounselor}}<br/>
	    <strong>previousParticipationYears:</strong> {{ application.previousParticipationYears}}<br/>
	  </p>
	</v-card-text>
  </v-card></v-col></v-row>

  <v-row v-if="this.profile.isSuperuser"><v-col><v-card>
	<v-card-title>Contact Information</v-card-title>
	<v-card-text>
	  <p>
	    <strong>phone:</strong> {{ application.phone }}<br/>
	    <strong>address:</strong> {{ application.address }}<br/>
	    <strong>school name:</strong> {{ application.schoolName }}<br/>
	    <strong>school address:</strong> {{ application.schoolAddress }}<br/>
	  </p>
	</v-card-text>
  </v-card></v-col></v-row>

  <v-row v-if="this.profile.isSuperuser"><v-col><v-card>
	<v-card-title>English</v-card-title>
	<v-card-text>
	  <p>
	    <strong>native English:</strong> {{ application.nativeEnglish }}<br/>
	    <strong>toeflNarrative:</strong> {{ application.toeflNarrative }}<br/>
	  </p>
	</v-card-text>
  </v-card></v-col></v-row>

  <v-row v-if="this.profile.isSuperuser"><v-col><v-card>
	<v-card-title>Parent Information</v-card-title>
	<v-card-text>
	  <p>
	    <strong>name:</strong> {{ application.parentName }}<br/>
	    <strong>email:</strong> {{ application.parentEmail }}<br/>
	    <strong>phone:</strong> {{ application.parentPhone }}<br/>
	    <strong>address:</strong> {{ application.parentAddress }}<br/>
	  </p>
	</v-card-text>
  </v-card></v-col></v-row>

  <v-row v-if="! application.juniorCounselor"><v-col><v-card>
	<v-card-title>Personal Statement</v-card-title>
	<v-card-text>
	 <vue-markdown :source="application.personalStatement"></vue-markdown>
	</v-card-text>
  </v-card></v-col></v-row>

  <v-row v-if="application.juniorCounselor"><v-col><v-card>
	<v-card-title>Previous experience</v-card-title>
	<v-card-text>
	 <vue-markdown :source="application.previousExperience"></vue-markdown>
	</v-card-text>
  </v-card></v-col></v-row>

  <v-row v-if="application.juniorCounselor"><v-col><v-card>
	<v-card-title>Most interesting parts of Ross</v-card-title>
	<v-card-text>
	 <vue-markdown :source="application.mostInterestingRoss"></vue-markdown>
	</v-card-text>
  </v-card></v-col></v-row>

  <v-row><v-col><v-card>
	<v-card-title>Have you participated in academic programs outside of school?</v-card-title>
	<v-card-text>
	  <vue-markdown :source="application.otherPrograms"></vue-markdown>
	</v-card-text>
  </v-card></v-col></v-row>

  <v-row v-if="application.juniorCounselor"><v-col><v-card>
	<v-card-title>Mathematical interests</v-card-title>
	<v-card-text>
	 <vue-markdown :source="application.mostInterestingMath"></vue-markdown>
	</v-card-text>
  </v-card></v-col></v-row>

  <v-row><v-col><v-card>
	<v-card-title>What is an interesting mathematical problem you have worked on?</v-card-title>
	<v-card-text>
	  <vue-markdown :source="application.interestingProblem"></vue-markdown>
	</v-card-text>
  </v-card></v-col></v-row>

  <v-row><v-col><v-card>
	<v-card-title>What do you plan to major in at college?</v-card-title>
	<v-card-text>
	  <vue-markdown :source="application.intendedMajor"></vue-markdown>
	</v-card-text>
  </v-card></v-col></v-row>


  <v-row v-if="!application.juniorCounselor"><v-col><v-card>
	<v-card-title>Have you worked on some interesting mathematical projects?</v-card-title>
	<v-card-text>
	  <vue-markdown :source="application.interestingProjects"></vue-markdown>
	</v-card-text>
  </v-card></v-col></v-row>

  <v-row v-if="!application.juniorCounselor"><v-col><v-card>
	<v-card-title>Have you recently participated in some math competitions?</v-card-title>
	<v-card-text>
	  <vue-markdown :source="application.competitions"></vue-markdown>
	</v-card-text>
  </v-card></v-col></v-row>

  <v-row v-if="!application.juniorCounselor"><v-col><v-card>
	<v-card-title>What have you read recently about mathematics?</v-card-title>
	<v-card-text>
	  <vue-markdown :source="application.books"></vue-markdown>
	</v-card-text>
  </v-card></v-col></v-row>

  <v-row v-if="!application.juniorCounselor"><v-col><v-card>
	<v-card-title>When you work on hard math problems do you usually work alone? Or with a group of friends?</v-card-title>
	<v-card-text>
	  <vue-markdown :source="application.collaboration"></vue-markdown>
	</v-card-text>
  </v-card></v-col></v-row>

  <v-row v-if="!application.juniorCounselor"><v-col><v-card>
	<v-card-title>Have you taken math courses outside of the standard high school curriculum?</v-card-title>
	<v-card-text>
	  <vue-markdown :source="application.otherCourses"></vue-markdown>
	</v-card-text>
  </v-card></v-col></v-row>

  <v-row v-if="!application.juniorCounselor"><v-col><v-card>
	<v-card-title>Are you eager to spend five or six weeks away from home, with no distractions from computers or video games or smart phones, focusing all of your energies on one narrow area of mathematics?</v-card-title>
	<v-card-text>
	  {{ application.eager }}
	</v-card-text>
    </v-card></v-col></v-row>

    <v-row><v-col><v-card>
	  <v-card-title>Attachments</v-card-title>
	  <v-list-item two-line v-for="attachment in applicationAttachments"
		       :href="attachment.url"
		       :key="attachment.id">
      <v-list-item-icon>
        <v-icon>mdi-file</v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title>{{ attachment.name }}</v-list-item-title>
	<v-list-item-subtitle v-if="attachment.createdAt">Uploaded {{ attachment.createdAt | moment("from", "now") }}</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    </v-card></v-col></v-row>

    <v-row><v-col><v-card>
	  <v-card-title>Problems</v-card-title>
	  <v-list-item  v-for="problem in problems"
			:key="problem.id">
	    <v-list-item-action>
	      <v-select style="width: 3em;"
			:value="getMyScore(problem.number)"
			@input="v => setMyScore(problem.number, v)"
			:items="['','A','B','C']"
			></v-select>
            </v-list-item-action>
	    <v-list-item-content>
	       <v-list-item-title>Problem {{problem.number}}</v-list-item-title>
	      <v-list-item-subtitle v-if="problem.createdAt">File <a :href="problem.url">{{problem.name}}</a> uploaded {{ problem.createdAt | moment("from", "now") }}</v-list-item-subtitle>
	    </v-list-item-content>
	  </v-list-item>

    </v-card></v-col></v-row>

    <v-row v-if="this.profile.isSuperuser"><v-col><v-card>
	  <v-card-title>Recommendations</v-card-title>
	  <v-list-item two-line v-for="recommendation in applicationRecommendations"
		       :href="recommendation.url"
		       :key="recommendation.id">
	    <v-list-item-icon>
              <v-icon>mdi-mail</v-icon>
	    </v-list-item-icon>
	    <v-list-item-content>
	    <v-list-item-title>{{ recommendation.email }}</v-list-item-title>
	    <v-list-item-subtitle v-if="recommendation.createdAt">Uploaded {{ recommendation.createdAt | moment("from", "now") }}</v-list-item-subtitle>
	    </v-list-item-content>
	  </v-list-item>
    </v-card></v-col></v-row>

    <v-row><v-col><v-card>
	  <v-card-title>Evaluations</v-card-title>
	  	  <v-list-item three-line v-for="evaluation in applicationEvaluations"
		       :key="evaluation.id">
      <v-list-item-icon>
        <v-icon v-if="evaluation.decision === 'accept'" style="color: green;">mdi-account-check</v-icon>
	<v-icon v-else-if="evaluation.decision === 'reject'" style="color: red;">mdi-account-cancel</v-icon>
	<v-icon v-else-if="evaluation.decision === 'waitlist'" style="color: orange;">mdi-account-clock</v-icon>
	<v-icon v-else style="color: gray;">mdi-account-question</v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title>{{ evaluation.evaluator.email }} <vue-stars style="float: right;" v-if="evaluation.overallScore" readonly :value="evaluation.overallScore"></vue-stars><span style="float: right; margin-right: 1em;">{{ evaluation.problemScores.map( (score) => (score === 'A' || score === 'B' || score === 'C') ? score : '?' ).join(' ') }}</span> </v-list-item-title>
	<v-list-item-subtitle>{{ evaluation.comments }} <span style="float: right;">{{ evaluation.updatedAt | moment("from", "now") }}</span></v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    </v-card></v-col></v-row>
</v-container>
</v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex';

// Across top: name, male/female, citizenship, age, JC-previous-applications

export default {
  computed: {
    ...mapState(['applications', 'attachments', 'evaluations', 'profile', 'recommendations']),

    application: {
      get() {
	return this.applications[this.$route.params.id];
      },
    },
    age: {
      get() {
	const born = this.application.birthday;
	if (born) {
	  const ageDifMs = Date.now() - (new Date(born));
	  const ageDate = new Date(ageDifMs);
	  return Math.abs(ageDate.getUTCFullYear() - 1970);
	} return undefined;
	},
      },
    applicationAttachments: {
      get() {
	return this.attachments[this.$route.params.id];
      },
     },
    applicationRecommendations: {
      get() {
	return this.recommendations[this.$route.params.id];
      },
     },
    problems: {
      get() {
	if (this.applicationAttachments) {
	  const matches = this.applicationAttachments.filter(attachment => attachment.label && attachment.label.startsWith('solution'));
	  for (const problem of matches) {
	    problem.number = parseInt(problem.label.replace('solution', ''), 10);
	  }
	  return matches.sort((a, b) => (a.number - b.number));
	}
	  return [];
      },
     },
    myEvaluation: {
      get() {
	if (this.evaluations[this.$route.params.id]) {
	  const matches = this.evaluations[this.$route.params.id].filter(evaluation => evaluation.evaluator.id === this.profile.id);
	  if (matches.length > 0) {
	    return matches[0];
	  }
	}

	return {
	  overallScore: 0, decision: '', comments: '', problemScores: [],
	};
      },
    },
    applicationEvaluations: {
      get() {
	return this.evaluations[this.$route.params.id];
      },
    },
    comments: {
      get() { return this.myEvaluation.comments; },
      set(v) { this.$set(this.updatedEvaluation, 'comments', v); },
    },
    decision: {
      get() { return this.myEvaluation.decision; },
      set(v) { this.$set(this.updatedEvaluation, 'decision', v); },
    },
    overallScore: {
      get() { return this.myEvaluation.overallScore; },
      set(v) { this.$set(this.updatedEvaluation, 'overallScore', v); },
    },

  },

  data() {
    return {
      saved: false,
      updatedEvaluation: {},
      key: 1,
    };
  },
  methods: {
    ...mapActions([
      'getApplication',
      'getAttachments',
      'getRecommendations',
      'getEvaluations',
      'updateEvaluation',
      'deleteEvaluation',
    ]),

    saveEvaluation() {
      this.saved = true;
      return this.updateEvaluation({ id: this.application.user.id, data: this.updatedEvaluation });
    },

    removeEvaluation() {
      if (this.myEvaluation.id) this.deleteEvaluation(this.myEvaluation.id);
    },

    getMyScore(n) {
      if (this.updatedEvaluation && this.updatedEvaluation.problemScores) return this.updatedEvaluation.problemScores[n - 1];

      const score = this.myEvaluation.problemScores[n - 1];
      if (score) return score;
      return '';
    },

    setMyScore(n, score) {
      if (this.updatedEvaluation.problemScores) {
	this.$set(this.updatedEvaluation.problemScores, n - 1, score);
      } else {
	this.$set(this.updatedEvaluation, 'problemScores', this.myEvaluation.problemScores);
	this.$set(this.updatedEvaluation.problemScores, n - 1, score);
      }
    },
  },

  beforeRouteLeave(to, from, next) {
    if (Object.keys(this.updatedEvaluation).length > 0 && !this.saved) {
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
    this.getAttachments(this.$route.params.id);
    this.getRecommendations(this.$route.params.id);
    this.getEvaluations(this.$route.params.id);
    return this.getApplication(this.$route.params.id);
  },
};
</script>
