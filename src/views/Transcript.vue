<template>
<v-form :key="key">
  <v-container fluid>
    <v-row><v-col><v-card>
	  <v-card-title>Transcript</v-card-title>
	  <v-card-subtitle>Upload your high school transcript(s).  These should be copies of official school documents, stating all courses taken during your high school career, and grades earned in those courses. (We do not need certified copies sent directly from the school.) You may include college transcripts as well, if you have taken some college courses.</v-card-subtitle>

	  <v-list-item two-line v-for="attachment in transcriptAttachments"
		       :href="attachment.url"
		       :key="attachment.id">
	    <v-list-item-icon>
              <v-icon>mdi-school</v-icon>
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

	  <v-list-item two-line>
	    <v-list-item-content>
              <v-list-item-title>
		<v-file-input v-model="file" hint="Please submit PDF files; we may not be able to read other formats." persistent-hint label="Transcript"/>
	      </v-list-item-title>
	      <v-list-item-subtitle></v-list-item-subtitle>
	    </v-list-item-content>
	    <v-list-item-action @click="upload">
	      <v-btn :disabled="!file" color="primary">
		Upload
		<v-icon right>mdi-upload</v-icon>
	      </v-btn>
	    </v-list-item-action>
	  </v-list-item>


    </v-card></v-col></v-row>
  </v-container>
</v-form>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  computed: {
    ...mapState(['attachments']),

    transcriptAttachments: {
      get() {
	if (this.attachments) {
	  return Object.values(this.attachments)
	    .filter(a => a.label === 'transcript');
	}
	return [];
      },

    },

  },

  data() {
    return {
      key: 1,
      file: null,
    };
  },

  methods: {
    ...mapActions([
      'getAttachments',
      'removeAttachment',
      'addAttachment',
    ]),

    upload() {
      this.addAttachment({ file: this.file, label: 'transcript' });
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
