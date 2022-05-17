<template>
  <div class="popup-container">
    <div class="title-container">
      <p class="title">Focused Browsing</p>
    </div>

    <img alt="" class="illustration-yoga" src="/html/assets/popup/illustration-yoga.svg" />

    <p class="shortcut-container">
      Press
      <strong class="shortcut-caption-emphasis-1">LeftShift &#43; RightShift</strong>
      to show/hide feeds
    </p>
    <div class="seperator" />
    <a id="github-button" target="_blank"
      :href="`https://github.com/login/oauth/authorize?scope=user:arsala@grey.software&client_id=65615d22012f89567536`">
      Sign in with Github
    </a>
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

<style lang="scss" scoped>
</style>
