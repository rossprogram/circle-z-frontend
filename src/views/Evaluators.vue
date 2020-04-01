<template>
<v-container fluid>
  <v-row><v-col><v-card>
	<v-card-title>Evaluators</v-card-title>
	<v-card-subtitle>{{evaluators.length}} evaluator{{evaluators.length == 1 ? '' : 's'}}</v-card-subtitle>
	<v-list-item two-line v-for="evaluator in evaluators"
		     :href="`/evaluators/${evaluator.id}`"
		     :key="evaluator.id">
	  <v-list-item-content>
            <v-list-item-title>
	      {{ evaluator.email }}
	    </v-list-item-title>
	    <v-list-item-subtitle>Performed ??? evaluations.
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
    ...mapState(['evaluators']),
  },

  data() {
    return {

    };
  },
  methods: {
    ...mapActions([
      'getEvaluators',
    ]),
  },

  mounted() {
    return this.getEvaluators();
  },
};
</script>
