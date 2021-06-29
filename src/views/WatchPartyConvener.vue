<template>
<v-container fluid fill-height>
  <video-player
    :src="`https://d2vkw31bv9q4du.cloudfront.net/${id}.m3u8`"
    type="application/x-mpegURL" :options="videoOptions"
    @playing="playing" @pause="pause" @ratechange="ratechange" ref="video"
    />
</v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex';

import VideoPlayer from '@/components/VideoPlayer.vue';
import 'video.js/dist/video-js.css';

import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = process.env.VUE_APP_API_URL || '';

export default {
  computed: {
    ...mapState(['profile', 'videos']),

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
      currentTime: 0,
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

    playing(time) {
      axios.put('/watch-party', {
	convener: this.profile.id, video: this.id, time, playing: true,
      });
    },

    ratechange(time, playbackRate) {
      axios.put('/watch-party', {
	convener: this.profile.id, video: this.id, time, playbackRate,
      });
    },

    pause(time) {
      axios.put('/watch-party', {
	convener: this.profile.id, video: this.id, time, pause: true,
      });
    },
  },

  beforeRouteEnter(to, from, next) {
    /* eslint-disable no-param-reassign */
    next((vm) => {
      if (to.params.id) {
	vm.id = to.params.id;
	axios.put('/watch-party', { video: vm.id, convener: vm.profile.id });
      } else vm.id = undefined;
    });
  },

  beforeRouteUpdate(to, from, next) {
    if (to.params.id) {
      this.id = to.params.id;
      axios.put('/watch-party', { video: this.id, convener: this.profile.id });
    } else this.id = undefined;

    next();
  },

  mounted() {
    if (this.$route.params.id) {
      this.id = this.$route.params.id;
    } else {
      this.id = undefined;
    }

    axios.put('/watch-party', { video: this.id, convener: this.profile.id });

    return this.getVideos();
  },

  components: {
    VideoPlayer,
  },

};
</script>
