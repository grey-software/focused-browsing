<template>
  <div class="focus-container">
    <Quote />
    <MainCard />
    <CardLinks />
  </div>
</template>

<script>
import MainCard from './MainCard/MainCard.vue'
import Quote from './Quote/Quote.vue'
import CardLinks from './CardTextLinks/CardTextLinks.vue'

export default {
  name: 'FocusedFeedContainer',
  components: { MainCard, Quote, CardLinks },
}
</script>
