<template>
<v-form :key="key">
  <v-container fluid>
    <v-row><v-col><v-card>
	  <v-card-title>Solutions</v-card-title>
	  <v-card-subtitle>Upload your carefully written solutions to the <a href="https://rossprogram.org/students/application-problems.pdf">Application Problems</a> which you can find at <a href="https://rossprogram.org/students/application-problems.pdf">https://rossprogram.org/students/application-problems.pdf</a>. Solutions to each problem must be uploaded as a separate PDF.  The Admissions Committee is not looking for quick answers written in minimal space,  but rather for readable mathematical expositions that includes evidence of your explorations, conjectures, and proofs.</v-card-subtitle>

	  <v-list-item two-line v-for="attachment in solutionAttachments"
		       :href="attachment.url"
		       :key="attachment.id">
	    <v-list-item-icon>
              <v-icon>mdi-numeric-{{attachment.label.replace('solution','')}}-circle-outline</v-icon>
	    </v-list-item-icon>
	    <v-list-item-content>
              <v-list-item-title>{{ attachment.name }}</v-list-item-title>
	      <v-list-item-subtitle v-if="attachment.createdAt">Uploaded {{ attachment.createdAt | moment("from", "now") }}</v-list-item-subtitle>
	    </v-list-item-content>
	    <v-list-item-action @click.prevent="remove(attachment.id)">
	      <v-btn icon>
		<v-icon color="grey lighten-1">mdi-delete</v-icon>
	      </v-btn>
	    </v-list-item-action>
	  </v-list-item>

	  <v-card-text>
	    <v-layout wrap>
	      <v-flex xs3>
		<v-select
		  prepend-icon="mdi-help-circle-outline"
		  v-model="problem"
		  :items="problemNames"
		  label="Problem"
		  ></v-select>
	      </v-flex>
	      <v-flex xs9>
		<v-file-input v-model="file" label="Attachment"/>
	      </v-flex>
	      <v-flex xs3>
		<v-btn @click="upload" :disabled="!(file && problem)" color="primary">
		  Upload
		  <v-icon right>mdi-upload</v-icon>
		</v-btn>
	      </v-flex>
	    </v-layout>
	  </v-card-text>
    </v-card></v-col></v-row>
  </v-container>
</v-form>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  computed: {
    ...mapState(['attachments']),

    solutionAttachments: {
      get() {
	if (this.attachments) {
 return Object.values(this.attachments)
	  .filter(a => a.label && a.label.match(/^solution[0-9]+$/))
	  .sort((a, b) => ((a.label < b.label) ? -1 : 1));
}
	return [];
      },

    },

    problemNames: {
      get() {
	return [...Array(this.problemCount + 1).keys()].slice(1);
      },
    },

  },

  data() {
    return {
      problem: null,
      problemCount: 4,
      key: 1,
      file: null,
    };
  },
  watch: {
    birthdayMenu() {
      const { picker } = this.$refs;
      // if (val)
      picker.activePicker = 'YEAR';
      setTimeout(() => { picker.activePicker = 'YEAR'; }, 1000);
    },
  },
  methods: {
    ...mapActions([
      'getAttachments',
      'removeAttachment',
      'addAttachment',
    ]),

    upload() {
      this.addAttachment({ file: this.file, label: `solution${this.problem}` });
    },
    remove(id) {
      this.removeAttachment(id);
    },

  },

  mounted() {
    return this.getAttachments();
  },
};
</script>
