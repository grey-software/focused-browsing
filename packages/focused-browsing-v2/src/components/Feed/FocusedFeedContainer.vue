<template>
  <div class="focus-container-twitter">
       <MainCard />
       <Quote />
       <CardTextLinks />
    <!-- <div class="card-container">
      <p class="heading-two">
        Press Command/Ctrl&#43;shift&#43;1 to toggle on
        and off
      </p>
    </div> -->
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

<style lang="scss" scoped>
</style>