<template>
  <div class="container">
    <OCounter />
    <CCounter />
  </div>
</template>

<script>
import OCounter from './components/OCounter.vue'
import CCounter from './components/CCounter.vue'

export default {
  name: 'App',
  components: { OCounter, CCounter }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
