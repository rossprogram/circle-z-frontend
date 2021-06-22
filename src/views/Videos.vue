<template>
<v-container fluid fill-height>
  <v-row><v-col cols="12">
      <v-text-field
        label="Search"
	v-model="search"
        prepend-inner-icon="mdi-magnify"
	clearable
        ></v-text-field>
  </v-col></v-row>

  <v-row class="my-12" v-for="(folder,i) in videos" :key="i">
    <v-col sm="12">
    <v-card>
      <v-card-title>{{ folder.folder }}</v-card-title>
      <v-card-text>
      <v-row>
	<v-col cols="12" sm="6" md="3" v-for="(video,j) in folder.videos.filter( (x) => JSON.stringify(x).toLowerCase().match(search ? search.toLowerCase() : '') )" :key="j">
	  <v-card :to="`/videos/${video.video}`">
	    <v-img
	      height="250"
	      aspect-ratio="1"
	  :src="`https://d4zgr4aptyy2e.cloudfront.net/${video.video}.0000001.jpg`"
	  ></v-img>
	    <v-card-title>{{ video.title }}</v-card-title>
	    <v-card-subtitle v-if="video.date">{{ video.date | moment('MMMM Do YYYY') }}, {{video.date | moment("from", "now") }}</v-card-subtitle>
	<v-card-text>
	  <person v-for="email in video.authors" :key="email" :userId="emails[email]"/>
	</v-card-text>
      </v-card>
    </v-col>
      </v-row>
      </v-card-text>
    </v-card>
    </v-col>
  </v-row>
</v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  computed: {
    ...mapState(['videos', 'emails']),
  },

  data() {
    return {
      id: undefined,
      search: '',
      key: 1,
    };
  },

  methods: {
    ...mapActions([
      'getVideos',
    ]),

  },

  mounted() {
    return this.getVideos();
  },

};
</script>
