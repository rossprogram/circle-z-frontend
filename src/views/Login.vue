<template>
       <v-container fluid fill-height>
          <v-layout flex align-center justify-center>
            <v-flex xs12 sm6 elevation-6>
              <v-card>
                <v-card-text class="pt-4">
                  <div>
                      <v-form v-model="valid" ref="form">
                        <v-text-field
                          label="Enter your e-mail address"
                          v-model="email"
                          :rules="emailRules"
                          required
                          ></v-text-field>
                        <v-text-field
                          label="Enter your password"
                          v-model="password"
                          :rules="passwordRules"
                          min="10"
                          :append-icon="passwordHidden ? 'visibility' : 'visibility_off'"
                          @click:append="() => (passwordHidden = !passwordHidden)"
                          :type="passwordHidden ? 'password' : 'text'"
                          required
                        ></v-text-field>
                       <v-layout justify-space-between>
    <v-btn @click="submit" color="primary" :disabled="!valid"
	   >
      Login</v-btn>
    <router-link to="/signup">Forgot Password or Create Account</router-link>
                       </v-layout>
                      </v-form>
                  </div>
                </v-card-text>
              </v-card>
            </v-flex>
</v-layout>
</v-container>
</template>

<script>
export default {
  data() {
    return {
      valid: false,
      passwordHidden: true,
      password: '',
      email: '',
      emailRules: [
        v => !!v || 'An e-mail is required',
        v => /.+@.+/.test(v) || 'The provided e-mail must be valid',
      ],
      passwordRules: [
        v => !!v || 'A password is required',
      ],
    };
  },

  methods: {
    submit() {
      if (this.$refs.form.validate()) {
	const { email } = this;
	const { password } = this;
	this.$store.dispatch('login', { email, password });
      }
    },
  },
};
</script>
