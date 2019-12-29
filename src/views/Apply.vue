<template>
<v-form :key="key">
<p>We invite you to submit your application to be a student at the
Ross Mathematics Program.  There are two locations for the Ross
Programs, and this single application is for both.</p>
<p class="my-4">The Admission Committee will start reading applications on March 1, {{ (new Date()).getFullYear() }}
and will make admission decisions on a rolling basis. The deadline for
applications is April 1, but spaces will fill as applications arrive.
For adequate consideration of your application, <b>it is best to complete
your application well before the end of March.</b></p>
<p>If you have questions about the admissions process, please contact
<a href="mailto:ross@rossprogram.org">ross@rossprogram.org</a>.</p>
</v-form>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  computed: {
    ...mapState(['application']),

  },

  data() {
    return {
    };
  },
  methods: {
    ...mapActions([
      'getApplication',
      'updateApplication',
    ]),

    saveApplication() {
      return this.updateApplication(this.updatedApplication);
    },


  },

  mounted() {
    return this.getApplication();
  },
};
</script>
