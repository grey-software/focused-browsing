<template>
  <div class="card card-body m-4">
    <h3>Options API + Vuex</h3>
    <h5 class="text-center">{{ counter }} x 2 = {{ times2 }}</h5>
    <button class="btn btn-primary" @click="inc">Increment</button>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapState } from 'vuex'

export default {
  computed: {
    ...mapState(['counter']),
    ...mapGetters(['times2'])
  },
  methods: {
    ...mapMutations(['setCounter']),
    inc() {
      this.setCounter(this.counter + 1)
    }
  }
}
</script>
