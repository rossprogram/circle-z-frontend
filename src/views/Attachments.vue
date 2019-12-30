<template>
<v-form :key="key">
  <v-container fluid>
    <v-row><v-col><v-card>
	  <v-card-title>Optional attachments</v-card-title>
	  <v-card-subtitle>You may optionally upload a <em>curriculum vitae</em>, a résumé, or any other documents which would help the Admissions Committee understand your accomplishments.  Your Short Essays may also be uploaded here.</v-card-subtitle>
	  <v-list-item two-line v-for="attachment in optionalAttachments"
		       :href="attachment.url"
		       :key="attachment.id">
      <v-list-item-icon>
        <v-icon>mdi-file</v-icon>
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
		<v-file-input v-model="file" label="Attachment"/>
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

    optionalAttachments: {
      get() {
	if (this.attachments) return Object.values(this.attachments).filter(a => !(a.label));
	return [];
      },
    },

  },


  data() {
    return {
      file: null,
      key: 1,
    };
  },
  methods: {
    ...mapActions([
      'getAttachments',
      'removeAttachment',
      'addAttachment',
    ]),

    upload() {
      this.addAttachment({ file: this.file });
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
