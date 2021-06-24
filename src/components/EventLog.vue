<template>
      <v-card>
	<v-card-title>Event log</v-card-title>
	<v-list two-line>
	  <v-list-item v-for="event in events" :key="event.id">
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
	  <v-list-item-avatar>
	    <person :userId="event.user"/>
	  </v-list-item-avatar>
	  </v-list-item>
	</v-list>
      </v-card>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState(['users', 'rooms']),

  },

  data() {
    return {
    };
  },

  name: 'EventLog',
  props: {
    events: [],
  },

};
</script>
