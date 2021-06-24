<template>
<v-container fluid fill-height>
  <v-row>

    <v-navigation-drawer app permanent>
      <v-text-field
        label="Search"
	v-model="search"
        prepend-inner-icon="mdi-magnify"
	clearable
        ></v-text-field>


      <div v-for="family in sortFamilies(Object.keys(matchingFamilies))" :key="family">
	<v-subheader v-if="family === 'undefined'">Other People</v-subheader>
	<v-subheader v-else-if="profile.family === family">Your family, Family {{family}}</v-subheader>
	<v-subheader v-else>Family {{family}}</v-subheader>

	<v-list-item two-line v-for="id in matchingFamilies[family]"
		     :to="'/users/' + id"
		     :key="id">
	  <v-list-item-avatar>
	    <person :userId="id"/>
	  </v-list-item-avatar>
	  <v-list-item-content>
	    <v-list-item-title>
	      <span v-if="users[id].nickname">{{ users[id].nickname }}</span>
	      <span v-else>{{ users[id].firstName }}</span>
	      {{ users[id].lastName }}
	    </v-list-item-title>
	  </v-list-item-content>
	</v-list-item>
      </div>
    </v-navigation-drawer>

    <v-col cols="12" v-if="id"><v-card  :key="id">
	<v-card-title><person :userId="id"/>{{ users[id].firstName }}
	      {{ users[id].lastName }}
	  &lt;{{ users[id].email }}&gt;</v-card-title>
	    <v-card-subtitle v-if="users[id].isSuperuser">Superuser</v-card-subtitle>
	    <v-card-subtitle v-else-if="users[id].isCounselor">Counselor</v-card-subtitle>
	    <v-card-subtitle v-else-if="users[id].isStaff">Staff</v-card-subtitle>
	    <v-card-subtitle v-else-if="users[id].isFirstYear">First-year participant</v-card-subtitle>
	    <v-card-subtitle v-else>Advanced participant</v-card-subtitle>

	    <v-list one-line>

	      <v-list-item v-if="users[id].availableForChat || users[id].meetingId">
		<v-list-item-icon>
		  <v-icon>
		    mdi-lan-connect
		  </v-icon>
		</v-list-item-icon>

		<v-list-item-content>
		  <v-list-item-title>
		    Online now
		  </v-list-item-title>
		</v-list-item-content>
	      </v-list-item>


	      <v-list-item v-if="users[id].meetingId">
		<v-list-item-icon>
		  <v-icon>
		    mdi-map-marker
		  </v-icon>
		</v-list-item-icon>

		<v-list-item-content>
		  <v-list-item-title>
		    {{ users[id].meetingJoinTime | moment("from", "now") }} entered
		    <a :href="`https://rossprogram-org.zoom.us/j/${users[id].meetingId}`">
		      {{ rooms[users[id].meetingId].topic }}
		    </a>
		  </v-list-item-title>
		</v-list-item-content>
	      </v-list-item>

	      <v-list-item v-if="!(users[id].meetingId) && (users[id].meetingLeaveTime)">
		<v-list-item-icon>
		  <v-icon>
		    mdi-map-marker
		  </v-icon>
		</v-list-item-icon>

		<v-list-item-content>
		  <v-list-item-title>
		    {{ users[id].meetingLeaveTime | moment("from", "now") }} left Zoom.
		  </v-list-item-title>
		</v-list-item-content>
	      </v-list-item>

	    </v-list>
	    <v-divider></v-divider>

	    <v-card-text>
	      <v-layout wrap>
		<v-flex
		  xs4
		  >
		  <v-text-field
		    class="mr-4"
		    label="First (Given) Name"
		    v-model="firstName"
		    :readonly="!canEdit"
		    >
		    <v-icon slot="prepend">mdi-account</v-icon>
		  </v-text-field>
		</v-flex>
		<v-flex
		  xs4
		  >
		  <v-text-field
		    class="mr-4"
		    label="Nickname"
		    v-model="nickname"
		    :readonly="!canEdit"
		    >
		  </v-text-field>
		</v-flex>
		<v-flex
		  xs4
		  >
		  <v-text-field
		    label="Last (Family) Name"
		    v-model="lastName"
		    :readonly="!canEdit"
		    />
		</v-flex>
	      </v-layout>

	      <v-layout wrap>
		<v-flex
		  xs6
		  >
		  <v-text-field
		    class="mr-6"
		    label="Username"
		    v-model="username"
		    :readonly="!canEdit"
		    >
		    <v-icon slot="prepend">mdi-account-box</v-icon>
		  </v-text-field>
		</v-flex>

		<v-flex xs6>
		  <v-select
		    v-model="family"
		    :disabled="!profile.isStaff"
		    :items="Array.from(Array(100).keys())"
		    label="Family"
		    prepend-icon="mdi-account-group"
		    ></v-select>
		</v-flex>
	      </v-layout>

	    <v-layout wrap>
		<v-flex xs12>
		  <v-combobox
		    v-model="pronouns"
		    :readonly="!canEdit"
		    :disabled="!canEdit"
		    :items="['he/him/his','she/her/hers', 'they/them/their']"
		    label="Preferred pronouns"
		    prepend-icon="mdi-gender-transgender"
		    ></v-combobox>
		</v-flex>
	    </v-layout>

	    <v-layout wrap>
	      <v-flex xs6 md3 v-if="profile.isSuperuser">
		<v-checkbox
		  v-model="isStaff"
		  label="Staff"
		  :readonly="!profile.isSuperuser"
		  :disabled="!profile.isSuperuser"
		  ></v-checkbox>
	      </v-flex>
	      <v-flex xs6 md3>
		<v-checkbox
		  v-model="isCounselor"
		  label="Counselor"
		  :readonly="!profile.isSuperuser"
		  :disabled="!profile.isSuperuser"
		  ></v-checkbox>
	      </v-flex>
	      <v-flex xs6 md3>
		<v-checkbox
		  v-model="isFirstYear"
		  label="First year"
		  :readonly="!profile.isStaff"
		  :disabled="!profile.isStaff"
		  ></v-checkbox>
	      </v-flex>
	      <v-flex xs6 md3>
		<v-checkbox
		  v-model="isJuniorCounselor"
		  label="Junior counselor"
		  :readonly="!profile.isStaff"
		  :disabled="!profile.isStaff"
		  ></v-checkbox>
	      </v-flex>
	      <v-flex xs6 md3>
		<v-checkbox
		  v-model="isSuperuser"
		  label="Superuser"
		  :readonly="!profile.isSuperuser"
		  :disabled="!profile.isSuperuser"
		  ></v-checkbox>
	      </v-flex>
	    </v-layout>

	    <v-layout wrap class="my-3">
	      <v-flex xs12>
		<v-image-input
		  v-model="image"
		  :readonly="!canEdit"
		  :image-quality="0.80"
		  :imageHeight="256"
		  :imageWidth="256"
		  :clearable="canEdit"
		  image-format="jpeg"
	      />
              </v-flex>
  </v-layout>
	    <v-layout wrap>
	      <v-flex xs12>
		<v-textarea
		  outlined
		  label="Biography"
                  v-model="biography"
		  :readonly="!canEdit"
		  >
		</v-textarea>
	      </v-flex>
	    </v-layout>


</v-card-text>
	  <v-card-actions>
  <v-btn
v-if="canEdit"
	      text
	      @click="savePerson"
	      color="primary"
              :disabled="Object.keys(this.updatedPerson).length == 0"
	      >
  Save changes
</v-btn>
  <v-btn
v-if="profile.isStaff"
	      text
	      :to="`/reports/${id}`"
	      color="secondary"
	      >
	      Write report
  </v-btn>
	    <v-btn
	      v-if="users[id].meetingId"
	      text
	      target="_blank"
	      :href="`https://rossprogram-org.zoom.us/j/${users[id].meetingId}`"
	      >
	      Join in Zoom
	    </v-btn>
	  </v-card-actions>
    </v-card></v-col>

    <v-col v-if="id && profile.isStaff" cols="12">
      <v-card>
	<v-card-title>Event log</v-card-title>
	<v-list two-line>
	  <v-list-item v-for="event in userActivity[id]" :key="event.id">
	    <v-list-item-icon>
	      <v-icon v-if="event.verb == 'login'">mdi-login</v-icon>
	      <v-icon v-else-if="event.verb == 'report'">mdi-account-check</v-icon>
	      <v-icon v-else-if="event.verb == 'download'">mdi-download</v-icon>
	      <v-icon v-else-if="event.verb == 'submit'">mdi-upload</v-icon>
	      <v-icon v-else-if="event.verb == 'grade'">mdi-pencil</v-icon>
	      <v-icon v-else-if="event.verb == 'create'">mdi-folder-plus-outline</v-icon>
	      <v-icon v-else-if="event.verb == 'watch-party'">mdi-party-popper</v-icon>
	      <v-icon v-else>mdi-walk</v-icon>
	    </v-list-item-icon>
	    <v-list-item-content>
              <v-list-item-title>{{ event.verb.replace('-',' ') }}
		<span v-if="event.object">
		  <span v-if="event.object.ipAddress">from address {{ event.object.ipAddress }}</span>
		  <span v-else-if="event.object.user">of <person :userId="event.object.user"/>
		    <span v-if="users[event.object.user].nickname">{{ users[event.object.user].nickname }}</span>
		    <span v-else>{{ users[event.object.user].firstName }}</span>
		    {{ users[event.object.user].lastName }}</span>
		  <span v-else-if="event.object.url">file <a :href="`/files/${event.object.url}`">{{ event.object.url }}</a></span>
		  <span v-else-if="event.object.meetingId">zoom room <a :href="`https://rossprogram-org.zoom.us/j/${event.object.meetingId}`">{{ rooms[event.object.meetingId].topic }}</a></span>
		  <span v-else-if="event.object.text">&ldquo;{{ event.object.text }}&rdquo;</span>
		  <span v-else>{{ event.object }}</span>
		</span>
	      </v-list-item-title>
              <v-list-item-subtitle>{{ event.createdAt | moment("from","now") }} at {{ event.createdAt | moment('MMMM Do YYYY, h:mma') }}</v-list-item-subtitle>
	    </v-list-item-content>
	  </v-list-item>
	</v-list>
      </v-card>
    </v-col>
  </v-row>
</v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex';
// import { encode, decode } from 'base64-arraybuffer';

export default {
  computed: {
    ...mapState(['users', 'profile', 'rooms', 'userActivity']),

    matchingIds() {
      if (this.search) return Object.keys(this.users).filter(id => JSON.stringify(this.users[id]).toLowerCase().match(this.search.toLowerCase()));
      return Object.keys(this.users);
    },

    matchingFamilies() {
      const families = {};

      Object.keys(this.users).forEach((id) => {
	const user = Object.assign({}, this.users[id]);
	delete user.image;
	delete user.id;

	if (this.search) {
	  if (!JSON.stringify(user).toLowerCase().match(this.search.toLowerCase())) return;
	}

	if (user.family in families) families[user.family].push(id);
	else families[user.family] = [id];
      });

      return families;
    },

    person() {
      if ((this.id) && (this.id in this.users)) return this.users[this.id];

      return {};
    },

    canEdit() {
      if (this.profile.id === this.id) return true;
      if (this.profile.isSuperuser) return true;
      if (this.profile.isStaff) return true;
      return false;
    },

    username: {
      get() { return this.person.username; },
      set(v) { this.$set(this.updatedPerson, 'username', v); },
    },
    firstName: {
      get() { return this.person.firstName; },
      set(v) { this.$set(this.updatedPerson, 'firstName', v); },
    },
    nickname: {
      get() { return this.person.nickname; },
      set(v) { this.$set(this.updatedPerson, 'nickname', v); },
    },
    lastName: {
      get() { return this.person.lastName; },
      set(v) { this.$set(this.updatedPerson, 'lastName', v); },
    },
    isStaff: {
      get() { return this.person.isStaff; },
      set(v) { this.$set(this.updatedPerson, 'isStaff', v); },
    },
    isCounselor: {
      get() { return this.person.isCounselor; },
      set(v) { this.$set(this.updatedPerson, 'isCounselor', v); },
    },
    isFirstYear: {
      get() { return this.person.isFirstYear; },
      set(v) { this.$set(this.updatedPerson, 'isFirstYear', v); },
    },
    isJuniorCounselor: {
      get() { return this.person.isJuniorCounselor; },
      set(v) { this.$set(this.updatedPerson, 'isJuniorCounselor', v); },
    },
    isSuperuser: {
      get() { return this.person.isSuperuser; },
      set(v) { this.$set(this.updatedPerson, 'isSuperuser', v); },
    },
    pronouns: {
      get() { if (this.person.pronouns) return this.person.pronouns; return ''; },
      set(v) { this.$set(this.updatedPerson, 'pronouns', v); },
    },
    biography: {
      get() { if (this.person.biography) return this.person.biography; return ''; },
      set(v) { this.$set(this.updatedPerson, 'biography', v); },
    },
    family: {
      get() { return this.person.family; },
      set(v) { this.$set(this.updatedPerson, 'family', v); },
    },
    image: {
      get() {
	if (this.person.image) return this.person.image; return '';
      },
      set(v) {
	this.$set(this.updatedPerson, 'image', v);
      },
    },
  },

  data() {
    return {
      id: undefined,
      search: '',
      updatedPerson: {},
      key: 1,
    };
  },

  methods: {
    ...mapActions([
      'getUsers',
      'getUser',
      'getUserActivity',
      'getRooms',
      'updateUser',
    ]),

    savePerson() {
      return this.updateUser({ id: this.id, data: this.updatedPerson });
    },

    sortFamilies(families) {
      const result = families;
      result.sort(a => parseInt(a, 10));

      if (this.profile.family) {
	const index = result.indexOf(this.profile.family.toString());
	if (index > -1) {
	  result.splice(index, 1);
	  result.unshift(this.profile.family);
	}
      }

      return result;
    },

  },

  beforeRouteEnter(to, from, next) {
    /* eslint-disable no-param-reassign */
    next((vm) => {
      if (to.params.id) {
	vm.id = to.params.id;
	vm.getUser(vm.id);
	if (vm.profile.isStaff) vm.getUserActivity(vm.id);
      } else vm.id = undefined;
      vm.updatedPerson = {};
    });
  },

  beforeRouteUpdate(to, from, next) {
    if (to.params.id) {
      this.id = to.params.id;
      this.getUser(this.id);
      if (this.profile.isStaff) { this.getUserActivity(this.id); }
    } else this.id = undefined;
    this.updatedPerson = {};
    next();
  },

  mounted() {
    if (this.$route.params.id) {
      this.id = this.$route.params.id;
      this.getUser(this.id);
      if (this.profile.isStaff) { this.getUserActivity(this.id); }
    } else {
      this.id = undefined;
    }
    this.updatedPerson = {};

    this.getRooms();
    return this.getUsers();
  },

};
</script>
