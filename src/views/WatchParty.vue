<template>
<v-container fluid fill-height>
  <video-player :src="`https://d2vkw31bv9q4du.cloudfront.net/${id}.m3u8`" @hook:mounted="setupVideo" type="application/x-mpegURL" :options="videoOptions" ref="video"/>
  <span v-if="convener">This watch party was convened by <person :userId="convener"/></span>
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
      convener: undefined,
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

    setupVideo() {
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
    },

    handleMessage(message) {
      console.log(message);
      if (message) {
	if (message.convener) this.convener = message.convener;

	if (message.ping) return;

	if (message.video) {
	  this.id = message.video;

	  this.$refs.video.player.ready(() => {
	    if (message.time) {
	      if (this.$refs.video) {
		this.$refs.video.currentTime(message.time);
		if (message.playing) this.$refs.video.play();
		if (message.pause) this.$refs.video.player.pause();
		if (message.playbackRate) this.$refs.video.player.playbackRate(message.playbackRate);
	      }
	    }
	  });
	}
      }
    },
  },

  mounted() {
    return this.getVideos();
  },

  components: {
    VideoPlayer,
  },

};
</script>
