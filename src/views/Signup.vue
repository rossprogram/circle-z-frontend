<template>
<v-container fluid fill-height>
  <v-layout flex align-center justify-center>
    <v-flex xs12 sm12>
      <v-card>
        <v-card-text class="pt-4">
	  <p>To get started, provide us with your email address.  A password will be sent to you.</p>
	  <p>You can also use this form if you have forgotten your password.</p>
	  <p>If you have already created an account and received your credentials, <router-link to="/login">proceed to login</router-link>.</p>
	  <v-form ref="form">
          <v-text-field
            label="Enter your e-mail address"
            v-model="email"
            :rules="emailRules"
	    :loading="emailSending"
            required
            ></v-text-field>
	  <div class="my-2">
	    <v-btn :disabled="emailSending" class="mr-4" @click="submit" color="primary">Get Password</v-btn>
	    <v-progress-circular v-if="emailSending"
				 indeterminate
				 color="primary"
				 ></v-progress-circular>
	  </div>
	  </v-form>
	  <p class="my-4" v-if="emailSent">
	    An email has been sent.  In a few minutes, please check your email, then <router-link to="/login">log in</router-link> using the provided credentials.
	  </p>
	  <p class="my-4" v-if="errorMessage" v-text="errorMessage"></p>
	  <p class="my-4" v-if="errorMessage">Please contact <a href="mailto:ross@rossprogram.org">ross@rossprogram.org</a> for assistance.</p>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</v-container>
</template>

<script>
import userService from '../services/user';

export default {
  data() {
    return {
      email: '',
      emailSent: false,
      errorMessage: '',
      emailSending: false,
      emailRules: [
        v => !!v || 'An e-mail is required',
        v => /.+@.+/.test(v) || 'The provided e-mail must be valid',
      ],
    };
  },

  methods: {
    submit() {
      if (this.$refs.form.validate()) {
	this.emailSending = true;

	userService.requestPassword(this.email).then(() => {
	  this.emailSent = true;
	  this.emailSending = false;
	  this.errorMessage = '';
	})
          .catch((err) => {
	    this.emailSending = false;
	    this.emailSent = false;
	    this.errorMessage = err;
	  });
      }
    },
  },

};
</script>
