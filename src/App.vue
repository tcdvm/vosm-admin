<template>
  <div class="container" id="app">
    <section class="hero">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">
            VOSM Attendees
          </h1>
          <h2 class="subtitle">
            Summary & List
          </h2>
        </div>
      </div>
    </section>
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
  <section class="container">
      <p><strong>Open Spots (click to edit):</strong>
      <a @click="promptDipNumber"> Diplomates: {{dipnumber['.value']}}</a>
       | 
      <a @click="promptOtherNumber"> Other: {{ othernumber['.value']}}</a>
      </p>
    <!-- <nav class="level">
          <p class="level-item"><strong>Open Spots:</strong></p>
          <p class="level-item">Diplomates: {{dipnumber['.value']}}</p>
          <p class="level-item"><a class="button is-success" @click="promptDipNumber">Edit</a></p>
          <p class="level-item"> | </p>
          <p class="level-item">Other: {{ othernumber['.value']}}</p>
          <p class="level-item"><a class="button is-success" @click="promptOtherNumber">Edit</a></p>
    </nav> -->
  </section>
  <section class="section">
    <nav class="level">
      <!-- Left side -->
      <div class="level-left">
        <div class="level-item">
          <p class="subtitle is-5">
            <strong>{{checkedRows.length }} </strong> Selected
          </p>
        </div>
        <div class="level-item">
          <div class="field">
            <button class="button field is-danger" @click="confirmDeleteSelected"
              :disabled="!checkedRows.length">
              <b-icon icon="close"></b-icon>
              <span>Delete Checked Attendees</span>
            </button> 
          </div>
        </div>
        <div class="level-item">
          <div class="field">
            <button class="button field is-purple" 
              @click="isComponentModalActive = true"
              :disabled="Object.keys(selected).length === 0">
              <!-- :disabled="!selected"> -->
              <b-icon icon="pencil"></b-icon>
              <span>Edit Selected Attendees</span>
            </button> 
          </div>
        </div>
      </div>
      <div class="level-right">
        <div class="level-item">
          <b-field>
            <b-input placeholder="Search by name..."
                type="search"
                icon="magnify"
                v-model="searchQuery">
            </b-input>
          </b-field>
        </div>
      </div>
    </nav>
    
    <b-modal 
      :active.sync="isComponentModalActive" 
      has-modal-card>
        <modal-form 
          :email="selected.email"
          :name="selected.name"
          :company="selected.company"
          :country="selected.country"
          :reception="selected.reception"
          @update="updateSelected"
        ></modal-form>
    </b-modal>

    <b-table 
    :data="filter" 
    :checked-rows.sync="checkedRows"
    default-sort="name"
    :paginated="isPaginated"
    :perPage="perPage"
    :selected.sync="selected"
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
<download-excel
    class   = "button"
    :data   = "attendees"
    :fields = "exportFields"
    name    = "vosm-attendees.xls">
 
    Download Excel file of all VOSM Attendees
 
</download-excel>
    </section>
  </div>
  
</template>

<script>
import { dipRegistrantNumberRef } from './firebase';
import { otherRegistrantNumberRef } from './firebase';
import { attendeesRef } from './firebase';
import { deletedRef } from './firebase';

const deleteAttendee = function(attendee) {
  deletedRef.push({
    name: attendee.name,
    category: attendee.category,
    company: attendee.company,
    country: attendee.country,
    email: attendee.email,
    reception: attendee.reception,
    email_sent: attendee.email_sent,
  })

  attendeesRef.child(attendee['.key']).remove()
}

const ModalForm = {
    props: ['name', 'email', 'country', 'company', 'reception'],
    methods: {
      updateSelected: function (info) {
        this.$emit('update', info);
        console.log(info);
      }
    },
    template: `
      <form v-on:submit.prevent="updateSelected({name, email, country, company, reception})"> 
          <div class="modal-card" style="width: 500">
              <header class="modal-card-head">
                  <p class="modal-card-title">Edit Attendee</p>
              </header>
              <section class="modal-card-body">
                  <b-field label="Name" horizontal>
                      <b-input
                          type="text"
                          :value="name"
                          placeholder="Name"
                          required>
                      </b-input>
                  </b-field>

                  <b-field label="Email" horizontal>
                      <b-input
                          type="email"
                          :value="email"
                          placeholder="Email"
                          required>
                      </b-input>
                  </b-field>

                  <b-field label="Country" horizontal>
                      <b-input
                          type="text"
                          :value="country"
                          placeholder="Country"
                          required>
                      </b-input>
                  </b-field>

                  <b-field label="Company" horizontal>
                      <b-input
                          type="text"
                          :value="company"
                          placeholder="Company"
                          required>
                      </b-input>
                  </b-field>

<!--
                  <div class="block">
                    <b-radio 
                        native-value="Yes">
                        Flint
                    </b-radio>
                    <b-radio v-model="radio"
                        native-value="Silver">
                        Silver
                    </b-radio>
                  </div>
-->
              </section>
              <footer class="modal-card-foot">
                  <button class="button" type="button" @click="$parent.close()">Close</button>
                  <button 
                    class="button is-primary" 
                  >
                    Update
                  </button>
              </footer>
          </div>
      </form>
  `,
}

export default {
  name: 'app',
  components: {
    ModalForm
  },
  data() {
    return {
      attendees: {},
      searchQuery: '',
      checkedRows: [],
      selected: {},
      defaultSortDirection: 'asc',
      isPaginated: true,
      currentPage: 1,
      perPage: 15,
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
      },
      exportFields: {
        'name': 'name',
        'email': 'email',
        'company': 'company',
        'country': 'country',
        'category': {
          field: 'category',
          callback: (value) => {
            let cat = '';
            switch(value) {
              case 'aecvodip':
                cat = 'ACVO/ECVO Dip'
                break;
              case 'houseofficer':
                cat = 'House Officer'
                break;
              case 'presenter':
                cat = 'Presenter'
                break;
              case 'other':
                cat = 'Other'
                break;
              default:
                cat = 'Error'
                break;
            }
            return cat;
          }
         },
        'reception': 'reception'
      },
      isComponentModalActive: false,
      // formProps: {
      //     email: 'hi@hi.com',
      //     password: 'testing'
      // }
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
    filter: function() {
      var name_re = new RegExp(this.searchQuery, 'i')
      var data = []
      this.attendees.forEach(
        (currentAttendee) => {
          if(currentAttendee.name.match(name_re)) {
            data.push(currentAttendee)
          }
        }
      )
      return data
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
  },
  methods: {
    deleteSelected: function() {
      this.checkedRows.forEach((currentValue) => deleteAttendee(currentValue))
      this.checkedRows = []
    },
    confirmDeleteSelected() {
      let selectedNames = []
      this.checkedRows.forEach((currentAttendee) => {
        selectedNames.push(currentAttendee.name)
      })

      var nameList = "<ul>"
      selectedNames.forEach((name) => { nameList += '<li><b>' + name + '</b></li>' })
      nameList += "</ul>"

      this.$dialog.confirm({
        title: 'Deleting attendees',
        message: 'Are you sure you want to <b>delete</b> the selected attendees:<br>' + nameList,
        confirmText: 'Delete Attendees',
        type: 'is-danger',
        hasIcon: true,
        onConfirm: () => {
          this.$toast.open('Attendees deleted!')
          this.deleteSelected()
        }
      })
    },
    promptDipNumber() {
      this.$dialog.prompt({
          message: `Enter the # of open diplomate (dips, house officers, presenter) spots:`,
          confirmText: 'Set',
          inputAttrs: {
              type: 'number',
              placeholder: '# of open spots',
              value: this.dipnumber['.value'],
              maxlength: 2,
          },
          onConfirm: (value) => {
            this.$toast.open(`Setting open dip spots to : ${value}`)
            dipRegistrantNumberRef.set(parseInt(value))
          }
      })
    },
    promptOtherNumber() {
      this.$dialog.prompt({
          message: `Enter the # of open "other" (non-dips) spots:`,
          confirmText: 'Set',
          inputAttrs: {
              type: 'number',
              placeholder: '# of open spots',
              value: this.othernumber['.value'],
              maxlength: 2,
          },
          onConfirm: (value) => {
            this.$toast.open(`Setting open dip spots to : ${value}`)
            otherRegistrantNumberRef.set(parseInt(value))
          }
      })
    },
    updateSelected: function () {
      this.isComponentModalActive = false;
      this.$toast.open(this.selected.email);
      // console.log(this.selected.email);
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

.button.is-purple {
  background-color: #7957d5;
  color: #FFF;
}
.button.is-purple[disabled]{
  background-color: #7957d5;
  color: #FFF;
}
</style>
