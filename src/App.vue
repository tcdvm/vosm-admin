<template>
  <div id="app">
  <nav class="level">
    <div class="level-item has-text-centered">
      <div>
        <p class="heading">Total Registered</p>
        <p class="title">{{stats.numRegistered}}</p>
      </div>
    </div>
    <div class="level-item has-text-centered">
      <div>
        <p class="heading">ACVO/ECVO Diplomates</p>
        <p class="title">{{stats.numDiplomates}}</p>
      </div>
    </div>
    <div class="level-item has-text-centered">
      <div>
        <p class="heading">Presenters</p>
        <p class="title">{{stats.numPresenters}}</p>
      </div>
    </div>
    <div class="level-item has-text-centered">
      <div>
        <p class="heading">House Officers</p>
        <p class="title">{{stats.numHouseOfficers}}</p>
      </div>
    </div>
    <div class="level-item has-text-centered">
      <div>
        <p class="heading">RSVP for Reception</p>
        <p class="title">{{stats.numReception}}</p>
      </div>
    </div>
  </nav>
    <section>
    <b>Total checked</b>: {{ checkedRows.length }}
    <button class="button field is-danger" @click="checkedRows = []"
        :disabled="!checkedRows.length">
        <b-icon icon="close"></b-icon>
        <span>Delete Selected Rows</span>
    </button> 

    <b-table 
    :data="attendees" 
    :checked-rows.sync="checkedRows"
    default-sort="name"
    checkable
    >
    <template slot-scope="props">
      <b-table-column field="name" label="Name" sortable >
          {{ props.row.name }}
      </b-table-column>

      <b-table-column field="email" label="Email" sortable >
          {{ props.row.email }}
      </b-table-column>

      <b-table-column field="category" label="Category" sortable>
          {{ props.row.category }}
      </b-table-column>

      <b-table-column field="company" label="Company" sortable>
          {{ props.row.company }}
      </b-table-column>

      <b-table-column field="country" label="Country" sortable >
          {{ props.row.country }}
      </b-table-column>
     </template>
    </b-table>
    </section>
  </div>
</template>

<script>
import { dipRegistrantNumberRef } from './firebase';
import { otherRegistrantNumberRef } from './firebase';
import { attendeesRef } from './firebase';
import { deletedRef } from './firebase';

export default {
  name: 'app',
  components: {
  },
  data() {
    return {
      attendees: {},
      checkedRows: [],
      defaultSortDirection: 'asc',
      columns: [
            {
                field: 'name',
                label: 'Name',
                // width: '40',
                numeric: false
            },
            {
                field: 'category',
                label: 'Category',
            },
            {
                field: 'company',
                label: 'Company',
            },
            {
                field: 'email',
                label: 'Email',
                // centered: true
            },
            {
                field: 'country',
                label: 'Country',
            }
                ],
      options: {
        perPage: 150
      }
    }
  },
  computed: {
    stats: function() {
      let registerStats = this.attendees.reduce((totals, attender) => {
        if(totals[attender.category]) {
          totals[attender.category]++;
        } else {
          totals[attender.category] = 1;
        }
        return totals;
      }, {});

      let rsvpd = this.attendees.reduce((total, attender) => {
        if(attender.reception === "yes")
          total++;
        return total;
      },0 )

      let stats = {
        numRegistered: this.attendees.length,
        numDiplomates: registerStats.aecvodip,
        numPresenters: registerStats.presenter,
        numHouseOfficers: registerStats.houseofficer,
        numReception: rsvpd
      }
      return stats;
    },
  },
  firebase: {
    attendees: attendeesRef,
    deleted: deletedRef,
    dipnumber: {
      source: dipRegistrantNumberRef,
      asObject: true
    },
    othernumber: {
      source: otherRegistrantNumberRef,
      asObject: true
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
