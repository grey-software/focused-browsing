<template>
  <div class="popup-container">
    <div class="title-container">
      <p class="title">Focused Browsing</p>
    </div>

    <img alt="" class="illustration-yoga" src="/html/assets/popup/illustration-yoga.svg" />

    <p class="shortcut-container">
      Press
      <strong class="shortcut-container-emphasis-1">LeftShift &#43; RightShift</strong>
      to show or hide the feed.
    </p>
    <div class="seperator" />
    <Links />
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
