<template>
  <div class="focus-container">
    <Quote />
    <FocusCard />
    <Links />
  </div>
</template>

<script>
import FocusCard from './FocusCard.vue'
import Quote from './Quote.vue'
import Links from './Links.vue'

export default {
  name: 'FocusContainer',
  components: { FocusCard, Quote, Links },
}
</script>
