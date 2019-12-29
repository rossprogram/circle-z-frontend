<template>
<v-form :key="key">
  <v-container fluid>
    <v-row><v-col><v-card>
      <v-card-title>Your parent or guardian</v-card-title>
    <v-card-subtitle>During the Program, we may need to contact your parent or guardian.  Please provide information (valid during Summer {{(new Date()).getFullYear()}}) on your parent or guardian below.</v-card-subtitle>
    <v-card-text class="py-0">
          <v-text-field
            label="Your Parent's Full Name"
            v-model="parentName"
	    prepend-icon="mdi-account"
            ></v-text-field>
          <v-text-field
            label="Your Parent's Email"
	    prepend-icon="mdi-mail"
            v-model="parentEmail"
            ></v-text-field>
	  <v-input>
	    <template slot="prepend">
	      <v-icon>phone</v-icon>
	    </template>
	    <div style="width: 100%;">
	      <vue-tel-input mode="international" placeholder="Enter your parent's phone number" v-model="parentPhone"></vue-tel-input>
	    </div>
	  </v-input>
	  <v-textarea
	    outlined
	    prepend-icon="mdi-home"
	    label="Your parent's home address"
	    v-model="parentAddress"
	    hint="A residential address where your parent can receive mail"
	    ></v-textarea>
    </v-card-text>
    </v-card></v-col></v-row>
  </v-container>


  <v-flex
    xs12
    text-xs-right
    >

    <v-btn
	   @click="saveApplication"
	   color="primary"
	   class="mr-4"
           :disabled="Object.keys(this.updatedApplication).length == 0"
	   >
      Save Application
    </v-btn>
  </v-flex>
</v-form>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  computed: {
    ...mapState(['application']),

  parentName: {
      get() { return this.application.parentName; },
      set(v) { this.$set(this.updatedApplication, 'parentName', v); },
    },
  parentPhone: {
      get() { return this.application.parentPhone; },
      set(v) { this.$set(this.updatedApplication, 'parentPhone', v); },
    },
  parentEmail: {
      get() { return this.application.parentEmail; },
      set(v) { this.$set(this.updatedApplication, 'parentEmail', v); },
    },
  parentAddress: {
      get() { return this.application.parentAddress; },
      set(v) { this.$set(this.updatedApplication, 'parentAddress', v); },
    },

  },

  data() {
    return {
      saved: false,
      birthdayMenu: null,
      updatedApplication: {},
key: 1,
    };
  },
  watch: {
    birthdayMenu() {
      const { picker } = this.$refs;
      // if (val)
      picker.activePicker = 'YEAR';
      setTimeout(() => { picker.activePicker = 'YEAR'; }, 1000);
    },
  },
  methods: {
    ...mapActions([
      'getApplication',
      'updateApplication',
    ]),

    saveApplication() {
      this.saved = true;
      return this.updateApplication(this.updatedApplication);
    },

    saveBirthday(date) {
      this.$refs.birthdayMenu.save(date);
    },
  },

  beforeRouteLeave(to, from, next) {
    if (Object.keys(this.updatedApplication).length > 0 && !this.saved) {
      const answer = window.confirm('Do you really want to leave? You have unsaved changes.');
      if (answer) {
	next();
      } else {
	next(false);
      }
    } else {
      next();
    }
  },


  mounted() {
    return this.getApplication();
  },
};
</script>
