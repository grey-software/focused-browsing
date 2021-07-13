<template>
  <div class="popup-container">
    <div class="title-container">
      <p class="title">Focused Browsing</p>
    </div>
    <img alt="" class="illustration-yoga" src="/www/assets/popup/illustration-yoga.svg" />

    <p class="press-shift-f-b-to-show-or-hide-the">
      Press
      <strong class="press-shift-f-b-to-show-or-hide-the-emphasis-1">Shift &#43; F &#43; B </strong>
      to show or hide the feed.
    </p>
    <img alt="" class="vector-3" src="/www/assets/popup/popup-divider.svg" />
    <CardLinksIcons />
  </div>
</template>

<script>
import CardLinksIcons from './CardLinksIcons/CardLinksIcons.vue'
export default {
  name: 'Popup',
  components: { CardLinksIcons }
}
</script>

<style lang="scss" scoped></style>
