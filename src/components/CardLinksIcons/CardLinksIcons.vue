<template>
  <div class="icon-links-container">
    <a href="" @click="openFocusedBrowsing" class="link-logo">
      <div class="icon-info">
        <img alt="" class="vector" src="/www/assets/icons/icon-info.svg" />
      </div>
    </a>
    <a href="" @click="openFeedback" class="link-logo">
      <div class="icon-feedback">
        <img alt="" class="vector" src="/www/assets/icons/icon-feedback.svg" />
      </div>
    </a>
    <a href="" @click="openGrey" class="link-logo"
      ><div class="icon-logo">
        <img alt="" class="group-two" src="/www/assets/icons/grey-left.svg" /><img
          alt=""
          class="group-two"
          src="/www/assets/icons/grey-right.svg"
        /></div
    ></a>
  </div>
</template>

<script>
export default {
  name: 'CardTextLinks',
  data() {
    return {}
  },
  methods: {
    openGrey() {
      window.open('https://org.grey.software/')
    },
    openFeedback() {
      window.open('https://github.com/grey-software/focused-browsing/issues/new/choose')
    },
    openFocusedBrowsing() {
      window.open('https://org.grey.software/focused-browsing/')
    },
  },
}
</script>
