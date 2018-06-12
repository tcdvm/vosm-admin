<template>
  <div id="app">
    <b-table 
    :data="attendees" 
    :columns="columns"
    :checked-rows.sync="checkedRows"
    checkable
    >
     <template slot="bottom-left">
      <b>Total checked</b>: {{ checkedRows.length }}
     </template>
    </b-table>
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
      test: [
              { 'id': 1, 'first_name': 'Jesse', 'last_name': 'Simmons', 'date': '2016-10-15 13:43:27', 'gender': 'Male' },
              { 'id': 2, 'first_name': 'John', 'last_name': 'Jacobs', 'date': '2016-12-15 06:00:53', 'gender': 'Male' },
              { 'id': 3, 'first_name': 'Tina', 'last_name': 'Gilbert', 'date': '2016-04-26 06:26:28', 'gender': 'Female' },
              { 'id': 4, 'first_name': 'Clarence', 'last_name': 'Flores', 'date': '2016-04-10 10:28:46', 'gender': 'Male' },
              { 'id': 5, 'first_name': 'Anne', 'last_name': 'Lee', 'date': '2016-12-06 14:38:38', 'gender': 'Female' }
            ],
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
