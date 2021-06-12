<style>
ul {
  list-style-type: none;
}

li label {
  padding-left: 5px;
}

.checkboxes {
  padding-left: 0;
}
</style>
<template>
  <div>
    <div class="row justify-content-center">
      <div class="col-4">
        <vue-element-loading
            :active="!!loadingUsers"
            spinner="bar-fade-scale"
        />
        <form @submit.prevent="buyCoffee">
          <div class="form-group">
            <label for="willPay">Select an user</label>
            <select
                id="willPay"
                class="form-control"
                v-model="willPay"
                required
            >
              <option v-for="user in usersOrdered(Users)" :key="user.key" :value="user.key">
                {{ user.name }}
              </option>
            </select>
          </div>
          <br />
          <div class="form-group">
            <ul class="checkboxes">
              <li v-for="user in Users" :key="user.key">
                <input
                    type="checkbox"
                    v-model="willConsume"
                    v-bind:id="user.key"
                    v-bind:value="user.key"
                />
                <label v-bind:for="user.key">{{ user.name }}</label>
              </li>
            </ul>
          </div>
          <div class="col-4">
            <button
                type="submit"
                class="btn btn-primary btn-block"
                :disabled="!!buying"
            >
              Add
            </button>
          </div>
        </form>
      </div>
      <div class="col-8">
        <div class="card">
          <div class="card-header">List with all paid and consumed coffees</div>
          <div class="card-body">
            <vue-element-loading
                :active="!!loadingCoffee"
                spinner="bar-fade-scale"
            />
            <table class="table table-bordered table-responsive">
              <thead>
              <tr>
                <th>User</th>
                <th>Paid</th>
                <th>Drank</th>
                <th>Difference</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="coffees in CoffeeAccount" :key="coffees.key">
                <td>{{ coffees.user }}</td>
                <td>{{ coffees.paid }}</td>
                <td>{{ coffees.drank }}</td>
                <td>{{ coffees.difference }}</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from "../../main";
import VueElementLoading from "vue-element-loading";
import * as _ from "lodash";
import firebase from "firebase";

export default {
  components: { VueElementLoading },
  data() {
    return {
      CoffeeAccount: [],
      willPay: null,
      Users: [],
      willConsume: [],
      loadingUsers: false,
      loadingCoffee: false,
      buying: false
    };
  },
  created() {
    this.refresh();
  },
  methods: {
    refresh() {
      this.getUsers();
      this.getCoffeeAccount();
    },
    usersOrdered(users) {
      return _.orderBy(users, "difference", "asc");
    },
    getUsers() {
      this.loadingUsers = true;
      db.collection("users").where("active", "==", true).onSnapshot(
          (snapshotChange) => {
            snapshotChange.forEach((doc) => {
              db.collection("coffeeAccount")
                  .where("userId", "==", doc.id)
                  .get()
                  .then(data => {
                    const coffeeAccount = data.docs[0].data();
                    if (coffeeAccount.userId === doc.id) {
                      this.Users.push({
                        key: doc.id,
                        name: doc.data().name,
                        difference: coffeeAccount.paid - coffeeAccount.drank
                      });
                    }
                  });
            });
            this.loadingUsers = false;
          },
          () => {
            this.loadingUsers = false;
            this.error = true;
          }
      );
    },
    getCoffeeAccount() {
      this.loadingCoffee = true;
      db.collection("coffeeAccount").onSnapshot(
          (snapshotChange) => {
            this.CoffeeAccount = [];
            snapshotChange.forEach((doc) => {
              db.collection("users").doc(doc.data().userId).get()
                  .then(data => {
                    console.log(data.data())
                    const user = data.data().name;
                    const paid = +doc.data().paid;
                    const drank = +doc.data().drank;
                    this.CoffeeAccount.push({
                      key: doc.id,
                      user,
                      paid,
                      drank,
                      difference: paid - drank
                    });
                  });
            });
            this.loadingCoffee = false;
          },
          () => {
            this.loadingCoffee = false;
            this.error = true;
          }
      );
    },
    buyCoffee(event) {
      this.buying = true;
      event.preventDefault();
      db.collection("coffeeAccount")
          .where("userId", "in", this.willConsume)
          .get()
          .then((data) => {
            data.forEach((doc) => {
              const exist = this.willConsume.find(item => item === doc.data().userId);
              if (doc.data().userId === exist) {
                doc.ref.update({
                  drank: ++doc.data().drank
                });
              }
            });
          })
          .then(() => {
            db.collection("coffeeAccount")
                .where("userId", "==", this.willPay)
                .get()
                .then((data) => {
                  data.forEach((doc) => {
                    doc.ref.update({
                      paid: doc.data().paid += this.willConsume.length
                    });
                  });
                });
          })
          .then(() => {
            db.collection("users")
                .where(firebase.firestore.FieldPath.documentId(), "in", [this.willPay, ...this.willConsume])
                .get()
                .then(data => {
                  let willConsume = [];
                  let willPay = "";
                  data.forEach((doc) => {
                    this.willConsume.forEach(item => {
                      if (item === doc.id) {
                        willConsume.push(doc.data().name);
                      }
                    });
                    if (doc.id === this.willPay) {
                      willPay = doc.data().name;
                    }
                  });
                  console.log('logs');
                  db.collection("coffeeLogs")
                      .add({
                        date: firebase.firestore.FieldValue.serverTimestamp(),
                        paid: willPay,
                        whom: willConsume
                      });
                  this.buying = false;
                })
                .catch((err) => {
                  console.log(err);
                  this.buying = false;
                });
          })
          .catch((err) => {
            console.log(err);
            this.buying = false;
          });
    }
  }
};
</script>
