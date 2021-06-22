<template>
  <v-container fluid fill-height>
        <v-flex xs12 sm12>
<h1>Not Found</h1>
<p>I could not find what you are looking for.</p>
</v-flex>
</v-container>
</template>

<script>
import { mapState } from 'vuex';

export default {
computed: {
...mapState(['profile']),
},
};
</script>
