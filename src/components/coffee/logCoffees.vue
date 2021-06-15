<template>
  <div class="row justify-content-center">
    <div class="col-12">
      <div class="card">
        <div class="card-header">Coffee Time Protocol</div>
        <div class="card-body">
          <vue-element-loading
              :active="!!loading"
              spinner="bar-fade-scale"
          />
          <table class="table table-striped- table-bordered table-hover">
            <thead>
            <tr>
              <th>Date</th>
              <th>Paid</th>
              <th>Whom</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="log in CoffeeLog" :key="log.key">
              <td>{{ log.date }}</td>
              <td>{{ log.paid }}</td>
              <td>{{ log.whom }}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {db} from "../../main";
import * as moment from "moment";
import VueElementLoading from "vue-element-loading";

export default {
  components: {VueElementLoading},
  data() {
    return {
      loading: false,
      CoffeeLog: []
    };
  },
  created() {
    this.loading = true;
    db.collection("coffeeLogs").onSnapshot(
        (snapshotChange) => {
          this.CoffeeLog = [];
          snapshotChange.forEach((doc) => {
            this.CoffeeLog.push({
              key: doc.id,
              date: !!doc.data() && doc.data().date ? moment(doc.data().date.toDate()).format("YYYY-MM-DD") : null,
              paid: doc.data().paid,
              whom: doc.data().whom.join(", ")
            });
          });
          this.loading = false;
        },
        () => {
          this.loading = false;
        });
  }
};
</script>
