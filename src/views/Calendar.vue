<template>
<v-container fluid fill-height>
  <v-row><v-col :cols="selectedEvent ? 6 : 12"><v-card>
	<v-card-title>Upcoming events</v-card-title>
	<v-card-subtitle></v-card-subtitle>
	<v-list-item two-line v-for="item in jCalData"
		     :to="'/calendar/' + item.id"
		     :key="item.id">
	  <v-list-item-content>
            <v-list-item-title>
	      {{ item.event.summary }}
	    </v-list-item-title>
	    <v-list-item-subtitle>
	      {{ item.date | moment('MMMM Do YYYY, h:mma') }}
	      {{ item.date | moment("from", "now") }}
	    </v-list-item-subtitle>
	  </v-list-item-content>
	</v-list-item>
    </v-card></v-col>

    <v-col cols="6" v-if="selectedEvent"><v-card>
	<v-card-title>{{selectedEvent.event.summary}}</v-card-title>
	<v-card-subtitle>{{ selectedEvent.date | moment("from", "now") }}</v-card-subtitle>
	<v-card-text>
	  {{ selectedEvent.event.description }}
	</v-card-text>
	<v-list one-line>
	  <v-list-item>
            <v-list-item-icon>
              <v-icon>
		mdi-clock
              </v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ selectedEvent.date | moment('MMMM Do YYYY, h:mma') }}</v-list-item-title>
            </v-list-item-content>
	  </v-list-item>

	  <v-list-item v-if="roomTopics[selectedEvent.event.location]">
            <v-list-item-icon>
              <v-icon>
		mdi-map-marker
              </v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{normalizeRoom(selectedEvent.event.location)}}</v-list-item-title>
            </v-list-item-content>
	  </v-list-item>
	</v-list>

	  <v-card-actions>
	    <v-btn
	      v-if="roomTopics[selectedEvent.event.location]"
	      text
	      :href="`https://rossprogram-org.zoom.us/j/${roomTopics[selectedEvent.event.location].meetingId}`"
	      color="primary"
	      >
	      Go To {{normalizeRoom(selectedEvent.event.location)}}
	    </v-btn>
	  </v-card-actions>
    </v-card></v-col>


  </v-row>
</v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import ICAL from 'ical.js';
import moment from 'moment';

export default {
  computed: {
    ...mapState(['calendar', 'roomTopics']),

    jCalData() {
      if (this.calendar.length === 0) return [];

      const jcalData = ICAL.parse(this.calendar);
      const comp = new ICAL.Component(jcalData);
      const subcomps = comp.getAllSubcomponents('vevent');

      const nextWeek = ICAL.Time.now();
      nextWeek.addDuration(new ICAL.Duration({ weeks: 2 }));

      const events = [];
      window.events = [];

      for (const v of subcomps) {
	const event = new ICAL.Event(v);
	if (event.isRecurring()) {
	  // next is always an ICAL.Time or null
	  const i = event.iterator();
	  let date;
	  for (;;) {
	    date = i.next();
	    if ((date === undefined) || (date.compare(nextWeek) > 0)) {
	      break;
	    }
	    if (date.compare(ICAL.Time.now()) >= 0) {
	      const id = `${event.uid }-${ date.toString()}`;
	      const correctedDate = moment(date.toJSDate());
	      events.push({ id, date: correctedDate, event });
	    }
	  }
	} else if (event.startDate.compare(ICAL.Time.now()) >= 0) {
	  const correctedDate =	moment(event.startDate.toJSDate());
	  events.push({ id: event.uid, date: correctedDate, event });
	}
      }

      events.sort((a, b) => a.date.diff(b.date));

      return events;
    },

    selectedEvent() {
      const matches = this.jCalData.filter(x => x.id === this.event);

      if (matches.length > 0) return matches[0];

      return undefined;
    },
  },

  data() {
    return {
      event: '',
      key: 1,
    };
  },

  methods: {
    ...mapActions([
      'getCalendar',
      'getRooms',
    ]),

    normalizeRoom(s) {
      if (s === 'room0') return 'Room 0';
      if (s === 'room1') return 'Room 1';
      if (s === 'room2') return 'Room 2';
      if (s === 'room3') return 'Room 3';
      if (s === 'room4') return 'Room 4';
      if (s === 'room5') return 'Room 5';
      if (s === 'room6') return 'Room 6';
      if (s === 'room7') return 'Room 7';
      if (s === 'room8') return 'Room 8';
      if (s === 'room9') return 'Room 9';

      if (typeof s !== 'string') return '';
      return s.charAt(0).toUpperCase() + s.slice(1);
    },
  },

  beforeRouteEnter(to, from, next) {
    /* eslint-disable no-param-reassign */
    next((vm) => {
      if (to.params.event) vm.event = to.params.event;
      else vm.event = '';
    });
  },

  beforeRouteUpdate(to, from, next) {
    if (to.params.event) this.event = to.params.event;
    else this.event = '';
    next();
  },

  mounted() {
    if (this.$route.params.event) {
      this.event = this.$route.params.event;
    } else {
      this.event = '';
    }

    this.getRooms();
    return this.getCalendar();
  },

};
</script>
