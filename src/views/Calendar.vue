<template>
<div style="height: 100%;width: 100%" >

    <v-row style="height: 100%;width: 100%">

      <v-col  style="height: calc(100vh - 104px);overflow-y:scroll;padding:0!important" :cols="9">
        <v-toolbar flat>
          <v-btn class="ml-auto" @click="prev" icon><v-icon>mdi-chevron-left</v-icon></v-btn>
          <v-btn class="mx-3" @click="calendarValue=''" outlined text>Today</v-btn>
          <v-btn class="mr-auto" @click="next" icon><v-icon>mdi-chevron-right</v-icon></v-btn>
        </v-toolbar>
        <v-calendar  color="primary" v-model="calendarValue" ref="calendar" :first-interval="earliestTimePadded" @click:event="showEvent"  style="height: calc(100% - 64px);overflow-y: hidden" short-weekdays type="week" :events="calendarEvents">
          <template v-slot:day-body="{ date, week }">
            <div
              class="v-current-time"
              :class="{ first: date === week[0].date }"
              :style="{ top: nowY }"
            ></div>
          </template>
          <template v-slot:event="{event, eventSummary}">
            <v-tooltip top >
              <span v-html="eventSummary()"></span>
              <template v-slot:activator="{ on }">

                <v-sheet
                  color="primary"
                  class="white--text pa-1" v-on="on"
                >
                  <span v-html="eventSummary()"></span>
                </v-sheet>
              </template>
            </v-tooltip>
          </template>
        </v-calendar>
      </v-col>
      <v-col style="height: calc(100vh - 104px);position:sticky;top:0"  cols="3">
        <v-card  v-if="selectedEvent">
          <v-card-title>{{selectedEvent.event.summary}}</v-card-title>
          <v-card-subtitle>{{ selectedEvent.date | moment('MMMM Do YYYY, h:mma Z') }}, which is maybe {{ selectedEvent.date | moment("from", "now") }}</v-card-subtitle>
          <v-card-text>
	    {{ selectedEvent.event.description }}
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
              target="_blank"
              :href="`https://rossprogram-org.zoom.us/j/${roomTopics[selectedEvent.event.location].meetingId}`"
              color="primary"
            >
              Go To {{normalizeRoom(selectedEvent.event.location)}}
            </v-btn>
          </v-card-actions>
        </v-card>
        <v-card flat v-else>
          <v-card-title>
            Click an event for more information.
          </v-card-title>
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

      nextWeek.addDuration(new ICAL.Duration({ weeks: 6 }));
      nextWeek.addDuration(new ICAL.Duration({ hours: -6 }));

      const events = [];
      window.events = [];

      for (const v of subcomps) {
	const event = new ICAL.Event(v);// this is correct
	if (event.isRecurring()) {
	  // next is always an ICAL.Time or null
	  const i = event.iterator();
	  let date;
	  for (;;) {
	    date = i.next();
	    if ((date === undefined) || (date.compare(nextWeek) > 0)) {
	      break;
	    }
	    const id = `${event.uid}-${ date.toString()}`;

	    if (date.zone.tzid === 'floating') {
	      date.zone = new ICAL.Timezone(vtimezone);
	    }
	    date.addDuration(new ICAL.Duration({ hours: 0 }));

	    const correctedDate = moment(date.toJSDate());

	    date.addDuration(event.duration);

	    const correctedEndDate = moment(date.toJSDate());

	    events.push({
	      id,
	      date: correctedDate,
	      endDate: correctedEndDate,
	      event,
	    });
	  }
	} else {
	  if (event.startDate.zone.tzid === 'floating') {
	    event.startDate.zone = new ICAL.Timezone(vtimezone);
	  }
	  event.startDate.addDuration(new ICAL.Duration({ hours: 0 }));
	  const correctedDate = moment(event.startDate.toJSDate());

	  if (event.endDate.zone.tzid === 'floating') {
	    event.endDate.zone = new ICAL.Timezone(vtimezone);
	  }
	  event.endDate.addDuration(new ICAL.Duration({ hours: 0 }));
	  const correctedEndDate = moment(event.endDate.toJSDate());

	  events.push({
	    id: event.uid,
	    date: correctedDate,
	    endDate: correctedEndDate,
	    event,
	  });
	}
      }

      events.sort((a, b) => a.date.diff(b.date));

      return events;
    },
    calendarEvents() {
      const raw = this.jCalData;
      const events = [];
        // add these many minutes to any time
      for (const ev of raw) {
        events.push({
          name: ev.event.summary,
          start: new Date(ev.date.toDate()),
          end: new Date(ev.endDate.toDate()),
          timed: true,
          id: ev.id,
        });
      }
      return events;
    },
    earliestTimePadded() {
      let earliest = 12;
      for (const event of this.calendarEvents) {
        const hour = event.start.getHours();
        earliest = Math.min(earliest, hour);
      }
      return earliest - 1; // subtract one for padding
    },
    selectedEvent() {
      const matches = this.jCalData.filter(x => x.id === this.event);

      if (matches.length > 0) return matches[0];

      return undefined;
    },
    cal() {
      return this.ready ? this.$refs.calendar : null;
    },
    nowY() {
      return this.cal ? `${this.cal.timeToY(this.cal.times.now) }px` : '-10px';
    },
  },

  data() {
    return {
      event: '',
      key: 1,
      calendarValue: '',
      ready: false,
    };
  },

  methods: {
    ...mapActions([
      'getCalendar',
      'getRooms',
    ]),
    prev() {
      this.$refs.calendar.prev();
      this.$refs.calendar.checkChange();
    },
    next() {
      this.$refs.calendar.next();
    },
    showEvent({ event }) {
      this.event = event.id;
    },
    getCurrentTime() {
      return this.cal ? this.cal.times.now.hour * 60 + this.cal.times.now.minute : 0;
    },
    scrollToTime() {
      const time = this.getCurrentTime();
      const first = Math.max(0, time - (time % 30) - 30);

      this.cal.scrollToTime(first);
    },
    updateTime() {
      // update the bar every second
      setInterval(() => this.cal.updateTimes(), 60 * 1000);
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
    this.ready = true;
    this.scrollToTime();
    this.updateTime();
    return this.getCalendar();
  },

};
</script>
<style>
.v-current-time {
  height: 2px;
  background-color: #ea4335;
  position: absolute;
  left: -1px;
  right: 0;
  pointer-events: none;
}
.v-current-time.first::before {
  content: '';
  position: absolute;
  background-color: #ea4335;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-top: -5px;
  margin-left: -6.5px;
}
</style>
