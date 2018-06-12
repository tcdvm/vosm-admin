<template>
  <div id="app">
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
