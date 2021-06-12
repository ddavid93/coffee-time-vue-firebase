<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card">
          <vue-element-loading
              :active="!!loading"
              spinner="bar-fade-scale"
          />
          <div class="card-header">Login</div>
          <div class="card-body">
            <div v-if="error" class="alert alert-danger">{{ error }}</div>
            <form action="#" @submit.prevent="submit">
              <div class="form-group row">
                <label for="email" class="col-md-4 col-form-label text-md-right">Email</label>
                <div class="col-md-6">
                  <input
                      id="email"
                      type="email"
                      class="form-control"
                      name="email"
                      value
                      required
                      autofocus
                      v-model="form.email"
                  />
                </div>
              </div>
              <br>
              <div class="form-group row">
                <label for="password" class="col-md-4 col-form-label text-md-right">Password</label>

                <div class="col-md-6">
                  <input
                      id="password"
                      type="password"
                      class="form-control"
                      name="password"
                      required
                      v-model="form.password"
                  />
                </div>
              </div>
              <br>
              <div class="form-group row mb-0">
                <div class="col-md-8 offset-md-4">
                  <button type="submit" class="btn btn-primary">Login</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from "firebase";
import VueElementLoading from "vue-element-loading";

export default {
  components: { VueElementLoading },
  data() {
    return {
      loading: false,
      form: {
        email: "",
        password: ""
      },
      error: null
    };
  },
  methods: {
    submit() {
      this.loading = true;
      firebase
          .auth()
          .signInWithEmailAndPassword(this.form.email, this.form.password)
          .then(() => {
            this.loading = false;
            this.$router.replace({ name: "coffeeList" });
          })
          .catch(err => {
            this.loading = false;
            this.error = err.message;
          });
    }
  }
};
</script>
