<template>
<div style="height: 100%;width: 100%" >

    <v-row style="height: 100%;width: 100%">

      <v-col style="height: calc(100vh - 104px);overflow-y:scroll" :cols="selectedEvent? 9: 12">
        <v-calendar event-height="40" @click:event="showEvent"  style="height: 100%" short-weekdays type="week" :events="calendarEvents">
        </v-calendar>
      </v-col>
      <v-col style="height: calc(100vh - 104px);position:sticky;top:0" v-if="selectedEvent" cols="3">
        <v-card>
          <v-card-title>{{selectedEvent.event.summary}}</v-card-title>
          <v-card-subtitle>{{ selectedEvent.date | moment('MMMM Do YYYY, h:mma Z') }}, which is maybe {{ selectedEvent.date | moment("from", "now") }}</v-card-subtitle>
          <v-card-text>


          </v-card-text>
          <v-list one-line>
            <v-list-item v-if="selectedEvent.event.attendees.length > 0">
              <v-list-item-icon class="my-8">
                <v-icon v-if="selectedEvent.event.attendees.length > 1">
                  mdi-account-multiple
                </v-icon>
                <v-icon v-else>
                  mdi-account
                </v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>
		<span v-for="attendee in selectedEvent.event.attendees" :key="attendee.getParameter('cn')">
		  <person :userId="emails[attendee.getParameter('cn')]"/>
		</span>
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item>
              <v-list-item-icon>
                <v-icon>
                  mdi-clock
                </v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title>{{ selectedEvent.date | moment('MMMM Do YYYY, h:mma Z') }}</v-list-item-title>
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
        </v-card>

      </v-col>
  </v-row>
</div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import ICAL from 'ical.js';
import moment from 'moment';

export default {
  computed: {
    ...mapState(['calendar', 'roomTopics', 'emails', 'users']),

    jCalData() {
      if (this.calendar.length === 0) return [];

      const jcalData = ICAL.parse(this.calendar);
      const comp = new ICAL.Component(jcalData);
      const subcomps = comp.getAllSubcomponents('vevent');

      const vtimezone = comp.getFirstSubcomponent('vtimezone');

      const nextWeek = ICAL.Time.now();
      nextWeek.addDuration(new ICAL.Duration({ weeks: 3 }));

      const aBitAgo = ICAL.Time.now();
      nextWeek.addDuration(new ICAL.Duration({ hours: -6 }));

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
	    if (date.compare(aBitAgo) >= 0) {
	      const id = `${event.uid }-${ date.toString()}`;
	      date.zone = new ICAL.Timezone(vtimezone);
	      date.addDuration(new ICAL.Duration({ hours: 0 }));
	      const correctedDate = moment(date.toJSDate());
	      events.push({ id, date: correctedDate, event });
	    }
	  }
	} else if (event.startDate.compare(aBitAgo) >= 0) {
	  event.startDate.zone = new ICAL.Timezone(vtimezone);
	  event.startDate.addDuration(new ICAL.Duration({ hours: 0 }));
	  const correctedDate = moment(event.startDate.toJSDate());
	  events.push({ id: event.uid, date: correctedDate, event });
	}
      }

      events.sort((a, b) => a.date.diff(b.date));

      return events;
    },
    calendarEvents() {
      const raw = this.jCalData;
      const events = [];

      for (const ev of raw) {
        events.push({
          name: ev.event.summary,
          start: new Date(ev.date.toDate()),
          timed: true,
          id: ev.id,
        });
      }
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

    showEvent({ event }) {
      this.event = event.id;
    },

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
