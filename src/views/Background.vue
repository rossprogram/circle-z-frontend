<template>
<v-form :key="key">
  <v-container fluid>
    <v-row><v-col><v-card>
	  <v-card-title>Demographic data</v-card-title>
	  <v-card-text>
	      <v-layout wrap>
		<v-flex
		  xs4
		  >
		  <v-text-field
		    class="mr-4"
		    label="First (Given) Name"
		    v-model="firstName"
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
		    >
		  </v-text-field>
		</v-flex>
		<v-flex
		  xs4
		  >
		  <v-text-field
		    label="Last (Family) Name"
		    v-model="lastName"
		    />
		</v-flex>
	      </v-layout>
	      <v-layout wrap>
		<v-flex xs6>
		  <v-select
		    v-model="citizenship"
		    :items="countries"
		    item-text="name"
		    item-value="alpha2"
		    prepend-icon="flag"
		    label="Citizenship"
		    hint="Countries for which I hold a passport"
		    persistent-hint
		    single-line
		    multiple
		    ></v-select>
		</v-flex>
		<v-flex xs6>
		  <v-combobox
		    v-model="gender"
		    :items="['Male','Female']"
		    label="How do you describe your gender?"
		    hint="Besides the provided choices, you may type freely into this field"
		    persistent-hint
		    prepend-icon="gender"
		    ></v-combobox>
		</v-flex>
	      </v-layout>
	      <v-divider class="my-4"/>
	      <v-layout wrap>

  <v-menu
    ref="birthdayMenu"
    v-model="birthdayMenu"
    :close-on-content-click="false"
    transition="scale-transition"
    offset-y
    full-width
    min-width="290px"
  >
    <template v-slot:activator="{ on }">
      <v-text-field
	class="mr-4"
        :value="updatedApplication.birthday || birthday"
        label="Date of birth"
        prepend-icon="event"
        readonly
	:hint="(typeof age == 'number') ? `Based on your birthday, you are ${age} year${age == 1 ? '' : 's'} old.` : ''"
	persistent-hint
        v-on="on"
      ></v-text-field>
    </template>
    <v-date-picker
      ref="picker"
      v-model="birthday"
      :max="new Date().toISOString().substr(0, 10)"
      min="1950-01-01"
      @change="saveBirthday"
      ></v-date-picker>
  </v-menu>
  <v-select
    v-model="graduationYear"
    hint="The year in which I expect to earn a high school diploma"
    :items="upcomingYears"
    label="High school graduation year"
    single-line
    persistent-hint
    ></v-select>
	      </v-layout>
	  </v-card-text>
    </v-card></v-col></v-row>

    <v-row><v-col><v-card>
	  <v-card-title>Programs</v-card-title>
	  <v-card-subtitle>Which Program are you applying to?  You may apply to one or both programs.</v-card-subtitle>
	  <v-card-text>
	    <v-layout wrap>
	      <v-flex xs12 md6>
		<v-checkbox
		  v-model="applyingToUSA"
		  label="I want my application to be considered for Ross/USA"
		  ></v-checkbox>
	      </v-flex>
	      <v-flex xs12 md6>
		<v-checkbox
		  v-if="updatedApplication.applyingToUSA || applyingToUSA"
		  v-model="arriveAtStartUSA"
		  label="I will be able to arrive at Ross/USA on June 21, 2020"
		  ></v-checkbox>
	      </v-flex>
	    </v-layout>
	    <v-layout  wrap>
	      <v-flex xs12 md6>
		<v-checkbox
		  v-model="applyingToAsia"
		  label="I want my application to be considered for Ross/Asia"
		  ></v-checkbox>
	      </v-flex>
	      <v-flex xs12 md6>
		<v-checkbox
		  v-if="updatedApplication.applyingToAsia || applyingToAsia"
		  v-model="arriveAtStartAsia"
		  label="I will be able to arrive at Ross/Asia on July 5, 2020"
		  ></v-checkbox>
	      </v-flex>
	    </v-layout>
	    <v-layout  wrap v-if="(updatedApplication.applyingToAsia || applyingToAsia) && (updatedApplication.applyingToUSA || applyingToUSA)">
	      <v-flex xs12 md12>
		  <v-select
		    v-model="preferredLocation"
		    hint="If admitted to both programs, the location I would prefer"
		    :items="['Ross/USA', 'Ross/Asia', 'No preference']"
		    label="Location preference"
		    prepend-icon="label_important"
		    single-line
		    persistent-hint
		    ></v-select>
		</v-flex>
	    </v-layout>

	    <v-layout  wrap>
	      <v-flex xs12 md12>
		  <v-select
		    v-model="previousApplicationYears"
		    hint="Previous years in which I applied to the Ross Program"
		    :items="recentYears"
		    label="Previous application years"
		    multiple
		    prepend-icon="repeat"
		    single-line
		    persistent-hint
		    ></v-select>
		</v-flex>
	    </v-layout>
	  </v-card-text>
    </v-card></v-col></v-row>

      <v-row><v-col><v-card>
	  <v-card-title>Contact and location information</v-card-title>
	  <v-card-subtitle>Besides email, how can we reach you?</v-card-subtitle>
	  <v-card-text>
	    <v-layout wrap>
	      <v-flex
		xs12
		md12
		>
	  <v-input>
	    <template slot="prepend">
	      <v-icon>phone</v-icon>
	    </template>
	    <div style="width: 100%;">
	      <vue-tel-input mode="international" placeholder="Enter your phone number" v-model="phone"></vue-tel-input>
	    </div>
	  </v-input>
	      </v-flex>
	    </v-layout>

	    <v-layout wrap>
	      <v-flex
		xs12
		md12
		>
		<v-textarea
		  outlined
		  label="Your current home address"
		  v-model="address"
		  prepend-icon="home"
		  hint="A residential address where you can receive mail"
		  ></v-textarea>
	    </v-flex></v-layout>
	    <v-divider class="mr-4"/>
	    <v-layout wrap>
	      <v-flex
		xs12
		md12
		>
		<v-text-field
		  class="my-4"
		  prepend-icon="school"
		  label="Current school"
		  v-model="schoolName"
		  hint="The name of the school you are presently attending"
		  ></v-text-field>
	    </v-flex></v-layout>
	    <v-layout wrap>
	      <v-flex
		xs12
		md12
		>
		<v-textarea
		  outlined
		  label="School address"
		  v-model="schoolAddress"
		  prepend-icon="directions"
		  hint="The location of the school you are presently attending.  Be sure to include the city."
		  ></v-textarea>
	    </v-flex></v-layout>
	  </v-card-text>
      </v-card></v-col></v-row>

      <v-row><v-col><v-card>
	  <v-card-title>Language</v-card-title>
	  <v-card-subtitle>Courses at the Ross Program are taught in English.</v-card-subtitle>
	  <v-card-text>
	    <v-layout wrap>
	      <v-flex
		xs12
		md12
		>
		<v-checkbox
		  v-model="nativeEnglish"
		  label="I am a native English speaker"
		  ></v-checkbox>
	      </v-flex>
	    </v-layout>

	    <v-layout wrap v-if="!(updatedApplication.nativeEnglish || nativeEnglish)">
	      <v-list-item two-line v-for="attachment in toeflAttachments"
			   :href="attachment.url"
			   :key="attachment.id">
		<v-list-item-icon>
		  <v-icon>mdi-file</v-icon>
		</v-list-item-icon>
		<v-list-item-content>
		  <v-list-item-title>{{ attachment.name }}</v-list-item-title>
		  <v-list-item-subtitle v-if="attachment.createdAt">Uploaded {{ attachment.createdAt | moment("from", "now") }}</v-list-item-subtitle>
		</v-list-item-content>
		<v-list-item-action @click.prevent="remove(attachment.id)">
		  <v-btn icon>
		    <v-icon color="grey lighten-1">mdi-delete</v-icon>
		  </v-btn>
		</v-list-item-action>
	      </v-list-item>

	      <v-list-item two-line>
		<v-list-item-content>
		  <v-list-item-title>
		    <v-file-input v-model="file" label="Upload a score report" hint="Upload a score report for a standardized test for English fluency (TOEFL, iBT, IELTS, or iTEP)." persistent-hint/>
		  </v-list-item-title>
		  <v-list-item-subtitle></v-list-item-subtitle>
		</v-list-item-content>
		<v-list-item-action @click="upload">
		  <v-btn color="primary">
		    Upload
		    <v-icon right>mdi-upload</v-icon>
		  </v-btn>
		</v-list-item-action>
	      </v-list-item>
	    </v-layout>

	    <v-divider class="my-3"/>
	      <v-layout wrap v-if="!(updatedApplication.nativeEnglish || nativeEnglish)">
	      	      <v-flex
		xs12
		md12
			>
			<p>The English language test score report may be waived for applicants who have other ways to establish their fluency in English.</p>
	      <v-textarea
		outlined
		label="To request such a waiver, please explain here."
		v-model="toeflNarrative"
		prepend-icon="mdi-web"
		/>
</v-flex></v-layout>
	  </v-card-text>
	  <v-card-actions>
	    <v-btn
	      text
	      @click="savePerson"
	      color="primary"
              :disabled="Object.keys(this.updatedPerson).length == 0"
	      >
	      Save
	    </v-btn>
	  </v-card-actions>
      </v-card></v-col></v-row>
</v-container>

  <v-flex
    xs12
    md12
    >
  </v-flex>

  <v-flex
    xs12
    md12
    >
  </v-flex>


  <v-col cols="12" md="6">
  </v-col>


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
    ...mapState(['attachments']),

    toeflAttachments: {
      get() {
	if (this.attachments) return Object.values(this.attachments).filter(a => a.label === 'toefl');
	return [];
      },
    },

    age: {
      get() {
	const born = this.updatedApplication.birthday || this.application.birthday;

	if (born) {
	  const ageDifMs = Date.now() - (new Date(born));
	  const ageDate = new Date(ageDifMs);
	  return Math.abs(ageDate.getUTCFullYear() - 1970);
	}

	return null;
      },
    },

    graduationYear: {
      get() { return this.updatedApplication.graduationYear || this.application.graduationYear; },
      set(v) { this.$set(this.updatedApplication, 'graduationYear', v); },
    },
    phone: {
      get() { return this.updatedApplication.phone || this.application.phone; },
      set(v) { this.$set(this.updatedApplication, 'phone', v); },
    },
    firstName: {
      get() { return this.application.firstName; },
      set(v) { this.$set(this.updatedApplication, 'firstName', v); },
    },
    nickname: {
      get() { return this.application.nickname; },
      set(v) { this.$set(this.updatedApplication, 'nickname', v); },
    },
    lastName: {
      get() { return this.application.lastName; },
      set(v) { this.$set(this.updatedApplication, 'lastName', v); },
    },
    applyingToUSA: {
      get() { return this.application.applyingToUSA; },
      set(v) { this.$set(this.updatedApplication, 'applyingToUSA', v); },
    },
    applyingToAsia: {
      get() { return this.application.applyingToAsia; },
      set(v) { this.$set(this.updatedApplication, 'applyingToAsia', v); },
    },
    arriveAtStartUSA: {
      get() { return this.application.arriveAtStartUSA; },
      set(v) { this.$set(this.updatedApplication, 'arriveAtStartUSA', v); },
    },
    arriveAtStartAsia: {
      get() { return this.application.arriveAtStartAsia; },
      set(v) { this.$set(this.updatedApplication, 'arriveAtStartAsia', v); },
    },
    preferredLocation: {
      get() { return this.application.preferredLocation; },
      set(v) { this.$set(this.updatedApplication, 'preferredLocation', v); },
    },
    birthday: {
      get() { return this.updatedApplication.birthday || this.application.birthday; },
      set(v) { this.$set(this.updatedApplication, 'birthday', v); },
    },
    schoolName: {
      get() { return this.application.schoolName; },
      set(v) { this.$set(this.updatedApplication, 'schoolName', v); },
    },
    schoolAddress: {
      get() { return this.application.schoolAddress; },
      set(v) { this.$set(this.updatedApplication, 'schoolAddress', v); },
    },
    address: {
      get() { return this.application.address; },
      set(v) { this.$set(this.updatedApplication, 'address', v); },
    },
    toeflNarrative: {
      get() { return this.application.toeflNarrative; },
      set(v) { this.$set(this.updatedApplication, 'toeflNarrative', v); },
    },
    gender: {
      get() { return this.application.gender; },
      set(v) { this.$set(this.updatedApplication, 'gender', v); },
    },
    nativeEnglish: {
      get() { return this.application.nativeEnglish; },
      set(v) { this.$set(this.updatedApplication, 'nativeEnglish', v); },
    },
    previousApplicationYears: {
      get() { return this.application.previousApplicationYears; },
      set(v) { this.$set(this.updatedApplication, 'previousApplicationYears', v.sort()); },
    },
    citizenship: {
      get() { return this.application.citizenship; },
      set(v) { this.$set(this.updatedApplication, 'citizenship', v); },
    },

  },

  data() {
    return {
      saved: false,
      file: null,
      birthdayMenu: null,
      updatedApplication: {},
key: 1,
upcomingYears: ([...Array(20).keys()].map(x => (x + new Date().getFullYear()))),
recentYears: ([...Array(10).keys()].map(x => (new Date().getFullYear() - x - 1))),
countries:
[
   {
      alpha2: 'AF',
      name: 'Afghanistan',
   },
   {
      alpha2: 'AL',
      name: 'Albania',
   },
   {
      alpha2: 'DZ',
      name: 'Algeria',
   },
   {
      alpha2: 'AS',
      name: 'American Samoa',
   },
   {
      alpha2: 'AD',
      name: 'Andorra',
   },
   {
      alpha2: 'AO',
      name: 'Angola',
   },
   {
      alpha2: 'AI',
      name: 'Anguilla',
   },
   {
      alpha2: 'AQ',
      name: 'Antarctica',
   },
   {
      alpha2: 'AG',
      name: 'Antigua and Barbuda',
   },
   {
      alpha2: 'AR',
      name: 'Argentina',
   },
   {
      alpha2: 'AM',
      name: 'Armenia',
   },
   {
      alpha2: 'AW',
      name: 'Aruba',
   },
   {
      alpha2: 'AU',
      name: 'Australia',
   },
   {
      alpha2: 'AT',
      name: 'Austria',
   },
   {
      alpha2: 'AZ',
      name: 'Azerbaijan',
   },
   {
      alpha2: 'BS',
      name: 'Bahamas',
   },
   {
      alpha2: 'BH',
      name: 'Bahrain',
   },
   {
      alpha2: 'BD',
      name: 'Bangladesh',
   },
   {
      alpha2: 'BB',
      name: 'Barbados',
   },
   {
      alpha2: 'BY',
      name: 'Belarus',
   },
   {
      alpha2: 'BE',
      name: 'Belgium',
   },
   {
      alpha2: 'BZ',
      name: 'Belize',
   },
   {
      alpha2: 'BJ',
      name: 'Benin',
   },
   {
      alpha2: 'BM',
      name: 'Bermuda',
   },
   {
      alpha2: 'BT',
      name: 'Bhutan',
   },
   {
      alpha2: 'BO',
      name: 'Bolivia (Plurinational State of)',
   },
   {
      alpha2: 'BQ',
      name: 'Bonaire, Sint Eustatius and Saba',
   },
   {
      alpha2: 'BA',
      name: 'Bosnia and Herzegovina',
   },
   {
      alpha2: 'BW',
      name: 'Botswana',
   },
   {
      alpha2: 'BV',
      name: 'Bouvet Island',
   },
   {
      alpha2: 'BR',
      name: 'Brazil',
   },
   {
      alpha2: 'IO',
      name: 'British Indian Ocean Territory',
   },
   {
      alpha2: 'BN',
      name: 'Brunei Darussalam',
   },
   {
      alpha2: 'BG',
      name: 'Bulgaria',
   },
   {
      alpha2: 'BF',
      name: 'Burkina Faso',
   },
   {
      alpha2: 'BI',
      name: 'Burundi',
   },
   {
      alpha2: 'CV',
      name: 'Cabo Verde',
   },
   {
      alpha2: 'KH',
      name: 'Cambodia',
   },
   {
      alpha2: 'CM',
      name: 'Cameroon',
   },
   {
      alpha2: 'CA',
      name: 'Canada',
   },
   {
      alpha2: 'KY',
      name: 'Cayman Islands',
   },
   {
      alpha2: 'CF',
      name: 'Central African Republic',
   },
   {
      alpha2: 'TD',
      name: 'Chad',
   },
   {
      alpha2: 'CL',
      name: 'Chile',
   },
   {
      alpha2: 'CN',
      name: 'China',
   },
   {
      alpha2: 'CX',
      name: 'Christmas Island',
   },
   {
      alpha2: 'CC',
      name: 'Cocos (Keeling) Islands',
   },
   {
      alpha2: 'CO',
      name: 'Colombia',
   },
   {
      alpha2: 'KM',
      name: 'Comoros',
   },
   {
      alpha2: 'CD',
      name: 'Congo (the Democratic Republic of the)',
   },
   {
      alpha2: 'CG',
      name: 'Congo',
   },
   {
      alpha2: 'CK',
      name: 'Cook Islands',
   },
   {
      alpha2: 'CR',
      name: 'Costa Rica',
   },
   {
      alpha2: 'HR',
      name: 'Croatia',
   },
   {
      alpha2: 'CU',
      name: 'Cuba',
   },
   {
      alpha2: 'CW',
      name: 'CuraÃ§ao',
   },
   {
      alpha2: 'CY',
      name: 'Cyprus',
   },
   {
      alpha2: 'CZ',
      name: 'Czechia',
   },
   {
      alpha2: 'CI',
      name: "CÃ´te d'Ivoire",
   },
   {
      alpha2: 'DK',
      name: 'Denmark',
   },
   {
      alpha2: 'DJ',
      name: 'Djibouti',
   },
   {
      alpha2: 'DM',
      name: 'Dominica',
   },
   {
      alpha2: 'DO',
      name: 'Dominican Republic',
   },
   {
      alpha2: 'EC',
      name: 'Ecuador',
   },
   {
      alpha2: 'EG',
      name: 'Egypt',
   },
   {
      alpha2: 'SV',
      name: 'El Salvador',
   },
   {
      alpha2: 'GQ',
      name: 'Equatorial Guinea',
   },
   {
      alpha2: 'ER',
      name: 'Eritrea',
   },
   {
      alpha2: 'EE',
      name: 'Estonia',
   },
   {
      alpha2: 'SZ',
      name: 'Eswatini',
   },
   {
      alpha2: 'ET',
      name: 'Ethiopia',
   },
   {
      alpha2: 'FK',
      name: 'Falkland Islands [Malvinas]',
   },
   {
      alpha2: 'FO',
      name: 'Faroe Islands',
   },
   {
      alpha2: 'FJ',
      name: 'Fiji',
   },
   {
      alpha2: 'FI',
      name: 'Finland',
   },
   {
      alpha2: 'FR',
      name: 'France',
   },
   {
      alpha2: 'GF',
      name: 'French Guiana',
   },
   {
      alpha2: 'PF',
      name: 'French Polynesia',
   },
   {
      alpha2: 'TF',
      name: 'French Southern Territories',
   },
   {
      alpha2: 'GA',
      name: 'Gabon',
   },
   {
      alpha2: 'GM',
      name: 'Gambia',
   },
   {
      alpha2: 'GE',
      name: 'Georgia',
   },
   {
      alpha2: 'DE',
      name: 'Germany',
   },
   {
      alpha2: 'GH',
      name: 'Ghana',
   },
   {
      alpha2: 'GI',
      name: 'Gibraltar',
   },
   {
      alpha2: 'GR',
      name: 'Greece',
   },
   {
      alpha2: 'GL',
      name: 'Greenland',
   },
   {
      alpha2: 'GD',
      name: 'Grenada',
   },
   {
      alpha2: 'GP',
      name: 'Guadeloupe',
   },
   {
      alpha2: 'GU',
      name: 'Guam',
   },
   {
      alpha2: 'GT',
      name: 'Guatemala',
   },
   {
      alpha2: 'GG',
      name: 'Guernsey',
   },
   {
      alpha2: 'GN',
      name: 'Guinea',
   },
   {
      alpha2: 'GW',
      name: 'Guinea-Bissau',
   },
   {
      alpha2: 'GY',
      name: 'Guyana',
   },
   {
      alpha2: 'HT',
      name: 'Haiti',
   },
   {
      alpha2: 'HM',
      name: 'Heard Island and McDonald Islands',
   },
   {
      alpha2: 'VA',
      name: 'Holy See',
   },
   {
      alpha2: 'HN',
      name: 'Honduras',
   },
   {
      alpha2: 'HK',
      name: 'Hong Kong',
   },
   {
      alpha2: 'HU',
      name: 'Hungary',
   },
   {
      alpha2: 'IS',
      name: 'Iceland',
   },
   {
      alpha2: 'IN',
      name: 'India',
   },
   {
      alpha2: 'ID',
      name: 'Indonesia',
   },
   {
      alpha2: 'IR',
      name: 'Iran (Islamic Republic of)',
   },
   {
      alpha2: 'IQ',
      name: 'Iraq',
   },
   {
      alpha2: 'IE',
      name: 'Ireland',
   },
   {
      alpha2: 'IM',
      name: 'Isle of Man',
   },
   {
      alpha2: 'IL',
      name: 'Israel',
   },
   {
      alpha2: 'IT',
      name: 'Italy',
   },
   {
      alpha2: 'JM',
      name: 'Jamaica',
   },
   {
      alpha2: 'JP',
      name: 'Japan',
   },
   {
      alpha2: 'JE',
      name: 'Jersey',
   },
   {
      alpha2: 'JO',
      name: 'Jordan',
   },
   {
      alpha2: 'KZ',
      name: 'Kazakhstan',
   },
   {
      alpha2: 'KE',
      name: 'Kenya',
   },
   {
      alpha2: 'KI',
      name: 'Kiribati',
   },
   {
      alpha2: 'KP',
      name: "Korea (the Democratic People's Republic of)",
   },
   {
      alpha2: 'KR',
      name: 'Korea (the Republic of)',
   },
   {
      alpha2: 'KW',
      name: 'Kuwait',
   },
   {
      alpha2: 'KG',
      name: 'Kyrgyzstan',
   },
   {
      alpha2: 'LA',
      name: "Lao People's Democratic Republic",
   },
   {
      alpha2: 'LV',
      name: 'Latvia',
   },
   {
      alpha2: 'LB',
      name: 'Lebanon',
   },
   {
      alpha2: 'LS',
      name: 'Lesotho',
   },
   {
      alpha2: 'LR',
      name: 'Liberia',
   },
   {
      alpha2: 'LY',
      name: 'Libya',
   },
   {
      alpha2: 'LI',
      name: 'Liechtenstein',
   },
   {
      alpha2: 'LT',
      name: 'Lithuania',
   },
   {
      alpha2: 'LU',
      name: 'Luxembourg',
   },
   {
      alpha2: 'MO',
      name: 'Macao',
   },
   {
      alpha2: 'MG',
      name: 'Madagascar',
   },
   {
      alpha2: 'MW',
      name: 'Malawi',
   },
   {
      alpha2: 'MY',
      name: 'Malaysia',
   },
   {
      alpha2: 'MV',
      name: 'Maldives',
   },
   {
      alpha2: 'ML',
      name: 'Mali',
   },
   {
      alpha2: 'MT',
      name: 'Malta',
   },
   {
      alpha2: 'MH',
      name: 'Marshall Islands',
   },
   {
      alpha2: 'MQ',
      name: 'Martinique',
   },
   {
      alpha2: 'MR',
      name: 'Mauritania',
   },
   {
      alpha2: 'MU',
      name: 'Mauritius',
   },
   {
      alpha2: 'YT',
      name: 'Mayotte',
   },
   {
      alpha2: 'MX',
      name: 'Mexico',
   },
   {
      alpha2: 'FM',
      name: 'Micronesia (Federated States of)',
   },
   {
      alpha2: 'MD',
      name: 'Moldova (the Republic of)',
   },
   {
      alpha2: 'MC',
      name: 'Monaco',
   },
   {
      alpha2: 'MN',
      name: 'Mongolia',
   },
   {
      alpha2: 'ME',
      name: 'Montenegro',
   },
   {
      alpha2: 'MS',
      name: 'Montserrat',
   },
   {
      alpha2: 'MA',
      name: 'Morocco',
   },
   {
      alpha2: 'MZ',
      name: 'Mozambique',
   },
   {
      alpha2: 'MM',
      name: 'Myanmar',
   },
   {
      alpha2: 'NA',
      name: 'Namibia',
   },
   {
      alpha2: 'NR',
      name: 'Nauru',
   },
   {
      alpha2: 'NP',
      name: 'Nepal',
   },
   {
      alpha2: 'NL',
      name: 'Netherlands',
   },
   {
      alpha2: 'NC',
      name: 'New Caledonia',
   },
   {
      alpha2: 'NZ',
      name: 'New Zealand',
   },
   {
      alpha2: 'NI',
      name: 'Nicaragua',
   },
   {
      alpha2: 'NE',
      name: 'Niger',
   },
   {
      alpha2: 'NG',
      name: 'Nigeria',
   },
   {
      alpha2: 'NU',
      name: 'Niue',
   },
   {
      alpha2: 'NF',
      name: 'Norfolk Island',
   },
   {
      alpha2: 'MP',
      name: 'Northern Mariana Islands',
   },
   {
      alpha2: 'NO',
      name: 'Norway',
   },
   {
      alpha2: 'OM',
      name: 'Oman',
   },
   {
      alpha2: 'PK',
      name: 'Pakistan',
   },
   {
      alpha2: 'PW',
      name: 'Palau',
   },
   {
      alpha2: 'PS',
      name: 'Palestine',
   },
   {
      alpha2: 'PA',
      name: 'Panama',
   },
   {
      alpha2: 'PG',
      name: 'Papua New Guinea',
   },
   {
      alpha2: 'PY',
      name: 'Paraguay',
   },
   {
      alpha2: 'PE',
      name: 'Peru',
   },
   {
      alpha2: 'PH',
      name: 'Philippines',
   },
   {
      alpha2: 'PN',
      name: 'Pitcairn',
   },
   {
      alpha2: 'PL',
      name: 'Poland',
   },
   {
      alpha2: 'PT',
      name: 'Portugal',
   },
   {
      alpha2: 'PR',
      name: 'Puerto Rico',
   },
   {
      alpha2: 'QA',
      name: 'Qatar',
   },
   {
      alpha2: 'MK',
      name: 'Republic of North Macedonia',
   },
   {
      alpha2: 'RO',
      name: 'Romania',
   },
   {
      alpha2: 'RU',
      name: 'Russian Federation',
   },
   {
      alpha2: 'RW',
      name: 'Rwanda',
   },
   {
      alpha2: 'RE',
      name: 'Reunion',
   },
   {
      alpha2: 'BL',
      name: 'Saint Barthelemy',
   },
   {
      alpha2: 'SH',
      name: 'Saint Helena, Ascension and Tristan da Cunha',
   },
   {
      alpha2: 'KN',
      name: 'Saint Kitts and Nevis',
   },
   {
      alpha2: 'LC',
      name: 'Saint Lucia',
   },
   {
      alpha2: 'MF',
      name: 'Saint Martin (French part)',
   },
   {
      alpha2: 'PM',
      name: 'Saint Pierre and Miquelon',
   },
   {
      alpha2: 'VC',
      name: 'Saint Vincent and the Grenadines',
   },
   {
      alpha2: 'WS',
      name: 'Samoa',
   },
   {
      alpha2: 'SM',
      name: 'San Marino',
   },
   {
      alpha2: 'ST',
      name: 'Sao Tome and Principe',
   },
   {
      alpha2: 'SA',
      name: 'Saudi Arabia',
   },
   {
      alpha2: 'SN',
      name: 'Senegal',
   },
   {
      alpha2: 'RS',
      name: 'Serbia',
   },
   {
      alpha2: 'SC',
      name: 'Seychelles',
   },
   {
      alpha2: 'SL',
      name: 'Sierra Leone',
   },
   {
      alpha2: 'SG',
      name: 'Singapore',
   },
   {
      alpha2: 'SX',
      name: 'Sint Maarten (Dutch part)',
   },
   {
      alpha2: 'SK',
      name: 'Slovakia',
   },
   {
      alpha2: 'SI',
      name: 'Slovenia',
   },
   {
      alpha2: 'SB',
      name: 'Solomon Islands',
   },
   {
      alpha2: 'SO',
      name: 'Somalia',
   },
   {
      alpha2: 'ZA',
      name: 'South Africa',
   },
   {
      alpha2: 'GS',
      name: 'South Georgia and the South Sandwich Islands',
   },
   {
      alpha2: 'SS',
      name: 'South Sudan',
   },
   {
      alpha2: 'ES',
      name: 'Spain',
   },
   {
      alpha2: 'LK',
      name: 'Sri Lanka',
   },
   {
      alpha2: 'SD',
      name: 'Sudan',
   },
   {
      alpha2: 'SR',
      name: 'Suriname',
   },
   {
      alpha2: 'SJ',
      name: 'Svalbard and Jan Mayen',
   },
   {
      alpha2: 'SE',
      name: 'Sweden',
   },
   {
      alpha2: 'CH',
      name: 'Switzerland',
   },
   {
      alpha2: 'SY',
      name: 'Syrian Arab Republic',
   },
   {
      alpha2: 'TW',
      name: 'Taiwan',
   },
   {
      alpha2: 'TJ',
      name: 'Tajikistan',
   },
   {
      alpha2: 'TZ',
      name: 'Tanzania, United Republic of',
   },
   {
      alpha2: 'TH',
      name: 'Thailand',
   },
   {
      alpha2: 'TL',
      name: 'Timor-Leste',
   },
   {
      alpha2: 'TG',
      name: 'Togo',
   },
   {
      alpha2: 'TK',
      name: 'Tokelau',
   },
   {
      alpha2: 'TO',
      name: 'Tonga',
   },
   {
      alpha2: 'TT',
      name: 'Trinidad and Tobago',
   },
   {
      alpha2: 'TN',
      name: 'Tunisia',
   },
   {
      alpha2: 'TR',
      name: 'Turkey',
   },
   {
      alpha2: 'TM',
      name: 'Turkmenistan',
   },
   {
      alpha2: 'TC',
      name: 'Turks and Caicos Islands',
   },
   {
      alpha2: 'TV',
      name: 'Tuvalu',
   },
   {
      alpha2: 'UG',
      name: 'Uganda',
   },
   {
      alpha2: 'UA',
      name: 'Ukraine',
   },
   {
      alpha2: 'AE',
      name: 'United Arab Emirates',
   },
   {
      alpha2: 'GB',
      name: 'United Kingdom of Great Britain and Northern Ireland',
   },
   {
      alpha2: 'UM',
      name: 'United States Minor Outlying Islands',
   },
   {
      alpha2: 'US',
      name: 'United States of America',
   },
   {
      alpha2: 'UY',
      name: 'Uruguay',
   },
   {
      alpha2: 'UZ',
      name: 'Uzbekistan',
   },
   {
      alpha2: 'VU',
      name: 'Vanuatu',
   },
   {
      alpha2: 'VE',
      name: 'Venezuela (Bolivarian Republic of)',
   },
   {
      alpha2: 'VN',
      name: 'Viet Nam',
   },
   {
      alpha2: 'VG',
      name: 'Virgin Islands (British)',
   },
   {
      alpha2: 'VI',
      name: 'Virgin Islands (U.S.)',
   },
   {
      alpha2: 'WF',
      name: 'Wallis and Futuna',
   },
   {
      alpha2: 'EH',
      name: 'Western Sahara',
   },
   {
      alpha2: 'YE',
      name: 'Yemen',
   },
   {
      alpha2: 'ZM',
      name: 'Zambia',
   },
   {
      alpha2: 'ZW',
      name: 'Zimbabwe',
   },
   {
      alpha2: 'AX',
      name: 'Aland Islands',
   },
],
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
      'getAttachments',
      'removeAttachment',
      'addAttachment',
    ]),

    upload() {
      this.addAttachment({ file: this.file, label: 'toefl' });
    },
    remove(id) {
      this.removeAttachment(id);
    },

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
    this.getAttachments();
    return this.getApplication();
  },
};
</script>
