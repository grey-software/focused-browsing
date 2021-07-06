<template>
  <div class="focus-container">
    <Quote />
    <MainCard />
    <CardLinksIcons />
  </div>
</template>

<script>
import MainCard from './MainCard/MainCard.vue'
import Quote from './Quote/Quote.vue'
import CardLinksIcons from './CardLinksIcons/CardLinksIcons.vue'

export default {
  name: 'FocusedFeedContainer',
  components: { MainCard, Quote, CardLinksIcons },
}
</script>
