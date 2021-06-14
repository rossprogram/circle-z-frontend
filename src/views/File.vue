<template>
  <v-container fluid fill-height>
    <p><a :href="url">Download {{path}}</a></p>
</v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  computed: {
    ...mapState(['fileUrls']),

    url() {
      return this.fileUrls[this.path];
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
      'getFile',
    ]),
  },

  beforeRouteUpdate(to, from, next) {
    this.path = to.params.path;
    next();
  },

  mounted() {
    this.path = this.$route.params.path;
    return this.getFile(this.path);
  },

};
</script>
