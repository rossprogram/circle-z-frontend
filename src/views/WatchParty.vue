<template>
<v-container fluid fill-height>
  <video-player v-if="id"
    :src="`https://d2vkw31bv9q4du.cloudfront.net/${id}.m3u8`"
    type="application/x-mpegURL" :options="videoOptions"
    ref="video"
		/>
  <v-row v-else>
    <v-progress-circular indeterminate loading></v-progress-circular>
    <h1 class="mx-6">Waiting for convener to choose a video&hellip;</h1>
    </v-row>
</v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex';

import VideoPlayer from '@/components/VideoPlayer.vue';
import 'video.js/dist/video-js.css';

let sseClient;

export default {
  computed: {
    ...mapState(['videos']),

    video() {
      for (const folder of this.videos) {
	for (const v of folder.videos) {
	  if (v.video === this.id) return v;
	}
      }

      return {};
    },
  },

  data() {
    return {
      id: undefined,
      videoOptions: {
        autoplay: true,
        controls: true,
        fill: true,
      },
    };
  },

  methods: {
    ...mapActions([
      'getVideos',
    ]),

    handleMessage(message) {
      if (message.ping) return;
      if (message.video) this.id = message.video;
      if (message.time) {
	this.$refs.video.currentTime(message.time);
	if (message.playing) this.$refs.video.play();
	if (message.pause) this.$refs.video.pause();
      }
    },
  },

  mounted() {
    sseClient = this.$sse.create({
      url: `${process.env.VUE_APP_API_URL }/watch-party`,
      format: 'json',
      withCredentials: true,
      polyfill: true,
    });

    // Handle messages without a specific event
    sseClient.on('message', this.handleMessage);

    sseClient.connect()
      .then(() => {
      });

    return this.getVideos();
  },

  components: {
    VideoPlayer,
  },

};
</script>
