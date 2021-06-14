<template>
  <v-container fluid fill-height>
    <v-row><v-col><v-card>
	<v-card-title v-if="path.length == 0">Files</v-card-title>
	<v-card-title v-else>{{ path }}</v-card-title>
	<v-card-subtitle></v-card-subtitle>

	<v-list-item v-if="path.length > 0" two-line :to="`/files/${parentPath}`">
	  <v-list-item-content>
            <v-list-item-title>
	      ..
	    </v-list-item-title>
	  </v-list-item-content>
	</v-list-item>

	<v-list-item two-line v-for="filename in matchedDirectories"
		     :key="filename"
		     :to="`/files/${filename}`">
	  <v-list-item-content>
            <v-list-item-title>
	      {{ filename }}
	    </v-list-item-title>
	  </v-list-item-content>
	</v-list-item>

	<v-list-item two-line v-for="filename in matchedFiles"
		     :key="filename"
		     :to="`/files/${filename}`">
	  <v-list-item-content>
            <v-list-item-title>
	      {{ filename }}
	    </v-list-item-title>
	  </v-list-item-content>
	</v-list-item>
  </v-card></v-col></v-row>
</v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import path from 'path';

export default {
  computed: {
    ...mapState(['files']),

    parentPath() {
      const result = path.resolve(this.path, '..');
      if (result.startsWith('/')) return result.slice(1);
      return result;
    },

    matchedDirectories() {
      if (this.files) {
 return this.files
	.filter(f => f !== this.path)
	.filter(f => f.startsWith(this.path))
	.filter(f => f.endsWith('/'));
}
      return this.files;
    },

    matchedFiles() {
      if (this.files) {
 return this.files
	.filter(f => !f.endsWith('/'))
	.filter(f => f.startsWith(this.path));
}
      return this.files;
    },
  },

  data() {
    return {
      key: 1,
      path: '/',
    };
  },

  methods: {
    ...mapActions([
      'getFiles',
    ]),

    basename(p) {
      return path.basename(p);
    },
  },

  beforeRouteUpdate(to, from, next) {
    this.path = to.params.path;
    next();
  },

  mounted() {
    this.path = this.$route.params.path;
    return this.getFiles();
  },

};
</script>
