<template>
  <div>
    <v-snackbar
      v-model="show"
      top
      >
      <person :userId="user"/>
    {{ message }}
    <v-btn
      color="accent"
      text
      @click="show = false"
      >
      Close
    </v-btn>
    </v-snackbar>

	<v-dialog v-model='open' width='500'>
          <template v-slot:activator="{ on }">
	    <v-btn primary v-on="on" fab bottom right fixed>
              <v-icon>chat</v-icon>
	    </v-btn>
	    </template>
	  <v-card height="85vh" class="pa-4 d-flex flex-column fill-height">
	    <v-card-title>Chat</v-card-title>
	    <v-card-subtitle>Send messages to everyone on Circle Z</v-card-subtitle>
            <v-card-text class="flex-grow-1 overflow-y-auto">
	      <template v-for="(msg, i) in messages" >
                <div class="d-flex"
		     :key="i">
		  <person :userId="msg.from"/>
		  <div class="my-4">{{ msg.text }}</div>
                </div>
              </template>
	    </v-card-text>
            <v-card-text class="flex-shrink-1 my-6">
	      <v-form @submit.prevent="submit">
		<v-row>
		  <v-text-field outlined hide-details v-model="text"></v-text-field>
		  <v-btn type="submit" x-large icon><v-icon>mdi-send</v-icon></v-btn>
		</v-row>
	      </v-form>
	    </v-card-text>
	  </v-card>
	</v-dialog>
</div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import axios from 'axios';

let sseClient;
axios.defaults.withCredentials = true;
axios.defaults.baseURL = process.env.VUE_APP_API_URL || '';

export default {
  computed: {
    ...mapState(['users']),
  },

  name: 'Chat',
  props: {
  },

  watch: {
  },

  data() {
    return {
      open: false,
      show: false,
      user: '',
      text: '',
      message: '',
      messages: [],
    };
  },

  methods: {
    ...mapActions([
      'getUsers',
    ]),

    handleMessage(message) {
      if (message.ping) return;

      this.messages.push(message);

      if (!this.open) {
	this.message = message.text;
	this.user = message.from;
	this.show = true;
      }
    },

    submit() {
      axios.put('/chat', { text: this.text });
      this.text = '';
      return false;
    },
  },

  mounted() {
    setInterval(() => {
      axios.put('/ping', { date: Date.now() });
    }, 60 * 1000);

    axios.put('/ping', { date: Date.now() });

    sseClient = this.$sse.create({
      url: `${process.env.VUE_APP_API_URL }/chat`,
      format: 'json',
      withCredentials: true,
      polyfill: true,
    });

    sseClient.on('message', this.handleMessage);
    sseClient.connect();

    return this.getUsers();
  },
};
</script>

<style>

</style>
