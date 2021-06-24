<template>
<v-container fluid fill-height>
  <v-row>
    <v-col cols="12">
      <event-log :events="activity"/>
    </v-col>
  </v-row>
</v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex';
// import { encode, decode } from 'base64-arraybuffer';
import EventLog from '../components/EventLog.vue';


export default {
  components: {
    EventLog,
  },

  computed: {
    ...mapState(['activity']),
  },

  data() {
    return {
    };
  },

  methods: {
    ...mapActions([
      'getActivity',
    ]),
  },

  mounted() {
    return this.getActivity();
  },

};
</script>
