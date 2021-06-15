<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-6">
        <div class="card">
          <div class="card-header">
            <h4>
              Handling Users
            </h4>
          </div>
          <div class="card-body">
            <div class="row justify-content-center">
              <h4 v-if="!!error">Error Fetching data</h4>
              <vue-element-loading
                  :active="!!loading"
                  spinner="bar-fade-scale"
              />
              <table class="table table-striped- table-bordered table-hover">
                <thead>
                <tr>
                  <th>Name</th>
                  <th>Active</th>
                  <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="user in Users" :key="user.key">
                  <td>{{ user.name }}</td>
                  <td>
                    <input
                        type="checkbox"  v-if="user.name !== 'guestUser'"
                        @change.prevent="activateDeactivateUser(user)"
                        v-model="user.active"
                    />
                  </td>
                  <td>
                    <button v-if="user.name !== 'guestUser'"
                        @click.prevent="deleteUser(user.key)"
                        class="btn btn-danger"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from "../../main";
import VueElementLoading from "vue-element-loading";

export default {
  components: { VueElementLoading },
  data() {
    return {
      Users: [],
      loading: false,
      error: false
    };
  },
  created() {
    this.getUsers();
  },
  methods: {
    getUsers() {
      this.loading = true;
      db.collection("users").onSnapshot(
          (snapshotChange) => {
            this.Users = [];
            snapshotChange.forEach((doc) => {
              this.Users.push({
                key: doc.id,
                name: doc.data().name,
                active: doc.data().active
              });
            });
            this.loading = false;
          },
          () => {
            this.loading = false;
            this.error = true;
          }
      );
    },
    activateDeactivateUser(user) {
      this.loading = true;
      db.collection("users")
          .doc(user.key)
          .update({ active: user.active })
          .then(() => {
            this.loading = false;
          })
          .catch(() => {
            this.loading = false;
          });
    },
    deleteUser(userId) {
      if (window.confirm("Do you really want to delete?")) {
        this.loading = true;
        db.collection("users")
            .doc(userId)
            .delete()
            .then(() => {
              this.deleteCoffeeAccount(userId);
            })
            .catch(() => {
              this.loading = false;
            });
      }
    },
    deleteCoffeeAccount(userId) {
      db.collection("coffeeAccount")
          .where("userId", "==", userId)
          .get()
          .then((snapshot) => {
            snapshot.forEach((doc) => {
              db.collection("coffeeAccount").doc(doc.id).delete();
            });
            this.loading = false;
          })
          .catch(() => {
            this.loading = false;
          });
    }
  }
};
</script>
