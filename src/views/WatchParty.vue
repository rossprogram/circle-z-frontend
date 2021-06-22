<template>
<v-container fluid fill-height>
  <video-player
    :src="`https://d2vkw31bv9q4du.cloudfront.net/${id}.m3u8`"
    type="application/x-mpegURL" :options="videoOptions"
    ref="video"
    />
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
      if (message.video) this.id = message.video;
      if (message.time) {
	this.$refs.video.currentTime(message.time);
	if (message.playing) this.$refs.video.play();
	if (message.pause) this.$refs.video.pause();
      }
      // console.warn('Received:', message);
    },
  },

  mounted() {
    sseClient = this.$sse.create({
      url: `${process.env.VUE_APP_API_URL }/watch-party`,
      format: 'json',
      withCredentials: true,
      polyfill: true,
    });

    // Catch any errors (ie. lost connections, etc.)
    // sseClient.on('error', (e) => {
      // console.error('lost connection or failed to parse!', e);
  // });

    // Handle messages without a specific event
    sseClient.on('message', this.handleMessage);

    sseClient.connect()
      .then(() => {
        // console.log('We\'re connected!');
      });
      // .catch((err) => {
        // When this error is caught, it means the initial connection to the
        // events server failed.  No automatic attempts to reconnect will be made.
        // console.error('Failed to connect to server', err);
    // });

    return this.getVideos();
  },

  components: {
    VideoPlayer,
  },

};
</script>
