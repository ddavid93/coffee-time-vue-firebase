<template>
  <form @submit.prevent="create">
    <div class="row justify-content-center">
      <vue-element-loading :active="!!saving" spinner="bar-fade-scale" />
      <div class="col-8">
        <div class="form-group">
          <input
              :disabled="!!loading"
              placeholder="Name"
              type="text"
              class="form-control"
              v-model="user.name"
              required
          />
        </div>
      </div>
      <div class="col-4">
        <button
            type="submit"
            class="btn btn-primary btn-block"
            :disabled="!!loading"
        >
          Add
        </button>
      </div>
    </div>
  </form>
</template>

<script>
import { db } from "../../main";
import VueElementLoading from "vue-element-loading";

export default {
  components: { VueElementLoading },
  props: ["loading"],
  data() {
    return {
      saving: false,
      user: {
        active: true,
        name: ""
      }
    };
  },
  methods: {
    create(event) {
      this.saving = true;
      event.preventDefault();
      db.collection("users")
          .add(this.user)
          .then(async (user) => {
            this.user.name = "";
            this.createCoffeeAccount(await user);
          })
          .catch(() => {
            this.saving = false;
          });
    },
    createCoffeeAccount(user) {
      db.collection("coffeeAccount")
          .add({ paid: 0, drank: 0, userId: user.id })
          .then(() => {
            this.saving = false;
          })
          .catch(() => {
            this.saving = false;
          });
    }
  }
};
</script>
