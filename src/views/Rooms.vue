<template>
<v-container fluid fill-height>
  {{ rooms }}
  <v-row><v-col cols="12">
      <v-text-field
        label="Search"
	v-model="search"
        prepend-inner-icon="mdi-magnify"
	clearable
        ></v-text-field>
  </v-col></v-row>
  <v-row>
    <v-col cols="12" sm="12" md="4" v-for="meetingId in sortMeetingIds(matchingMeetingIds)" :key="meetingId">
      <v-card :outlined="!rooms[meetingId].isActive">
  <v-card-title>{{rooms[meetingId].topic}}
  <v-badge class="float-right"
          color="green"
          content="6"
        >
          Item Two
        </v-badge></v-card-title>
	<v-card-subtitle v-if="!rooms[meetingId].isActive">Meeting ended {{ rooms[meetingId].endTime | moment('from', 'now') }}</v-card-subtitle>
	<v-card-subtitle v-if="rooms[meetingId].isActive">Meeting started {{ rooms[meetingId].startTime | moment('from', 'now') }}</v-card-subtitle>
      <v-card-actions>
	<v-btn
	  text
	  :href="`https://rossprogram-org.zoom.us/j/${meetingId}`"
	  >
	  Join
	</v-btn>
      </v-card-actions>
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
    ...mapState(['users', 'profile', 'rooms']),

    matchingMeetingIds() {
      if (this.search) {
	return Object.keys(this.rooms)
	  .filter(id => JSON.stringify(this.rooms[id]).toLowerCase().match(this.search.toLowerCase()));
      }
      return Object.keys(this.rooms);
    },

    person() {
      if ((this.id) && (this.id in this.users)) return this.users[this.id];

      return {};
    },

  },

  data() {
    return {
      id: undefined,
      search: '',
      key: 1,
    };
  },

  methods: {
    ...mapActions([
      'getUsers',
      'getRooms',
    ]),

    sortMeetingIds(ids) {
      const result = ids;
      result.sort((a, b) => Date.parse(this.rooms[b].updatedAt) - Date.parse(this.rooms[a].updatedAt));
      return result;
    },

  },

  mounted() {
    this.getRooms();
    return this.getUsers();
  },

};
</script>
