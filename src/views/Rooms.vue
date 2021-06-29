<template>
<v-container fluid fill-height>
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
	<v-card-title>
	  {{rooms[meetingId].topic.replace('ˢᵗᵃᶠᶠ ','').replace('⁺ ','').replace("'s Personal Meeting Room","'s room")}}
	</v-card-title>
	<v-card-subtitle v-if="!rooms[meetingId].isActive">Meeting ended {{ rooms[meetingId].endTime | moment('from', 'now') }}.</v-card-subtitle>
	<v-card-subtitle v-if="rooms[meetingId].isActive">Meeting started {{ rooms[meetingId].startTime | moment('from', 'now') }}.</v-card-subtitle>

	<v-card-text v-if="rooms[meetingId].isActive && roomUsers[meetingId] && (roomUsers[meetingId].length == 1)">{{ roomUsers[meetingId].length }} person in the room.</v-card-text>
	<v-card-text v-else-if="rooms[meetingId].isActive && roomUsers[meetingId] && (roomUsers[meetingId].length >= 0)">{{ roomUsers[meetingId].length }} people in the room.</v-card-text>
	<v-card-text v-else>Room is empty.</v-card-text>
	<v-list-item two-line v-for="id in (rooms[meetingId].isActive ? (roomUsers[meetingId] ? (showMore[meetingId] ? roomUsers[meetingId] : roomUsers[meetingId].slice(0,10)) : []) : [])"
		     :to="'/users/' + id"
		     :key="id">
	  <v-list-item-content>
	    <v-list-item-title>
	      <person :userId="id"/>
	      {{ users[id].firstName }}
	      {{ users[id].lastName }}
	    </v-list-item-title>
	  </v-list-item-content>
	</v-list-item>
	<v-list-item two-line
		     v-if="(!showMore[meetingId]) && roomUsers[meetingId] && roomUsers[meetingId].length > 10"
		     @click="$set(showMore,meetingId, true)">
	  <v-list-item-content>
	    <v-list-item-title>
	      Show more&hellip;
	    </v-list-item-title>
	  </v-list-item-content>
	</v-list-item>
      <v-card-actions>
	<v-btn
	  text
	  target="_blank"
	  :href="`https://rossprogram-org.zoom.us/j/${meetingId}`"
	  >
	  Join
	</v-btn>
	<v-btn
	  v-if="profile.isStaff && roomUsers[meetingId] && (roomUsers[meetingId].length > 0)"
	  text
	  target="_blank"
	  @click="copyParticipantsToClipboard(meetingId)"
	  >
	  Copy names
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
	const matchingRooms = Object.keys(this.rooms)
	  .filter((id) => {
	    const content = JSON.stringify(this.rooms[id]);
	    return content.toLowerCase().match(this.search.toLowerCase());
	  });

	const matchingPeople = Object.keys(this.users)
	    .filter(id => JSON.stringify(this.users[id]).toLowerCase().match(this.search.toLowerCase()))
	    .map(id => this.users[id].meetingId)
	    .filter(id => (id !== undefined) && (id !== 'undefined'));

	const result = [...new Set(matchingRooms.concat(matchingPeople))];
	return result;
      }

      return Object.keys(this.rooms);
    },

    roomUsers() {
      const result = {};

      Object.values(this.users).forEach((u) => {
	if (u.meetingId) (result[u.meetingId] || (result[u.meetingId] = [])).push(u.id);
      });

      return result;
    },
  },

  data() {
    return {
      id: undefined,
      search: '',
      showMore: {},
      key: 1,
    };
  },

  methods: {
    ...mapActions([
      'getUsers',
      'getRooms',
    ]),

    copyParticipantsToClipboard(meetingId) {
      const result = this.roomUsers[meetingId]
	.map(id => `${this.users[id].firstName } ${ this.users[id].lastName } <${ this.users[id].email }>`)
      .join('\n');

      navigator.clipboard.writeText(result);
    },

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
