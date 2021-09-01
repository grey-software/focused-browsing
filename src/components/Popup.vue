<template>
  <div class="popup-container">
    <div class="title-container">
      <p class="title">Focused Browsing</p>
    </div>
    <img alt="" class="illustration-yoga" src="/html/assets/popup/illustration-yoga.svg" />

    <p class="press-shift-f-b-to-show-or-hide-the">
      Press
      <strong class="press-shift-f-b-to-show-or-hide-the-emphasis-1">LeftShift &#43; RightShift</strong>
      to show or hide the feed.
    </p>
    <img alt="" class="vector-3" src="/html/assets/popup/popup-divider.svg" />
    <CardLinksIcons />
  </div>
</template>

<script>
import Links from './Links.vue'
export default {
  name: 'Popup',
  components: { Links },
}
</script>

<style lang="scss" scoped></style>
