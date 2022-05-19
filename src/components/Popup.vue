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

    <button id="github-button" @click="beginAuth">Sign in with Github</button>

    <Links />
  </div>
</template>

<script>
import Links from './Links.vue'
import { browser } from 'webextension-polyfill-ts'

export default {
  name: 'Popup',
  components: { Links },
  methods: {
    beginAuth() {
      console.log(browser.identity.launchWebAuthFlow)
      browser.identity
        .launchWebAuthFlow({
          url: 'https://github.com/login/oauth/authorize?client_id=aafa5f1e95867c5e7777',
        })
        .then((res) => console.log(res))
    },
  },
}
</script>

<style lang="scss" scoped></style>
