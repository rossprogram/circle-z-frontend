<template>
  <v-snackbar
    v-model="show"
    :timeout="timeout"
    >
    {{ text }}
    <v-btn
      color="accent"
      text
      @click="show = false"
      >
      Close
    </v-btn>
  </v-snackbar>
</template>

<script>
// Utilities
export default {
  data() {
    return {
      show: false,
      timeout: 2000,
      text: '',
    };
  },
  created() {
    this.$store.watch(state => state.snackbar.snack, () => {
      const msg = this.$store.state.snackbar.snack;
      if (msg !== '') {
        this.show = true;
        this.text = this.$store.state.snackbar.snack;
        this.timeout = 6000;
        this.$store.commit('setSnack', '');
      }
    });
  },
};
</script>
