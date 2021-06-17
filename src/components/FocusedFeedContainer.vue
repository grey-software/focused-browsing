<template>
  <div class="focus-container">
       <MainCard />
       <Quote />
       <CardTextLinks />
  </div>
</template>

<script>

import MainCard from './MainCard/MainCard.vue'
import Quote from './Quote/Quote.vue'
import CardTextLinks from './CardTextLinks/CardTextLinks.vue'

export default {
  name: "FocusedFeedContainer",
  components: { MainCard, Quote, CardTextLinks}
};
</script>