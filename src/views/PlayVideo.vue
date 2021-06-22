<template>
<v-container fluid fill-height>
  <video-player
		:src="`https://d2vkw31bv9q4du.cloudfront.net/${id}.m3u8`"
		type="application/x-mpegURL" :options="videoOptions"
		/>
</v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex';

import VideoPlayer from '@/components/VideoPlayer.vue';
import 'video.js/dist/video-js.css';


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
      search: '',
      key: 1,
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

  },

  beforeRouteEnter(to, from, next) {
    /* eslint-disable no-param-reassign */
    next((vm) => {
      if (to.params.id) {
	vm.id = to.params.id;
      } else vm.id = undefined;
    });
  },

  beforeRouteUpdate(to, from, next) {
    if (to.params.id) {
      this.id = to.params.id;
    } else this.id = undefined;
    next();
  },

  mounted() {
    if (this.$route.params.id) {
      this.id = this.$route.params.id;
    } else {
      this.id = undefined;
    }

    return this.getVideos();
  },

  components: {
    VideoPlayer,
  },

};
</script>
